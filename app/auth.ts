import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

// Helper to get user by email
async function getUser(email: string) {
    try {
        const user = await sql`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

// Helper for device ID
export async function getOrSetDeviceId() {
    const store = await cookies();
    let id = store.get("rs_device_id")?.value;
    if (!id) {
        id = randomUUID();
        try {
            store.set("rs_device_id", id, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 365, // 1 year
                sameSite: "lax",
                path: '/', // Ensure cookie is set for whole site
            });
        } catch (err) {
            console.error("Failed to set device cookie:", err);
            // Non-blocking, proceed with generated ID
        }
    }
    return id;
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.hashed_password);

                    if (passwordsMatch) {
                        // --- Device Limit Logic ---
                        const deviceId = await getOrSetDeviceId();

                        // 1. Fetch active sessions for this user, ordered by creation (oldest first)
                        const sessions = await sql`
                            SELECT * FROM sessions 
                            WHERE user_id = ${user.id} 
                            ORDER BY created_at ASC
                        `;

                        // 2. Build list of unique device IDs currently active
                        const uniqueDevices = Array.from(new Set(sessions.rows.map(s => s.device_id)));

                        // 3. Check limit
                        // If current device is NOT in the list, and we already have 5 or more...
                        if (!uniqueDevices.includes(deviceId) && uniqueDevices.length >= 5) {
                            // Identify oldest device (first in list because of ORDER BY created_at ASC)
                            const oldestDeviceId = uniqueDevices[0];

                            // Revoke all sessions for that oldest device
                            await sql`DELETE FROM sessions WHERE user_id = ${user.id} AND device_id = ${oldestDeviceId}`;
                            console.log(`User ${user.id}: Revoked device ${oldestDeviceId} to allow ${deviceId}`);
                        }

                        // 4. Create proper Database Session for this login
                        // Even though we strictly use JWT for the browser session token in NextAuth with Credentials,
                        // we MUST track this "login" in our sessions table to enforce the limit next time.
                        // We'll generate a session token to store, even if NextAuth uses its own JWE.
                        const sessionToken = randomUUID();
                        const expires = new Date();
                        expires.setDate(expires.getDate() + 30); // 30 day expiration

                        try {
                            await sql`
                                INSERT INTO sessions (user_id, session_token, device_id, expires)
                                VALUES (${user.id}, ${sessionToken}, ${deviceId}, ${expires.toISOString()})
                                ON CONFLICT (session_token) DO NOTHING
                            `;
                        } catch (err) {
                            console.error("Failed to insert session:", err);
                        }

                        // Return user object to complete sign-in
                        // We attach deviceId to the user object so it can be passed to the token
                        return {
                            ...user,
                            id: user.id.toString(), // Ensure ID is string
                            email: user.email,
                            deviceIdFromAuth: deviceId,
                        } as any;
                    }
                }
                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                // @ts-ignore
                token.deviceId = user.deviceIdFromAuth;
                // @ts-ignore
                token.passwordLastUpdated = user.password_updated_at;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                // @ts-ignore
                session.user.deviceId = token.deviceId as string;
                // @ts-ignore
                session.user.passwordLastUpdated = token.passwordLastUpdated as string | null;
            }
            return session;
        },
    },
});

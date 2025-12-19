import { db } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const { email, password, username, companyName } = await req.json();

        // Basic validation
        const parsed = z
            .object({
                email: z.string().email(),
                password: z.string().min(8).regex(/[0-9]/, "Password must contain a number").regex(/[a-z]/, "Password must contain a lowercase letter").regex(/[A-Z]/, "Password must contain an uppercase letter"),
                username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric"),
                companyName: z.string().optional(),
            })
            .safeParse({ email, password, username, companyName });

        if (!parsed.success) {
            return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }

        const client = await db.connect();

        // Check if user exists (email or username)
        const existingUser = await client.sql`
          SELECT id FROM users WHERE email=${email} OR username=${username}
        `;

        if (existingUser.rows.length > 0) {
            return Response.json({ error: 'User with this email or username already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const result = await client.sql`
          INSERT INTO users (email, username, hashed_password)
          VALUES (${email}, ${username}, ${hashedPassword})
          RETURNING id, email, username
        `;

        // (Optional) If we had a profiles table, we'd insert companyName there.
        // For now, ignoring companyName as per strict schema instructions unless we add a profile table.
        // Prompt said "companyName (if you want to store it...)" -> "schema... match DB adapter".
        // Use minimal schema from setup-db.

        return Response.json({ user: result.rows[0] });
    } catch (error) {
        console.error('Registration error:', error);
        // Expose the error message to the client for debugging
        const errorMessage = error instanceof Error ? error.message : String(error);
        return Response.json({ error: `Registration failed: ${errorMessage}` }, { status: 500 });
    }
}

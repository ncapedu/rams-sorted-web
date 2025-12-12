import { db } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const { email, password, companyName } = await req.json();

        // Basic validation
        const parsed = z
            .object({
                email: z.string().email(),
                password: z.string().min(8),
                companyName: z.string().optional(),
            })
            .safeParse({ email, password, companyName });

        if (!parsed.success) {
            return Response.json({ error: 'Invalid input' }, { status: 400 });
        }

        const client = await db.connect();

        // Check if user exists
        const existingUser = await client.sql`
      SELECT id FROM users WHERE email=${email}
    `;

        if (existingUser.rows.length > 0) {
            return Response.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const result = await client.sql`
      INSERT INTO users (email, hashed_password)
      VALUES (${email}, ${hashedPassword})
      RETURNING id, email
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

import { NextResponse } from "next/server";
import { auth, signOut } from "@/app/auth";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { z } from "zod";

const closeAccountSchema = z.object({
    password: z.string().min(1, "Password is required"),
});

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validation = closeAccountSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { password } = validation.data;

        // 1. Fetch user to verify password
        const userResult = await sql`SELECT * FROM users WHERE email=${session.user.email}`;
        const user = userResult.rows[0];

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 2. Verify password
        const passwordsMatch = await bcrypt.compare(password, user.hashed_password);
        if (!passwordsMatch) {
            return NextResponse.json({ error: "Incorrect password" }, { status: 403 });
        }

        // 3. Delete user (Cascade handling is assumed based on schema, otherwise we might need manual cleanup)
        // Ensure you are deleting by ID to be safe
        await sql`DELETE FROM users WHERE id=${user.id}`;

        return NextResponse.json({ message: "Account closed successfully" });

    } catch (error) {
        console.error("Error closing account:", error);
        return NextResponse.json(
            { error: "Failed to close account" },
            { status: 500 }
        );
    }
}

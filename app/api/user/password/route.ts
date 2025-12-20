import { auth } from "@/app/auth";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validation = passwordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { currentPassword, newPassword } = validation.data;

        // Fetch user's current hash
        const result = await sql`
            SELECT id, hashed_password FROM users WHERE email = ${session.user.email}
        `;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = result.rows[0];

        // Verify current password
        const passwordsMatch = await bcrypt.compare(currentPassword, user.hashed_password);
        if (!passwordsMatch) {
            return NextResponse.json(
                { error: "Incorrect current password" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update DB
        await sql`
            UPDATE users 
            SET 
                hashed_password = ${hashedNewPassword},
                password_updated_at = NOW()
            WHERE id = ${user.id}
        `;

        return NextResponse.json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Password update error:", error);
        return NextResponse.json(
            { error: "Failed to update password" },
            { status: 500 }
        );
    }
}

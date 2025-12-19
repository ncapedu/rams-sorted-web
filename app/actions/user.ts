"use server";

import { auth } from "@/app/auth";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const name = formData.get("name") as string;

    // Simple validation
    if (!name || name.trim().length < 2) {
        throw new Error("Name must be at least 2 characters");
    }

    try {
        await sql`
            UPDATE users 
            SET name = ${name}
            WHERE id = ${session.user.id}
        `;
        revalidatePath("/app/settings/profile");
        return { success: true };
    } catch (e) {
        console.error("Failed to update profile", e);
        return { error: "Failed to update profile" };
    }
}

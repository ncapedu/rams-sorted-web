import { auth } from "@/app/auth";
import { db } from "@vercel/postgres";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const client = await db.connect();
        // Fetch all doc types. For now, let's assume we store them all or just RAMS.
        // The prompt says "RAMS / COSHH / Toolbox document is stored".
        // The current Wizard creates RAMS files. 
        // We'll return a unified list or just RAMS for the "My Files" list.
        // The current frontend `RAMSFile` type expects simple ID/Name/Date/Content (HTML).
        // Our DB schema `rams_documents` has `title`, `payload` (JSON), `pdf_url?`.
        // We should map DB rows to frontend expectations.

        const rams = await client.sql`
            SELECT id, title as name, created_at, payload 
            FROM rams_documents 
            WHERE user_id = ${session.user.id} 
            ORDER BY created_at DESC
        `;

        // Map to frontend format
        const files = rams.rows.map(row => ({
            id: row.id,
            name: row.name,
            createdAt: new Date(row.created_at).toLocaleString(),
            content: row.payload.htmlContent || "", // Assuming we store htmlContent in payload
            // If payload structure differs, we need to adapt.
            // Current `generateRAMS` produces `RAMSFile` with `content` string (HTML).
            // We should store that in the DB.
        }));

        return Response.json(files);
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const { id, name, content, payload } = await req.json();
        // Frontend sends: id (optional logic), name, content (HTML).
        // We should store:
        // user_id
        // title (name)
        // payload (JSON with HTML content and other data if available)

        const client = await db.connect();

        // Check if updating or creating?
        // If ID is valid UUID, we might be updating. But frontend uses TS timestamps as IDs currently.
        // We might need to handle this.
        // Strategy: always create new if ID looks like timestamp? Or rely on returned UUID?
        // Prompt says "Every RAMS ... is stored".
        // Let's Insert.

        // We'll store the HTML content in the payload for now to match current simple frontend model.
        const dbPayload = {
            htmlContent: content,
            ...payload // any extra data
        };

        const result = await client.sql`
            INSERT INTO rams_documents (user_id, title, payload)
            VALUES (${session.user.id}, ${name}, ${JSON.stringify(dbPayload)})
            RETURNING id, title, created_at
        `;

        const row = result.rows[0];

        return Response.json({
            id: row.id,
            name: row.title,
            createdAt: new Date(row.created_at).toLocaleString(),
            content: content
        });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return Response.json({ error: "Missing ID" }, { status: 400 });

        const client = await db.connect();
        await client.sql`DELETE FROM rams_documents WHERE id=${id} AND user_id=${session.user.id}`;

        return Response.json({ success: true });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}

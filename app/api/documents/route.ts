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

        // Fetch from all 3 tables
        const [rams, coshh, toolbox] = await Promise.all([
            client.sql`
                SELECT id, title as name, created_at, payload, 'RAMS' as type
                FROM rams_documents 
                WHERE user_id = ${session.user.id} 
            `,
            client.sql`
                SELECT id, title as name, created_at, payload, 'COSHH' as type
                FROM coshh_assessments 
                WHERE user_id = ${session.user.id} 
            `,
            client.sql`
                SELECT id, title as name, created_at, payload, 'TOOLBOX' as type
                FROM toolbox_talks 
                WHERE user_id = ${session.user.id} 
            `
        ]);

        const allDocs = [
            ...rams.rows,
            ...coshh.rows,
            ...toolbox.rows
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // Map to frontend format
        const files = allDocs.map(row => ({
            id: row.id,
            name: row.name,
            createdAt: new Date(row.created_at).toLocaleString(),
            content: row.payload.htmlContent || "",
            type: row.type,
            // Include extra data if needed
            ...row.payload
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
        const { id, name, content, payload, type } = await req.json();
        // Frontend sends: name, content (HTML), payload (data), type (RAMS/COSHH/TOOLBOX)

        const client = await db.connect();

        const dbPayload = {
            htmlContent: content,
            ...payload
        };

        let result;
        // Default to RAMS for backward compatibility if type is missing or generic
        let finalType = type;
        if (!finalType || (finalType !== 'COSHH' && finalType !== 'TOOLBOX')) {
            finalType = 'RAMS';
        }

        if (finalType === 'COSHH') {
            result = await client.sql`
                INSERT INTO coshh_assessments (user_id, title, payload)
                VALUES (${session.user.id}, ${name}, ${JSON.stringify(dbPayload)})
                RETURNING id, title, created_at
            `;
        } else if (finalType === 'TOOLBOX') {
            result = await client.sql`
                INSERT INTO toolbox_talks (user_id, title, payload)
                VALUES (${session.user.id}, ${name}, ${JSON.stringify(dbPayload)})
                RETURNING id, title, created_at
            `;
        } else {
            // RAMS
            result = await client.sql`
                INSERT INTO rams_documents (user_id, title, payload)
                VALUES (${session.user.id}, ${name}, ${JSON.stringify(dbPayload)})
                RETURNING id, title, created_at
            `;
        }

        const row = result.rows[0];

        return Response.json({
            id: row.id,
            name: row.title,
            createdAt: new Date(row.created_at).toLocaleString(),
            content: content,
            type: finalType
        });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const { id, name, content, payload, type } = await req.json();

        if (!id) return Response.json({ error: "Missing ID" }, { status: 400 });

        const client = await db.connect();
        const dbPayload = {
            htmlContent: content,
            ...payload
        };

        // Determine table based on type
        let table = 'rams_documents';
        if (type === 'COSHH') table = 'coshh_assessments';
        if (type === 'TOOLBOX' || type === "TOOLBOX_TALK") table = 'toolbox_talks';

        // Update the record safely
        // Note: Dynamic table name in SQL literal requires safe handling. 
        // Providing specific queries per type is safer against SQL injection if table variable isn't trusted, 
        // but here it's strictly controlled by our logic.

        let result;
        if (type === 'COSHH') {
            result = await client.sql`
                UPDATE coshh_assessments 
                SET title = ${name}, payload = ${JSON.stringify(dbPayload)}
                WHERE id = ${id} AND user_id = ${session.user.id}
                RETURNING id, title, created_at
            `;
        } else if (type === 'TOOLBOX' || type === "TOOLBOX_TALK") {
            result = await client.sql`
                UPDATE toolbox_talks 
                SET title = ${name}, payload = ${JSON.stringify(dbPayload)}
                WHERE id = ${id} AND user_id = ${session.user.id}
                RETURNING id, title, created_at
            `;
        } else {
            result = await client.sql`
                UPDATE rams_documents 
                SET title = ${name}, payload = ${JSON.stringify(dbPayload)}
                WHERE id = ${id} AND user_id = ${session.user.id}
                RETURNING id, title, created_at
            `;
        }

        if (result.rowCount === 0) {
            return Response.json({ error: "Document not found or unauthorized" }, { status: 404 });
        }

        const row = result.rows[0];
        return Response.json({
            id: row.id,
            name: row.title,
            createdAt: new Date(row.created_at).toLocaleString(),
            content: content,
            type: type
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

        // Try deleting from all tables
        await Promise.all([
            client.sql`DELETE FROM rams_documents WHERE id=${id} AND user_id=${session.user.id}`,
            client.sql`DELETE FROM coshh_assessments WHERE id=${id} AND user_id=${session.user.id}`,
            client.sql`DELETE FROM toolbox_talks WHERE id=${id} AND user_id=${session.user.id}`
        ]);

        return Response.json({ success: true });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}

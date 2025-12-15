import { auth } from "@/app/auth";
import { db } from "@vercel/postgres";
import Dashboard from "./Dashboard";

export const dynamic = 'force-dynamic';

export default async function Page() {
    const session = await auth();
    // If no session, Dashboard will show "Not signed in" naturally or we can redirect.
    // Dashboard handles "Not signed in" state in sidebar, but lists might be empty.

    let initialFiles: any[] = [];

    if (session?.user?.id) {
        try {
            const client = await db.connect();
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

            initialFiles = allDocs.map(row => ({
                id: row.id,
                name: row.name,
                createdAt: new Date(row.created_at).toLocaleString(),
                content: row.payload.htmlContent || "",
                type: row.type,
                ...row.payload
            }));
        } catch (err) {
            console.error("Failed to fetch initial files", err);
        }
    }

    return <Dashboard initialFiles={initialFiles} />;
}

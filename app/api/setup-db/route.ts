import { db } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
    const client = await db.connect();
    try {
        // 1. Users Table
        await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        hashed_password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

        // 2. Sessions Table (for device tracking & NextAuth)
        // We ensure it has enough fields for NextAuth + our Device Limits
        await client.sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        session_token TEXT NOT NULL UNIQUE,
        device_id TEXT NOT NULL,
        user_agent TEXT,
        ip_address TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        expires TIMESTAMPTZ NOT NULL
      );
    `;

        // 3. Document Tables - Access & Isolation
        // RAMS Documents
        await client.sql`
        CREATE TABLE IF NOT EXISTS rams_documents (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            payload JSONB NOT NULL,
            pdf_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `;

        // COSHH Assessments
        await client.sql`
        CREATE TABLE IF NOT EXISTS coshh_assessments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            payload JSONB NOT NULL,
            pdf_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `;

        // Toolbox Talks
        await client.sql`
        CREATE TABLE IF NOT EXISTS toolbox_talks (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            payload JSONB NOT NULL,
            pdf_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `;

        return Response.json({ message: 'Database initialized successfully' });
    } catch (error) {
        return Response.json({ error: String(error) }, { status: 500 });
    } finally {
        /* release connection if using pool, but client from db.connect() needs release? 
           @vercel/postgres `db` usually handles pooling, but let's be safe.
           Actually `client` from `db.connect()` is a VercelPoolClient, it doesn't have .end() usually needed for edge?
           Best practice in Vercel Postgres for one-off scripts: just await execution.
        */
    }
}

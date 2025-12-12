
require('dotenv').config({ path: '.env.local' });
const { createPool } = require('@vercel/postgres');

const db = createPool({
    connectionString: process.env.POSTGRES_URL
});

async function setup() {
    const client = await db.connect();
    try {
        console.log('Starting database setup...');

        // 1. Users Table
        await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        hashed_password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
        console.log('Checked/Created users table.');

        // 2. Sessions Table
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
        // Ensure columns exist (idempotent)
        await client.sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS device_id TEXT;`;
        await client.sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS user_agent TEXT;`;
        await client.sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ip_address TEXT;`;
        console.log('Checked/Created sessions table.');

        // 3. Document Tables
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
        console.log('Checked/Created rams_documents table.');

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
        console.log('Checked/Created coshh_assessments table.');

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
        console.log('Checked/Created toolbox_talks table.');

        console.log('✅ Database setup completed successfully.');

    } catch (error) {
        console.error('❌ Database setup failed:', error);
    } finally {
        await client.end();
    }
}

setup();

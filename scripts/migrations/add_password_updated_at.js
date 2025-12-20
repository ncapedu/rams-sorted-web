const { db } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function main() {
    const client = await db.connect();

    try {
        console.log('Running migration: Add password_updated_at to users table...');

        await client.sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS password_updated_at TIMESTAMP WITH TIME ZONE;
    `;

        console.log('Successfully added password_updated_at column.');
    } catch (err) {
        console.error('Error running migration:', err);
    } finally {
        await client.end();
    }
}

main();

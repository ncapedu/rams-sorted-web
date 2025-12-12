
require('dotenv').config({ path: '.env.local' });
const { createPool } = require('@vercel/postgres');

const db = createPool({
    connectionString: process.env.POSTGRES_URL
});

async function checkUsers() {
    const client = await db.connect();
    try {
        const res = await client.sql`SELECT count(*) FROM users`;
        console.log('User count:', res.rows[0].count);

        const lastUser = await client.sql`SELECT email, created_at FROM users ORDER BY created_at DESC LIMIT 1`;
        if (lastUser.rows.length > 0) {
            console.log('Latest user:', lastUser.rows[0]);
        }

    } catch (err) {
        console.error('Error checking users:', err);
    } finally {
        await client.end();
    }
}

checkUsers();

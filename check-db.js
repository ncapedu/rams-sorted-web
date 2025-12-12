
require('dotenv').config({ path: '.env.local' });
const { db } = require('@vercel/postgres');

async function check() {
    const client = await db.connect();
    try {
        const res = await client.sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'sessions';
    `;
        console.log('Sessions table columns:', res.rows);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        // process.exit(0); // script needs to stay alive for async? no.
    }
}

check();

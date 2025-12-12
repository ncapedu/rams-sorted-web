
require('dotenv').config({ path: '.env.local' });
const { createPool } = require('@vercel/postgres');

const db = createPool({
    connectionString: process.env.POSTGRES_URL
});

async function verify() {
    const client = await db.connect();
    try {
        const requiredTables = [
            'users',
            'sessions',
            'rams_documents',
            'coshh_assessments',
            'toolbox_talks'
        ];

        console.log('Verifying database tables...');

        const res = await client.sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `;

        const existingTables = res.rows.map(r => r.table_name);
        console.log('Existing tables:', existingTables);

        const missingTables = requiredTables.filter(t => !existingTables.includes(t));

        if (missingTables.length > 0) {
            console.error('❌ Missing tables:', missingTables);
            console.log('Run functionality to set up the database (e.g. node scripts/setup-db-local.js)');
        } else {
            console.log('✅ All required tables exist.');
        }

    } catch (err) {
        console.error('Error verifying database:', err);
    } finally {
        await client.end(); // Important for script termination
    }
}

verify();

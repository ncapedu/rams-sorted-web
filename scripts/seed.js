const { db } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = await db.connect();

  try {
    // Enable UUID extension if not exists
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    console.log('Enabled "uuid-ossp" extension');

    // Create users table
    await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        hashed_password TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created "users" table');

    // Create sessions table for custom device limit logic
    await client.sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        session_token TEXT NOT NULL UNIQUE,
        device_id TEXT NOT NULL,
        expires TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created "sessions" table');

    // Enable UUID extension if not exists
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    console.log('Enabled "uuid-ossp" extension');

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

main();

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createMessagesTable() {
  try {
    await client.connect();
    console.log('Connected to database.');

    // Create messages table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createTableQuery);
    console.log('Messages table created successfully.');

    // Create indices
    await client.query('CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);');
    console.log('Indices created successfully.');

  } catch (error) {
    console.error('Error creating messages table:', error);
  } finally {
    await client.end();
  }
}

createMessagesTable();

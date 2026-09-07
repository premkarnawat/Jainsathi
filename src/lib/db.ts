import { Pool } from 'pg';

const connectionString = 
  process.env.DATABASE_URL || 
  'postgresql://postgres:JainSathi%2414532%23@db.vqnbypdytxkmqgdsbswv.supabase.co:5432/postgres';

let pool: Pool;

// Ensure pool is re-used in development and not exhausted across hot-reloads
declare global {
  // eslint-disable-next-line no-var
  var __postgresPool: Pool | undefined;
}

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
  });
} else {
  if (!global.__postgresPool) {
    global.__postgresPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  pool = global.__postgresPool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows as T[];
  } finally {
    client.release();
  }
}

export default pool;

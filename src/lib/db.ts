import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __postgresPool: Pool | undefined;
}

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'CRITICAL CONFIGURATION ERROR: DATABASE_URL environment variable is required in production but was not provided.'
      );
    }
    // Fail-safe in local development if environment variable is missing
    throw new Error('DATABASE_URL environment variable is missing. Please define it in your .env.local file.');
  }

  const poolConfig = {
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: process.env.NODE_ENV === 'production' ? 10 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };

  if (process.env.NODE_ENV === 'production') {
    return new Pool(poolConfig);
  }

  if (!global.__postgresPool) {
    global.__postgresPool = new Pool(poolConfig);
  }

  return global.__postgresPool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows as T[];
  } finally {
    client.release();
  }
}

export default getPool;

import mysql from 'mysql2/promise';

// Create a pooled connection using discrete env vars to avoid leaking URLs.
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

if (!DB_HOST || !DB_USER || !DB_NAME) {
  console.warn('Database env vars (DB_HOST, DB_USER, DB_NAME) are not fully set. API routes will fail until configured.');
}

export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 5,
  enableKeepAlive: true
});

// Simple helper for executing prepared statements.
export async function query<T = any>(sql: string, params?: any[]) {
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

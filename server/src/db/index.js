import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL || 'file:cnds.db';
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

// Create LibSQL client instance
export const db = createClient({
  url,
  authToken,
});

export const query = async (sql, args = []) => {
  return await db.execute({ sql, args });
};

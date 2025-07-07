import fs from 'fs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

const sqlite = new Database(process.env.DATABASE_URL || './sqlite.db');
export const db = drizzle(sqlite);

if (fs.existsSync('./drizzle') && process.env.NODE_ENV !== 'production') {
  migrate(db, { migrationsFolder: './drizzle' });
}

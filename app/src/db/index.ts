import fs from 'fs';
import Database from 'better-sqlite3';
import { load } from 'sqlite-vss';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

export const sqlite = new Database(process.env.DATABASE_URL || './sqlite.db');
load(sqlite);
export const db = drizzle(sqlite);

if (fs.existsSync('./drizzle')) {
  migrate(db, { migrationsFolder: './drizzle' });
}

import fs from 'fs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { tryInitVss } from './vss';

export const sqlite = new Database(process.env.DATABASE_URL || './sqlite.db');
export const db = drizzle(sqlite);

try {
  tryInitVss(sqlite);
} catch {}

if (fs.existsSync('./drizzle')) {
  try {
    migrate(db, { migrationsFolder: './drizzle' });
  } catch (err) {
    console.warn('migration failed', err);
  }
}


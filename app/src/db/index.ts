import fs from 'fs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as sqliteVss from 'sqlite-vss';
import { ensureVssTables } from './vss';

export const sqlite = new Database(process.env.DATABASE_URL || './sqlite.db');
try {
  sqliteVss.load(sqlite);
  ensureVssTables(sqlite);
} catch (err) {
  console.warn('sqlite-vss failed to load', err);
}
export const db = drizzle(sqlite);

if (fs.existsSync('./drizzle')) {
  migrate(db, { migrationsFolder: './drizzle' });
}


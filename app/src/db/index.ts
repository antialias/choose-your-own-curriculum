import fs from 'fs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as sqliteVec from 'sqlite-vec';

const sqlite = new Database(process.env.DATABASE_URL || './sqlite.db');
sqliteVec.load(sqlite);
export const sqliteRaw = sqlite;
export const db = drizzle(sqlite);

if (fs.existsSync('./drizzle')) {
  migrate(db, { migrationsFolder: './drizzle' });
}

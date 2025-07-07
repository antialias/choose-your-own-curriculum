import fs from 'fs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as sqliteVss from 'sqlite-vss';

export const sqliteRaw = new Database(process.env.DATABASE_URL || './sqlite.db');
sqliteVss.load(sqliteRaw);
export const db = drizzle(sqliteRaw);

if (fs.existsSync('./drizzle')) {
  migrate(db, { migrationsFolder: './drizzle' });
}


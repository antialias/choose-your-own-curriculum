import fs from 'fs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as sqliteVss from 'sqlite-vss';

export const sqlite = new Database(process.env.DATABASE_URL || './sqlite.db');
if (!process.env.SKIP_VSS_LOAD) {
  sqliteVss.load(sqlite);
}
export const db = drizzle(sqlite);

if (!process.env.SKIP_DB_MIGRATIONS && fs.existsSync('./drizzle')) {
  migrate(db, { migrationsFolder: './drizzle' });
}

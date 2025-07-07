import fs from 'fs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sqliteVss = require('sqlite-vss');

export const sqlite = new Database(process.env.DATABASE_URL || './sqlite.db');
// Load vector and vss extensions before using the database
sqliteVss.load(sqlite);

export const db = drizzle(sqlite);

if (fs.existsSync('./drizzle')) {
  migrate(db, { migrationsFolder: './drizzle' });
}

import fs from 'fs';
import Database from 'better-sqlite3';
import type { Database as SqliteDatabase } from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

let sqlite: SqliteDatabase | null = null;

export function getSqlite() {
  if (!sqlite) {
    sqlite = new Database(process.env.DATABASE_URL || './sqlite.db');
  }
  return sqlite;
}

let db: BetterSQLite3Database | null = null;

export function getDb() {
  if (!db) {
    db = drizzle(getSqlite());
    if (fs.existsSync('./drizzle') && process.env.NODE_ENV !== 'production') {
      migrate(db, { migrationsFolder: './drizzle' });
    }
  }
  return db;
}

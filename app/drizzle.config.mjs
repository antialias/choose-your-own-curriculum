import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/** @type {import('drizzle-kit').Config} */
export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite3',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || './sqlite.db',
  },
};

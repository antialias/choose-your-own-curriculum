import Database from 'better-sqlite3';
import { uploadedWorkVss } from './schema';

export function ensureVssTables(db: Database.Database) {
  db.prepare(
    `CREATE VIRTUAL TABLE IF NOT EXISTS ${uploadedWorkVss} USING vss0(embedding VECTOR(1536))`
  ).run();
}

export interface EmbeddingRow {
  id: string;
  embedding: number[];
}

export function upsertEmbedding(db: Database.Database, row: EmbeddingRow) {
  const stmt = db.prepare(
    `INSERT INTO ${uploadedWorkVss}(rowid, embedding) VALUES (?, ?)
     ON CONFLICT(rowid) DO UPDATE SET embedding=excluded.embedding`
  );
  stmt.run(row.id, JSON.stringify(row.embedding));
}

export function insertEmbeddings(db: Database.Database, rows: EmbeddingRow[]) {
  const insert = db.prepare(
    `INSERT INTO ${uploadedWorkVss}(rowid, embedding) VALUES (?, ?)
     ON CONFLICT(rowid) DO UPDATE SET embedding=excluded.embedding`
  );
  const txn = db.transaction((batch: EmbeddingRow[]) => {
    for (const r of batch) insert.run(r.id, JSON.stringify(r.embedding));
  });
  txn(rows);
}

export interface SearchResult {
  id: string;
  distance: number;
}

export function searchEmbeddings(
  db: Database.Database,
  embedding: number[],
  k: number
): SearchResult[] {
  const stmt = db.prepare(
    `SELECT rowid as id, distance FROM ${uploadedWorkVss}
     WHERE vss_search(embedding, json(?))
     LIMIT ?`
  );
  return stmt.all(JSON.stringify(embedding), k) as SearchResult[];
}

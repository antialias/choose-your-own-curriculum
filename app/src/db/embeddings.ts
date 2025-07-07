import { sqlite } from './index';

let insertStmt: import('better-sqlite3').Statement | null = null;

if (!process.env.SKIP_VSS_LOAD) {
  sqlite.exec(
    'CREATE VIRTUAL TABLE IF NOT EXISTS vss_uploaded_work USING vss0(embedding(1536));'
  );
  insertStmt = sqlite.prepare(
    'INSERT OR REPLACE INTO vss_uploaded_work(rowid, embedding) VALUES (?1, json(?2))'
  );
}

export function upsertEmbedding(id: string, embedding: number[]) {
  insertStmt?.run(id, JSON.stringify(embedding));
}

const batch = insertStmt
  ? sqlite.transaction((rows: { id: string; embedding: number[] }[]) => {
      for (const row of rows) {
        insertStmt!.run(row.id, JSON.stringify(row.embedding));
      }
    })
  : null;

export function batchInsert(rows: { id: string; embedding: number[] }[]) {
  batch?.(rows);
}
const searchStmt = !process.env.SKIP_VSS_LOAD
  ? sqlite.prepare(
      'select rowid as id, distance from vss_uploaded_work where vss_search(embedding, json(?1)) limit ?2'
    )
  : null;

export function search(vector: number[], k: number) {
  return searchStmt?.all(JSON.stringify(vector), k) as
    | { id: string; distance: number }[]
    | undefined;
}

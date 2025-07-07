import type { Database as SQLiteDB } from 'better-sqlite3';

export interface VectorEntry {
  workId: string;
  vector: number[];
}

/** Batch upsert embeddings into the uploaded_work_embeddings table. */
export function upsertEmbeddings(db: SQLiteDB, entries: VectorEntry[]): void {
  const stmt = db.prepare(
    `INSERT INTO uploaded_work_embeddings (work_id, embedding)
     VALUES (?, ?) ON CONFLICT(work_id) DO UPDATE SET embedding=excluded.embedding`
  );
  const run = db.transaction((items: VectorEntry[]) => {
    for (const item of items) stmt.run(item.workId, JSON.stringify(item.vector));
  });
  run(entries);
}

/**
 * Search uploaded_work_embeddings for the closest vectors.
 * Returns work ids ordered by cosine distance ascending.
 */
export function searchEmbeddings(
  db: SQLiteDB,
  query: number[],
  limit: number
): { work_id: string; distance: number }[] {
  const stmt = db.prepare(
    `SELECT work_id, distance
     FROM uploaded_work_embeddings
     WHERE embedding MATCH ?
     ORDER BY distance
     LIMIT ?`
  );
  return stmt.all(JSON.stringify(query), limit) as {
    work_id: string;
    distance: number;
  }[];
}

import { sqliteRaw } from './index';

export function upsertEmbedding(rowid: number, vector: number[]) {
  sqliteRaw
    .prepare(
      `INSERT INTO uploaded_work_embeddings(rowid, embedding)
       VALUES (?, vector_from_json(?))
       ON CONFLICT(rowid) DO UPDATE SET embedding=excluded.embedding`
    )
    .run(rowid, JSON.stringify(vector));
}

export function batchUpsertEmbeddings(items: { rowid: number; vector: number[] }[]) {
  const insert = sqliteRaw.prepare(
    `INSERT INTO uploaded_work_embeddings(rowid, embedding)
     VALUES (?, vector_from_json(?))
     ON CONFLICT(rowid) DO UPDATE SET embedding=excluded.embedding`
  );
  const tx = sqliteRaw.transaction((arr: { rowid: number; vector: number[] }[]) => {
    for (const { rowid, vector } of arr) {
      insert.run(rowid, JSON.stringify(vector));
    }
  });
  tx(items);
}

export function searchEmbeddings(vector: number[], k: number) {
  return sqliteRaw
    .prepare(
      `SELECT uploaded_work.id, uploaded_work.summary, distance
       FROM uploaded_work_embeddings
       JOIN uploaded_work ON uploaded_work.rowid = uploaded_work_embeddings.rowid
       WHERE vss_search(embedding, vss_search_params(vector_from_json(?), ?))`
    )
    .all(JSON.stringify(vector), k) as { id: string; summary: string; distance: number }[];
}


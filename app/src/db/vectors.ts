import { sqliteRaw } from './index';

export function upsertUploadedWorkVector(rowid: number, vector: number[]): void {
  const data = JSON.stringify(vector);
  sqliteRaw
    .prepare(
      'INSERT INTO vss_uploaded_work(rowid, embedding) VALUES (?, json(?)) ON CONFLICT(rowid) DO UPDATE SET embedding=json(?)'
    )
    .run(rowid, data, data);
}

export function insertUploadedWorkVectors(records: { rowid: number; vector: number[] }[]): void {
  const insert = sqliteRaw.prepare(
    'INSERT INTO vss_uploaded_work(rowid, embedding) VALUES (?, json(?))'
  );
  const tx = sqliteRaw.transaction((items: { rowid: number; vector: number[] }[]) => {
    for (const { rowid, vector } of items) {
      insert.run(rowid, JSON.stringify(vector));
    }
  });
  tx(records);
}

export function searchUploadedWork(vector: number[], k: number) {
  const stmt = sqliteRaw.prepare(
    'SELECT rowid, distance FROM vss_uploaded_work WHERE vss_search(embedding, vss_search_params(json(?), ?))'
  );
  return stmt.all(JSON.stringify(vector), k) as { rowid: number; distance: number }[];
}

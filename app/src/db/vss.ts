import { sqlite } from './index';

/**
 * Convert a numeric array to the binary format expected by sqlite-vss.
 */
export function toVector(values: number[]): Buffer {
  return Buffer.from(new Float32Array(values).buffer);
}

/**
 * Insert or replace a single embedding into the vss table and base table.
 */
export function upsertEmbedding(rowid: number, vector: Buffer) {
  const insert = sqlite.prepare(
    'INSERT OR REPLACE INTO uploaded_work_vss(rowid, embeddings) VALUES (?, ?)'
  );
  const update = sqlite.prepare('UPDATE uploaded_work SET embeddings = ? WHERE rowid = ?');
  const tx = sqlite.transaction((r: number, v: Buffer) => {
    insert.run(r, v);
    update.run(v, r);
  });
  tx(rowid, vector);
}

/**
 * Batch insert embeddings.
 */
export function insertEmbeddings(items: { rowid: number; vector: Buffer }[]) {
  const insert = sqlite.prepare(
    'INSERT OR REPLACE INTO uploaded_work_vss(rowid, embeddings) VALUES (?, ?)'
  );
  const update = sqlite.prepare('UPDATE uploaded_work SET embeddings = ? WHERE rowid = ?');
  const tx = sqlite.transaction((arr: { rowid: number; vector: Buffer }[]) => {
    for (const { rowid, vector } of arr) {
      insert.run(rowid, vector);
      update.run(vector, rowid);
    }
  });
  tx(items);
}

/**
 * Execute a similarity search against stored vectors.
 */
export function searchEmbeddings(vector: Buffer, k: number) {
  return sqlite
    .prepare(
      `SELECT u.*, r.distance
       FROM uploaded_work_vss AS v
       JOIN uploaded_work AS u ON u.rowid = v.rowid
       JOIN (
         SELECT rowid, distance FROM uploaded_work_vss
         WHERE vss_search(embeddings, vss_search_params(?, ?))
       ) AS r ON r.rowid = v.rowid`
    )
    .all(vector, k);
}

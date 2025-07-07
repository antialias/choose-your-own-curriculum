import DatabaseConstructor from 'better-sqlite3';
export type Database = InstanceType<typeof DatabaseConstructor>;

export interface VectorRow {
  rowid: number;
  embedding: number[];
}

export function upsertEmbedding(db: Database, rowid: number, embedding: number[]) {
  db
    .prepare(
      'INSERT OR REPLACE INTO uploaded_work_embedding(rowid, embedding) VALUES (?, vector_from_json(?))'
    )
    .run(rowid, JSON.stringify(embedding));
}

export function upsertEmbeddings(db: Database, rows: VectorRow[]) {
  const stmt = db.prepare(
    'INSERT OR REPLACE INTO uploaded_work_embedding(rowid, embedding) VALUES (?, vector_from_json(?))'
  );
  const tx = db.transaction((rows: VectorRow[]) => {
    for (const r of rows) stmt.run(r.rowid, JSON.stringify(r.embedding));
  });
  tx(rows);
}

export function vssSearch(db: Database, embedding: number[], k: number) {
  const stmt = db.prepare(
    'SELECT rowid, distance FROM vss_search(\'uploaded_work_embedding\', \"embedding\", vector_from_json(?), ?)'
  );
  return stmt.all(JSON.stringify(embedding), k) as { rowid: number; distance: number }[];
}

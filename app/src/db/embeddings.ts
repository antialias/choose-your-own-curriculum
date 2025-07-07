import { sqlite } from './index';

export interface WorkEmbedding {
  workId: string;
  vector: number[];
}

const deleteStmt = sqlite.prepare(
  'DELETE FROM uploaded_work_index WHERE work_id = ?'
);
const insertStmt = sqlite.prepare(
  'INSERT INTO uploaded_work_index(work_id, vector) VALUES (?, json(?))'
);

const tx = sqlite.transaction((batch: WorkEmbedding[]) => {
  for (const row of batch) {
    deleteStmt.run(row.workId);
    insertStmt.run(row.workId, JSON.stringify(row.vector));
  }
});

export function upsertWorkEmbeddings(rows: WorkEmbedding[]) {
  tx(rows);
}

export function searchWorkEmbeddings(vector: number[], k: number) {
  return sqlite
    .prepare(
      'SELECT work_id as id, distance FROM uploaded_work_index WHERE vector MATCH json(?) ORDER BY distance LIMIT ?'
    )
    .all(JSON.stringify(vector), k) as { id: string; distance: number }[];
}

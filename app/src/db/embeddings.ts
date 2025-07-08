import { sqlite } from './index';

export interface WorkEmbedding {
  workId: string;
  vector: number[];
}

export interface TagEmbedding {
  tagId: string;
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

const deleteTagStmt = sqlite.prepare(
  'DELETE FROM tag_index WHERE tag_id = ?'
);
const insertTagStmt = sqlite.prepare(
  'INSERT INTO tag_index(tag_id, vector) VALUES (?, json(?))'
);

const tagTx = sqlite.transaction((batch: TagEmbedding[]) => {
  for (const row of batch) {
    deleteTagStmt.run(row.tagId);
    insertTagStmt.run(row.tagId, JSON.stringify(row.vector));
  }
});

export function upsertWorkEmbeddings(rows: WorkEmbedding[]) {
  tx(rows);
}

export function upsertTagEmbeddings(rows: TagEmbedding[]) {
  tagTx(rows);
}

const selectWorkStmt = sqlite.prepare(
  'SELECT vector FROM uploaded_work_index WHERE work_id = ?'
);

export function getWorkEmbedding(workId: string): number[] | null {
  const row = selectWorkStmt.get(workId) as { vector: string } | undefined;
  if (!row) return null;
  try {
    return JSON.parse(row.vector) as number[];
  } catch {
    return null;
  }
}

export function searchWorkEmbeddings(vector: number[], k: number) {
  return sqlite
    .prepare(
      'SELECT work_id as id, distance FROM uploaded_work_index WHERE vector MATCH json(?) ORDER BY distance LIMIT ?'
    )
    .all(JSON.stringify(vector), k) as { id: string; distance: number }[];
}

export function searchTagEmbeddings(vector: number[], k: number) {
  return sqlite
    .prepare(
      'SELECT tag_id as id, distance FROM tag_index WHERE vector MATCH json(?) ORDER BY distance LIMIT ?'
    )
    .all(JSON.stringify(vector), k) as { id: string; distance: number }[];
}

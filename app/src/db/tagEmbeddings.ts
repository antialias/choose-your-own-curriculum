import { sqlite } from './index';

export interface TagEmbedding {
  tagId: string;
  vector: number[];
}

const deleteStmt = sqlite.prepare(
  'DELETE FROM tag_index WHERE tag_id = ?'
);
const insertStmt = sqlite.prepare(
  'INSERT INTO tag_index(tag_id, vector) VALUES (?, json(?))'
);

const tx = sqlite.transaction((batch: TagEmbedding[]) => {
  for (const row of batch) {
    deleteStmt.run(row.tagId);
    insertStmt.run(row.tagId, JSON.stringify(row.vector));
  }
});

export function upsertTagEmbeddings(rows: TagEmbedding[]) {
  tx(rows);
}

export function searchTagEmbeddings(vector: number[], k: number) {
  return sqlite
    .prepare(
      'SELECT tag_id as id, distance FROM tag_index WHERE vector MATCH json(?) ORDER BY distance LIMIT ?'
    )
    .all(JSON.stringify(vector), k) as { id: string; distance: number }[];
}

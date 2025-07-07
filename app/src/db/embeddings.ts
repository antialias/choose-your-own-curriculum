import { sqlite } from './index';
import type { Statement } from 'better-sqlite3';

export interface WorkEmbedding {
  workId: string;
  vector: number[];
}

let deleteStmt: Statement | undefined;
let insertStmt: Statement | undefined;
let tx: (batch: WorkEmbedding[]) => void = () => {};

function ensureWorkStatements() {
  if (deleteStmt) return;
  try {
    deleteStmt = sqlite.prepare(
      'DELETE FROM uploaded_work_index WHERE work_id = ?'
    );
    insertStmt = sqlite.prepare(
      'INSERT INTO uploaded_work_index(work_id, vector) VALUES (?, json(?))'
    );
    tx = sqlite.transaction((batch: WorkEmbedding[]) => {
      if (!deleteStmt || !insertStmt) return;
      for (const row of batch) {
        deleteStmt.run(row.workId);
        insertStmt.run(row.workId, JSON.stringify(row.vector));
      }
    });
  } catch {}
}

export function upsertWorkEmbeddings(rows: WorkEmbedding[]) {
  try {
    ensureWorkStatements();
    tx(rows);
  } catch (err) {
    console.error('work embedding upsert failed', err);
  }
}

export function searchWorkEmbeddings(vector: number[], k: number) {
  return sqlite
    .prepare(
      'SELECT work_id as id, distance FROM uploaded_work_index WHERE vector MATCH json(?) ORDER BY distance LIMIT ?'
    )
    .all(JSON.stringify(vector), k) as { id: string; distance: number }[];
}

export interface TagEmbedding {
  tagId: string;
  vector: number[];
}

let deleteTagStmt: Statement | undefined;
let insertTagStmt: Statement | undefined;
let tagTx: (batch: TagEmbedding[]) => void = () => {};

function ensureTagStatements() {
  if (deleteTagStmt) return;
  try {
    deleteTagStmt = sqlite.prepare(
      'DELETE FROM tag_index WHERE tag_id = ?'
    );
    insertTagStmt = sqlite.prepare(
      'INSERT INTO tag_index(tag_id, vector) VALUES (?, json(?))'
    );
    tagTx = sqlite.transaction((batch: TagEmbedding[]) => {
      if (!deleteTagStmt || !insertTagStmt) return;
      for (const row of batch) {
        deleteTagStmt.run(row.tagId);
        insertTagStmt.run(row.tagId, JSON.stringify(row.vector));
      }
    });
  } catch {}
}

export function upsertTagEmbeddings(rows: TagEmbedding[]) {
  try {
    ensureTagStatements();
    tagTx(rows);
  } catch (err) {
    console.error('tag embedding upsert failed', err);
  }
}

export function searchTagEmbeddings(vector: number[], k: number) {
  return sqlite
    .prepare(
      'SELECT tag_id as id, distance FROM tag_index WHERE vector MATCH json(?) ORDER BY distance LIMIT ?'
    )
    .all(JSON.stringify(vector), k) as { id: string; distance: number }[];
}

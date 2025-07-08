import { getSqlite } from './index';
import type { Statement } from 'better-sqlite3';

const sqlite = getSqlite();

function safePrepare(sql: string): Statement<unknown[], unknown> {
  try {
    return sqlite.prepare(sql);
  } catch {
    return { run: () => {}, all: () => [], get: () => undefined } as unknown as Statement<unknown[], unknown>;
  }
}

export interface WorkEmbedding {
  workId: string;
  vector: number[];
}

export interface TagEmbedding {
  tagId: string;
  vector: number[];
}

const deleteStmt = safePrepare(
  'DELETE FROM uploaded_work_index WHERE work_id = ?'
);
const insertStmt = safePrepare(
  'INSERT INTO uploaded_work_index(work_id, vector) VALUES (?, json(?))'
);

const tx = sqlite.transaction((batch: WorkEmbedding[]) => {
  for (const row of batch) {
    deleteStmt.run(row.workId);
    insertStmt.run(row.workId, JSON.stringify(row.vector));
  }
});

const deleteTagStmt = safePrepare('DELETE FROM tag_index WHERE tag_id = ?');
const insertTagStmt = safePrepare(
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

export function searchWorkEmbeddings(vector: number[], k: number) {
  return sqlite
    .prepare(
      'SELECT work_id as id, distance FROM uploaded_work_index WHERE vector MATCH json(?) ORDER BY distance LIMIT ?'
    )
    .all(JSON.stringify(vector), k) as { id: string; distance: number }[];
}

export function searchTagEmbeddings(vector: number[], k: number) {
  try {
    return sqlite
      .prepare(
        'SELECT tag_id as id, distance FROM tag_index WHERE vector MATCH json(?) ORDER BY distance LIMIT ?'
      )
      .all(JSON.stringify(vector), k) as { id: string; distance: number }[];
  } catch {
    return [] as { id: string; distance: number }[];
  }
}

export function getWorkVector(workId: string): number[] | null {
  let row: { vector?: unknown } | undefined;
  try {
    row = sqlite
      .prepare('SELECT vector FROM uploaded_work_index WHERE work_id = ?')
      .get(workId) as { vector?: unknown } | undefined;
  } catch {
    return null;
  }
  if (!row || row.vector == null) return null;
  const v = row.vector as unknown;
  if (typeof v === 'string') {
    return JSON.parse(v) as number[];
  }
  if (v instanceof Uint8Array) {
    const buf = Buffer.from(v);
    const arr = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
    return Array.from(arr);
  }
  if (Array.isArray(v)) return v as number[];
  return null;
}

export function searchTagsForWork(workId: string, k: number) {
  const vector = getWorkVector(workId);
  if (!vector) return [] as { id: string; distance: number }[];
  return searchTagEmbeddings(vector, k);
}

export function getTagVector(tagId: string): number[] | null {
  let row: { vector?: unknown } | undefined;
  try {
    row = sqlite
      .prepare('SELECT vector FROM tag_index WHERE tag_id = ?')
      .get(tagId) as { vector?: unknown } | undefined;
  } catch {
    return null;
  }
  if (!row || row.vector == null) return null;
  const v = row.vector as unknown;
  if (typeof v === 'string') {
    return JSON.parse(v) as number[];
  }
  if (v instanceof Uint8Array) {
    const buf = Buffer.from(v);
    const arr = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
    return Array.from(arr);
  }
  if (Array.isArray(v)) return v as number[];
  return null;
}


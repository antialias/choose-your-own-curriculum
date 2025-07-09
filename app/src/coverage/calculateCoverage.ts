import { getDb, getSqlite } from '@/db';
import { uploadedWork } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getTagVector, getWorkVector } from '@/db/embeddings';
import type { Graph } from '@/graphSchema';

function similarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let sum = 0;
  for (let i = 0; i < len; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  const dist = Math.sqrt(sum);
  return 1 / (1 + dist);
}

export async function calculateCoverage(studentId: string, dag: Graph): Promise<Record<string, number>> {
  const db = getDb();
  const sqlite = getSqlite();
  const rows = await db
    .select({ id: uploadedWork.id, masteryPercent: uploadedWork.masteryPercent })
    .from(uploadedWork)
    .where(eq(uploadedWork.studentId, studentId));

  const works = rows
    .filter((r) => r.masteryPercent !== null)
    .map((r) => {
      const vec = getWorkVector(r.id) || [];
      return { vector: vec, weight: (r.masteryPercent as number) / 100 };
    })
    .filter((w) => w.vector.length);

  const tagStmt = sqlite.prepare('SELECT id FROM tag WHERE text = ?');
  const coverage: Record<string, number> = {};

  for (const node of dag.nodes) {
    const scores: number[] = [];
    for (const tag of node.tags) {
      const idRow = tagStmt.get(tag) as { id?: string } | undefined;
      if (!idRow?.id) continue;
      const tagVec = getTagVector(idRow.id);
      if (!tagVec) continue;
      let best = 0;
      for (const work of works) {
        const score = similarity(tagVec, work.vector) * work.weight;
        if (score > best) best = score;
      }
      scores.push(best);
    }
    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    coverage[node.id] = Math.round(avg * 100);
  }

  return coverage;
}

import { getSqlite } from '@/db';
import { upsertTagEmbeddings } from '@/db/embeddings';
import type { Graph } from '@/graphSchema';
import OpenAI from 'openai';
import crypto from 'node:crypto';

export async function embedDagTags(graph: Graph) {
  const sqlite = getSqlite();
  const insertTag = sqlite.prepare('INSERT OR IGNORE INTO tag(id, text) VALUES (?, ?)');
  const selectTag = sqlite.prepare('SELECT id FROM tag WHERE text = ?');
  const hasVector = sqlite.prepare('SELECT 1 FROM tag_index WHERE tag_id = ?');
  const unique = Array.from(new Set(graph.nodes.flatMap(n => n.tags)));
  const model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  const batch: { tagId: string; vector: number[] }[] = [];
  for (const tag of unique) {
    const row = selectTag.get(tag) as { id: string } | undefined;
    let tagId = row?.id;
    if (!tagId) {
      tagId = crypto.randomUUID();
      insertTag.run(tagId, tag);
    }
    const exists = hasVector.get(tagId) as unknown;
    if (exists) continue;
    try {
      const emb = await openai.embeddings.create({ model, input: tag });
      const vector = emb.data[0]?.embedding;
      if (vector) batch.push({ tagId, vector });
    } catch (err) {
      console.error('tag embedding failed', err);
    }
  }
  if (batch.length) upsertTagEmbeddings(batch);
}

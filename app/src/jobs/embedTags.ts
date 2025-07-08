import { getSqlite } from '@/db';
import { upsertTagEmbeddings } from '@/db/embeddings';
import type { Graph } from '@/graphSchema';
import crypto from 'node:crypto';
import OpenAI from 'openai';

export async function embedTagsForGraph(graph: Graph) {
  const tags = Array.from(new Set(graph.nodes.flatMap((n) => n.tags)));
  if (tags.length === 0) return;
  const sqlite = getSqlite();
  const insert = sqlite.prepare('INSERT OR IGNORE INTO tag(id, text) VALUES (?, ?)');
  const select = sqlite.prepare('SELECT id FROM tag WHERE text = ?');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  const model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';

  for (const tag of tags) {
    const row = select.get(tag) as { id: string } | undefined;
    let tagId = row?.id;
    if (!tagId) {
      tagId = crypto.randomUUID();
      insert.run(tagId, tag);
    }
    try {
      const emb = await openai.embeddings.create({ model, input: tag });
      const vector = emb.data[0]?.embedding;
      if (vector) {
        upsertTagEmbeddings([{ tagId, vector }]);
      }
    } catch (err) {
      console.error('Tag embedding failed', tag, err);
    }
  }
}

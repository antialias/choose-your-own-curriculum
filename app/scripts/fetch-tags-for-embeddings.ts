import { config } from 'dotenv';
config({ path: '.env.local' });

import crypto from 'node:crypto';
import { getSqlite } from '../src/db';
import { upsertTagEmbeddings } from '../src/db/embeddings';
import OpenAI from 'openai';
import { LLMClient } from '../src/llm/client';
import { z } from 'zod';

const sqlite = getSqlite();

async function main() {
  const summaries = sqlite
    .prepare('SELECT summary FROM uploaded_work WHERE summary IS NOT NULL')
    .all() as { summary: string }[];

  const text = summaries.map(s => s.summary).join('\n');
  const client = new LLMClient(process.env.OPENAI_API_KEY || '');
  const schema = z.object({ tags: z.array(z.string()) });
  const result = await client.chat(
    `Generate a list of 100 short tags that describe this work:\n${text}`,
    {
      systemPrompt:
        'You are a helpful assistant that creates concise tags. Respond only with raw JSON and no code fences.',
      schema,
      params: { model: 'gpt-4o' },
    }
  );

  if (result.error || !result.response) {
    console.error('Tag generation failed', result.error);
    process.exit(1);
  }

  const tags: string[] = result.response.tags.slice(0, 100);
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  const model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';

  const insert = sqlite.prepare('INSERT OR IGNORE INTO tag(id, text) VALUES (?, ?)');
  const select = sqlite.prepare('SELECT id FROM tag WHERE text = ?');

  for (const tag of tags) {
    let idRow = select.get(tag) as { id: string } | undefined;
    let tagId = idRow?.id;
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
      console.error('Embedding failed for tag', tag, err);
    }
  }
}

main();

import { db } from '../src/db';
import { uploadedWork, tags } from '../src/db/schema';
import { upsertTagEmbeddings } from '../src/db/embeddings';
import { eq } from 'drizzle-orm';
import { LLMClient } from '../src/llm/client';
import OpenAI from 'openai';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import crypto from 'node:crypto';

dotenv.config({ path: '.env.local' });

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';

async function main() {
  const summaries = await db
    .select({ summary: uploadedWork.summary })
    .from(uploadedWork);
  const text = summaries.map((s) => s.summary || '').join('\n');
  if (!text.trim()) {
    console.log('No summaries found');
    return;
  }

  const client = new LLMClient(process.env.OPENAI_API_KEY || '');
  const schema = z.object({ tags: z.array(z.string()) });
  const prompt = `Here are summaries of uploaded student work:\n${text}\nProvide a list of the top 100 tags relevant to this collection. Respond with JSON in the form {"tags": ["tag1", ...]}.`;
  const result = await client.chat(prompt, {
    systemPrompt: 'You categorize uploaded student work.',
    schema,
  });
  if (result.error || !result.response) {
    throw new Error(result.error?.message || 'LLM failed');
  }
  const names = result.response.tags.slice(0, 100);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  const rows: { tagId: string; vector: number[] }[] = [];

  for (const name of names) {
    const existing = await db
      .select()
      .from(tags)
      .where(eq(tags.name, name));
    let id = existing[0]?.id as string | undefined;
    if (!id) {
      id = crypto.randomUUID();
      await db.insert(tags).values({ id, name });
    }
    try {
      const emb = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: name,
      });
      const vector = emb.data[0]?.embedding;
      if (vector) rows.push({ tagId: id, vector });
    } catch (err) {
      console.error('embedding error for tag', name, err);
    }
  }

  if (rows.length) {
    upsertTagEmbeddings(rows);
  }
  console.log('Done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

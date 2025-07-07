import 'dotenv/config';
import crypto from 'crypto';
import { z } from 'zod';
import OpenAI from 'openai';
import { db } from '../src/db';
import { uploadedWork, tags } from '../src/db/schema';
import { upsertTagEmbeddings } from '../src/db/tagEmbeddings';
import { LLMClient } from '../src/llm/client';

async function main() {
  const works = await db
    .select({ summary: uploadedWork.summary })
    .from(uploadedWork);
  const summaries = works
    .map(w => w.summary)
    .filter((s): s is string => !!s)
    .join('\n');

  const llm = new LLMClient(process.env.OPENAI_API_KEY!);
  const schema = z.object({ tags: z.array(z.string()) });

  const result = await llm.chat('Generate up to 100 short tags that categorize this work:', {
    schema,
    systemPrompt: 'You are an expert educator generating concise tags.',
    templateVars: {},
    params: { model: 'gpt-4o' },
  });

  if (result.error || !result.response) {
    console.error('Tag generation failed', result.error);
    process.exit(1);
  }

  const names = result.response.tags.slice(0, 100);
  const records: { id: string; name: string }[] = [];
  for (const name of names) {
    const id = crypto.randomUUID();
    records.push({ id, name });
  }
  if (records.length) {
    await db.insert(tags).values(records);
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const embModel = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
  const emb = await openai.embeddings.create({ model: embModel, input: names });
  const vectors = emb.data.map(d => d.embedding);
  const tagEmbeds = records.map((r, i) => ({ tagId: r.id, vector: vectors[i] }));
  upsertTagEmbeddings(tagEmbeds);
  console.log('Inserted', tagEmbeds.length, 'tags');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

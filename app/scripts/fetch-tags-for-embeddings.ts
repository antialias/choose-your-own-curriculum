import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import OpenAI from 'openai';
import { db, sqlite } from '../src/db';
import { uploadedWork, tags } from '../src/db/schema';
import { upsertTagEmbeddings } from '../src/db/embeddings';

async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
  const embeddingModel = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';

  const summaries = db
    .select({ summary: uploadedWork.summary })
    .from(uploadedWork)
    .all()
    .map(w => w.summary)
    .filter(Boolean)
    .join('\n');

  if (!summaries) {
    console.log('No summaries found');
    return;
  }

  const prompt = `Given the following summaries of student work, provide up to 100 short tags that best describe the content. Respond with a JSON array of strings.\n\n${summaries}`;
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });
  const content = chat.choices[0]?.message?.content || '[]';
  let tagNames: string[] = [];
  try {
    tagNames = JSON.parse(content);
  } catch (err) {
    console.error('Failed to parse tags', err);
    return;
  }

  if (!Array.isArray(tagNames) || tagNames.length === 0) {
    console.log('No tags returned');
    return;
  }

  const insert = sqlite.prepare('INSERT OR IGNORE INTO tag(name) VALUES (?)');
  const select = sqlite.prepare('SELECT id FROM tag WHERE name = ?');
  const tagIds: { id: string; name: string }[] = [];
  const tx = sqlite.transaction((names: string[]) => {
    for (const name of names) {
      insert.run(name);
      const row = select.get(name) as { id: string } | undefined;
      if (row) tagIds.push({ id: row.id, name });
    }
  });
  tx(tagNames);

  const emb = await openai.embeddings.create({
    model: embeddingModel,
    input: tagIds.map(t => t.name),
  });

  const vectors = emb.data.map((d, i) => ({ tagId: tagIds[i].id, vector: d.embedding }));
  upsertTagEmbeddings(vectors);

  console.log(`Inserted ${vectors.length} tag embeddings`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

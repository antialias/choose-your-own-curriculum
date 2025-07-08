# Tag Generation

Run `pnpm run fetch-tags-for-embeddings` to generate tags for all uploaded work. The script queries every summary, asks the LLM for the top 100 tags, stores them in the database and embeds each tag using the model specified by the `EMBEDDING_MODEL` environment variable (defaults to `text-embedding-3-small`).

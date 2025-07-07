CREATE VIRTUAL TABLE IF NOT EXISTS vss_uploaded_work USING vss0(embedding VECTOR(1536));
INSERT INTO vss_uploaded_work(rowid, embedding)
  SELECT id, json_extract(embeddings, '$.data[0].embedding')
  FROM uploaded_work WHERE embeddings IS NOT NULL;
ALTER TABLE uploaded_work DROP COLUMN embeddings;

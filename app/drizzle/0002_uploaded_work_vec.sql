CREATE VIRTUAL TABLE uploaded_work_index USING vec0(
  work_id TEXT PRIMARY KEY,
  vector FLOAT[1536]
);
--> statement-breakpoint
INSERT INTO uploaded_work_index(work_id, vector)
SELECT id, json_extract(embeddings, '$.data[0].embedding')
FROM uploaded_work
WHERE embeddings IS NOT NULL AND embeddings != '';

-- migrate embeddings text column to vector table
CREATE VIRTUAL TABLE uploaded_work_embeddings USING vec0(
  work_id TEXT PRIMARY KEY REFERENCES uploaded_work(id) ON DELETE CASCADE,
  embedding FLOAT[1536]
);
--> statement-breakpoint
INSERT INTO uploaded_work_embeddings (work_id, embedding)
  SELECT id, json_extract(embeddings, '$.data[0].embedding')
  FROM uploaded_work
  WHERE embeddings IS NOT NULL;
--> statement-breakpoint
ALTER TABLE uploaded_work DROP COLUMN embeddings;
--> statement-breakpoint

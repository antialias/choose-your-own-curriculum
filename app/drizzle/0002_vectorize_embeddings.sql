ALTER TABLE uploaded_work ADD COLUMN embedding vector(1536);--> statement-breakpoint
UPDATE uploaded_work SET embedding = json_extract(embeddings, '$.data[0].embedding');--> statement-breakpoint
CREATE VIRTUAL TABLE uploaded_work_vss USING vss0(
  embedding(1536)
);--> statement-breakpoint
INSERT INTO uploaded_work_vss(rowid, embedding)
  SELECT rowid, embedding FROM uploaded_work;--> statement-breakpoint
ALTER TABLE uploaded_work DROP COLUMN embeddings;--> statement-breakpoint

CREATE TABLE uploaded_work_new (
  id text primary key not null,
  userId text not null references user(id) on delete cascade,
  studentId text not null references student(id) on delete cascade,
  dateUploaded integer not null,
  dateCompleted integer,
  summary text,
  embeddings text,
  originalDocument blob
);
--> statement-breakpoint
INSERT INTO uploaded_work_new
  SELECT id, userId, studentId, dateUploaded, dateCompleted, summary, embeddings, originalDocument
  FROM uploaded_work;
--> statement-breakpoint
CREATE VIRTUAL TABLE uploaded_work_embeddings USING vss0(embedding VECTOR(1536));
--> statement-breakpoint
INSERT INTO uploaded_work_embeddings(rowid, embedding)
  SELECT rowid, vector_from_json(json_extract(embeddings, '$.data[0].embedding'))
  FROM uploaded_work WHERE embeddings IS NOT NULL;
--> statement-breakpoint
DROP TABLE uploaded_work;
--> statement-breakpoint
ALTER TABLE uploaded_work_new RENAME TO uploaded_work;
--> statement-breakpoint
ALTER TABLE uploaded_work DROP COLUMN embeddings;

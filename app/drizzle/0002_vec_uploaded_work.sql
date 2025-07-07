ALTER TABLE uploaded_work RENAME TO _uploaded_work_old;

CREATE TABLE uploaded_work (
  id text PRIMARY KEY NOT NULL,
  userId text NOT NULL,
  studentId text NOT NULL,
  dateUploaded integer NOT NULL,
  dateCompleted integer,
  summary text,
  originalDocument blob,
  FOREIGN KEY (userId) REFERENCES user(id) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (studentId) REFERENCES student(id) ON UPDATE no action ON DELETE cascade
);

INSERT INTO uploaded_work(id, userId, studentId, dateUploaded, dateCompleted, summary, originalDocument)
  SELECT id, userId, studentId, dateUploaded, dateCompleted, summary, originalDocument
  FROM _uploaded_work_old;

CREATE VIRTUAL TABLE vss_uploaded_work USING vss0(embedding VECTOR(1536));

INSERT INTO vss_uploaded_work(rowid, embedding)
  SELECT rowid, json_extract(embeddings, '$.data[0].embedding')
  FROM _uploaded_work_old
  WHERE embeddings IS NOT NULL AND embeddings != '';

DROP TABLE _uploaded_work_old;

-- create vector index for tag embeddings
CREATE VIRTUAL TABLE tag_index USING vss0(
  tag_id TEXT PRIMARY KEY,
  vector FLOAT[1536]
);

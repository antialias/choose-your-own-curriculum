ALTER TABLE `uploaded_work` DROP COLUMN `embeddings`;
CREATE VIRTUAL TABLE `uploaded_work_embedding` USING vss0(
  `embedding` VECTOR(1536)
);
INSERT INTO `uploaded_work_embedding`(rowid, `embedding`)
  SELECT rowid, vector_from_json(`embeddings`)
  FROM `uploaded_work` WHERE `embeddings` IS NOT NULL;

ALTER TABLE `uploaded_work` DROP COLUMN `embeddings`;
CREATE VIRTUAL TABLE IF NOT EXISTS `vss_uploaded_work` USING vss0(embedding(1536));

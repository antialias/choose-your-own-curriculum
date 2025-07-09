ALTER TABLE `topic_dag` ADD `tagEmbeddingStatus` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `topic_dag` ADD `tagEmbeddingsTotal` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `topic_dag` ADD `tagEmbeddingsComplete` integer DEFAULT 0 NOT NULL;

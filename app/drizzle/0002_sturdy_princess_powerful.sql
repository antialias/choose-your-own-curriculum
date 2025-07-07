PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_uploaded_work` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`studentId` text NOT NULL,
	`dateUploaded` integer NOT NULL,
	`dateCompleted` integer,
	`summary` text,
	`embeddings` blob,
	`originalDocument` blob,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_uploaded_work`("id", "userId", "studentId", "dateUploaded", "dateCompleted", "summary", "embeddings", "originalDocument") SELECT "id", "userId", "studentId", "dateUploaded", "dateCompleted", "summary", "embeddings", "originalDocument" FROM `uploaded_work`;--> statement-breakpoint
DROP TABLE `uploaded_work`;--> statement-breakpoint
ALTER TABLE `__new_uploaded_work` RENAME TO `uploaded_work`;--> statement-breakpoint
CREATE VIRTUAL TABLE IF NOT EXISTS `uploaded_work_vss` USING vss0(embeddings(1536));
PRAGMA foreign_keys=ON;

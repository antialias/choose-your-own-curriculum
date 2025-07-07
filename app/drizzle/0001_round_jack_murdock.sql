CREATE TABLE `student` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `uploaded_work` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`studentId` text NOT NULL,
	`dateUploaded` integer NOT NULL,
	`dateCompleted` integer,
	`summary` text,
	`embeddings` text,
	`originalDocument` blob,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE cascade
);

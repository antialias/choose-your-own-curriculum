CREATE TABLE `topic_dag` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`topics` text NOT NULL,
	`graph` text NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);

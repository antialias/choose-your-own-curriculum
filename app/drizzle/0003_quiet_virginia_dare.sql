CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tag_text_unique` ON `tag` (`text`);

--> statement-breakpoint

CREATE TABLE `student` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `work_upload` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`uploaded_by_id` text NOT NULL,
	`uploaded_at` integer NOT NULL,
	`completed_at` integer,
	`summary` text,
	`embedding` text,
	`file` blob,
	FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploaded_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);

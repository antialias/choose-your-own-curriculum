ALTER TABLE `teacher_student` ADD `topicDagId` text REFERENCES topic_dag(id);--> statement-breakpoint
ALTER TABLE `uploaded_work` ADD `thumbnail` blob;
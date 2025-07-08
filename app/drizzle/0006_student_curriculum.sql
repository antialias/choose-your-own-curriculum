ALTER TABLE teacher_student ADD COLUMN topicDagId text REFERENCES topic_dag(id);--> statement-breakpoint

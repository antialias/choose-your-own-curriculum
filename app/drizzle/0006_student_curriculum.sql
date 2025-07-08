CREATE TABLE `teacher_student_curriculum` (
  `teacherId` text NOT NULL,
  `studentId` text NOT NULL,
  `dagId` text NOT NULL,
  PRIMARY KEY(`teacherId`, `studentId`),
  FOREIGN KEY (`teacherId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`dagId`) REFERENCES `topic_dag`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

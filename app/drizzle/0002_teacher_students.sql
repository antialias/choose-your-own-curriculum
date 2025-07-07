ALTER TABLE student RENAME COLUMN userId TO accountUserId;
ALTER TABLE student ADD COLUMN email text;
CREATE TABLE teacher_student (
    teacherId text NOT NULL REFERENCES user(id) ON DELETE cascade,
    studentId text NOT NULL REFERENCES student(id) ON DELETE cascade,
    PRIMARY KEY (teacherId, studentId)
);

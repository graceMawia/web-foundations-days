-- Day 6 Assignment: A School Database
-- Runs in SQLite (e.g. sqliteonline.com)

PRAGMA foreign_keys = ON;

-- ============ TABLES ============

CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,            -- no two students share an email
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    teacher TEXT NOT NULL
);

CREATE TABLE enrolments (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,                            -- NULL until a grade is given
    enrolled_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id),   -- same student cannot enrol on the same course twice
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ============ SAMPLE DATA ============

INSERT INTO students (name, email) VALUES ('Amina Otieno', 'amina@example.com');
INSERT INTO students (name, email) VALUES ('Brian Kamau', 'brian@example.com');
INSERT INTO students (name, email) VALUES ('Cynthia Wanjiru', 'cynthia@example.com');
INSERT INTO students (name, email) VALUES ('David Mwangi', 'david@example.com');

INSERT INTO courses (title, teacher) VALUES ('Mathematics', 'Ms Achieng');
INSERT INTO courses (title, teacher) VALUES ('Computer Science', 'Mr Njoroge');
INSERT INTO courses (title, teacher) VALUES ('History', 'Mrs Hassan');

INSERT INTO enrolments (student_id, course_id, grade) VALUES (1, 1, 'A');
INSERT INTO enrolments (student_id, course_id, grade) VALUES (1, 2, 'B');
INSERT INTO enrolments (student_id, course_id, grade) VALUES (2, 1, 'C');
INSERT INTO enrolments (student_id, course_id, grade) VALUES (2, 3, 'B');
INSERT INTO enrolments (student_id, course_id, grade) VALUES (3, 2, 'A');
INSERT INTO enrolments (student_id, course_id, grade) VALUES (3, 1, NULL);
-- David (id 4) is deliberately not enrolled on anything.

-- ============ QUERIES ============

-- 1. All courses for one student (by name)
SELECT courses.title, enrolments.grade
FROM students
JOIN enrolments ON enrolments.student_id = students.id
JOIN courses ON courses.id = enrolments.course_id
WHERE students.name = 'Amina Otieno';

-- 2. All students on one course
SELECT students.name, students.email
FROM courses
JOIN enrolments ON enrolments.course_id = courses.id
JOIN students ON students.id = enrolments.student_id
WHERE courses.title = 'Mathematics';

-- 3. Number of students per course (LEFT JOIN keeps courses with zero students)
SELECT courses.title, COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments ON enrolments.course_id = courses.id
GROUP BY courses.id;

-- 4. Students who have no enrolments
SELECT students.name, students.email
FROM students
LEFT JOIN enrolments ON enrolments.student_id = students.id
WHERE enrolments.student_id IS NULL;

-- 5. Update one enrolment's grade (Cynthia, Mathematics)
UPDATE enrolments
SET grade = 'B'
WHERE student_id = 3 AND course_id = 1;

-- Check the update worked
SELECT * FROM enrolments WHERE student_id = 3 AND course_id = 1;

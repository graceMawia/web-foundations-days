# Day 6: School Database Design

## The tables

**students** stores one row per student: `id` (primary key), `name`, `email` and `created_at`. The email is `NOT NULL UNIQUE`, so every student has one and no two students can share it.

**courses** stores one row per course: `id` (primary key), `title` and `teacher`. Each course is stored once, however many students take it.

**enrolments** records the fact that a student is on a course. It holds `student_id` and `course_id` (both foreign keys), plus the `grade` and `enrolled_at`. Its primary key is the pair `(student_id, course_id)`, which means the database itself refuses to let the same student enrol on the same course twice. The `grade` is allowed to be empty because it is only known after marking. Both foreign keys use `ON DELETE CASCADE`, so deleting a student or a course also removes their enrolments.

## Relationships

- **One-to-many:** one student has many enrolments, and one course has many enrolments. Each enrolment row belongs to exactly one student and exactly one course, which is why it carries a foreign key to each.
- **Many-to-many:** students and courses. One student can take many courses, and one course has many students.

A join table is needed because a single column cannot hold this relationship cleanly. Putting a `course_id` in `students` would allow only one course per student, and putting a `student_id` in `courses` would allow only one student per course. Storing a comma-separated list in one column breaks the "one value per column" rule and is hard to search or update. The `enrolments` table solves this by storing one row per (student, course) pair. It is also the natural home for the grade, because a grade belongs to the pairing and not to the student or the course alone.

## Index

I would add an index on `enrolments(course_id)`:

```sql
CREATE INDEX idx_enrolments_course_id ON enrolments(course_id);
```

The composite primary key `(student_id, course_id)` already makes lookups by student fast, but queries that start from a course (all students on a course, or the number of students per course) would otherwise have to scan every enrolment row. The index lets the database jump straight to a course's enrolments. The trade-off is slightly slower inserts and a little extra storage, which is acceptable because enrolments are read far more often than they are written.

## SQL or NoSQL?

I would choose SQL (a relational database such as PostgreSQL or SQLite). The school's data is clearly structured, with students, courses and enrolments that have fixed columns, and its main feature is the many-to-many relationship between students and courses, which SQL handles well with foreign keys and JOINs. Correctness also matters here: rules like a unique email, no duplicate enrolments, and no enrolment for a student who does not exist are enforced by the database itself, and transactions keep multi-step changes all-or-nothing. A document database would force me to either embed courses inside each student (duplicating course details and making "all students on a course" awkward) or enforce those rules in application code. NoSQL could become attractive only if the data became very flexible or grew to a scale that needs spreading across many servers, which a school system is unlikely to need.

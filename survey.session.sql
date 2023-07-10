CREATE TABLE users(id serial PRIMARY KEY, 
                    first_name TEXT, 
                    last_name TEXT,
                    student_id TEXT,
                    class_taking TEXT,
                    instructor TEXT,
                    major TEXT,
                    university_year TEXT,
                    statistics TEXT);

-- @block
SELECT * FROM users;
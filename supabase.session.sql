-- @block
CREATE TABLE user_info (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(20) NOT NULL,
    class VARCHAR(50) NOT NULL,
    instructor VARCHAR(100) NOT NULL,
    major VARCHAR(100) NOT NULL,
    university_year VARCHAR(20) NOT NULL,
    taken_statistics VARCHAR(5) NOT NULL,
    visualization TEXT
);

-- @block
CREATE TABLE lottery_response (
    response_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES user_info(user_id), 
    lottery_num INT,
    first_round_response TEXT[],
    second_round_response TEXT[],
    ce NUMERIC[]
);

--@block
ALTER TABLE user_info
ADD created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE lottery_response
ADD created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

--@block
UPDATE user_info
SET created_at = created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/New_York';

UPDATE lottery_response
SET created_at = created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/New_York';

--@block
SELECT u.user_id, u.first_name, u.last_name, u.student_id, u.class, u.instructor, u.major, u.university_year, u.taken_statistics, u.visualization, u.created_at,
       lr.lottery_num, lr.first_round_response, lr.second_round_response, lr.ce, lr.created_at
FROM user_info u
JOIN lottery_response lr ON u.user_id = lr.user_id;

--@block
SELECT * FROM users;

--@block
DROP TABLE user_info

--@block
DROP TABLE lottery_response
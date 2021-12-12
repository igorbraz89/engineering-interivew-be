INSERT INTO tasks(name, status, created_by, updated_by)
VALUES(${name}, ${status}, ${accountId}, ${accountId})
RETURNING *;

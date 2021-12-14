INSERT INTO tasks(name, description, status, created_by, updated_by)
VALUES(${name}, ${description}, ${status}, ${accountId}, ${accountId})
RETURNING *;

INSERT INTO accounts(name, user_name, password)
VALUES(${name}, ${userName}, ${password})
RETURNING id;

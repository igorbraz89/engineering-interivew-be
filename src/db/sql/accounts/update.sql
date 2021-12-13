UPDATE accounts
    SET name =  ${name},
        user_name = ${userName}
    WHERE id = ${id}
RETURNING *;

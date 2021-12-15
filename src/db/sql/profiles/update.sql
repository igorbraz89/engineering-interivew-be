UPDATE profiles
SET role = ${role},
    active  = ${active}
WHERE account_id = ${accountId}
RETURNING *;

INSERT INTO profiles(account_id, role, active)
values (${accountId}, ${role}, ${active})
RETURNING *;

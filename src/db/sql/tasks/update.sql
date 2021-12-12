UPDATE tasks t
    SET name = ${name},
        status = ${status},
        updated_by = ${accountId}
WHERE id = ${id} and (
        created_by = ${accountId} OR
        (${accountId} = (select ta.account_id from task_assignment ta where ta.task_id = t.id))
    )
RETURNING *;

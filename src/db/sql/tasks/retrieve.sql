SELECT * from tasks t
    WHERE
        created_by = ${accountId} OR
        (${accountId} = (select ta.account_id from task_assignment ta where ta.task_id = t.id));

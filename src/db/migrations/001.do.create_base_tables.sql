set search_path = public;

CREATE TABLE accounts
(
    id         serial
        CONSTRAINT accounts_pkey PRIMARY KEY,
    name       text NOT NULL,
    user_name  text NOT NULL,
    password   varchar(60),
    authorized bool,
    CONSTRAINT uk__account_user_name unique (user_name)
);

CREATE TYPE status_type AS ENUM ('to_do', 'in_progress', 'done', 'archived');

CREATE TABLE tasks
(
    id         serial
        CONSTRAINT tasks_pkey PRIMARY KEY,
    name       text        NOT NULL,
    status     status_type NOT NULL,
    account_id integer     NOT NULL,
    CONSTRAINT fk__task_account_id FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE
);

CREATE TABLE task_assignment
(
    task_id    integer NOT NULL,
    account_id integer NOT NULL,
    CONSTRAINT fk__task_assignment_id FOREIGN KEY (task_id) REFERENCES accounts (id) ON DELETE CASCADE,
    CONSTRAINT fk__task_assignment_account_id FOREIGN KEY (account_id) REFERENCES tasks (id) ON DELETE CASCADE
);

set search_path = public;

CREATE TABLE accounts
(
    id         serial
        CONSTRAINT accounts_pkey PRIMARY KEY,
    name       text NOT NULL,
    user_name  text NOT NULL,
    password   varchar(60),
    CONSTRAINT uk__account_user_name unique (user_name)
);

CREATE TYPE status_type AS ENUM ('to_do', 'in_progress', 'done', 'archived');

CREATE TABLE tasks
(
    id          serial
        CONSTRAINT tasks_pkey PRIMARY KEY,
    name        text        NOT NULL,
    description varchar(255),
    status      status_type NOT NULL,
    created_by  integer     NOT NULL,
    updated_by  integer     NOT NULL,
    CONSTRAINT fk__task_created_by FOREIGN KEY (created_by) REFERENCES accounts (id) ON DELETE CASCADE,
    CONSTRAINT fk__task_updated_by FOREIGN KEY (updated_by) REFERENCES accounts (id) ON DELETE CASCADE

);

CREATE TABLE profiles
(
    account_id integer NOT NULL,
    role text not null,
    active bool not null default false,
    CONSTRAINT fk__profiles_account_id FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE,
    CONSTRAINT uk__user_profile unique (account_id)
);

CREATE TABLE task_assignment
(
    task_id    integer NOT NULL,
    account_id integer NOT NULL,
    CONSTRAINT fk__task_assignment_id FOREIGN KEY (task_id) REFERENCES accounts (id) ON DELETE CASCADE,
    CONSTRAINT fk__task_assignment_account_id FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE,
    CONSTRAINT uk__task_assignment unique (task_id, account_id)
);

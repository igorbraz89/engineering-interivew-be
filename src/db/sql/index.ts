import * as path from 'path';
import { QueryFile } from "pg-promise";

function sql(file, params?) {
    const fullPath = path.join(__dirname, file);
    return new QueryFile(fullPath, { minify: true, params });
}

const accounts = {
    create: sql('accounts/create.sql'),
    retrieve: sql('accounts/retrieve.sql'),
    retrieveAccountByUserName: sql('accounts/retrieveAccountByUserName.sql'),
}
const tasks = {
    create: sql('tasks/create.sql'),
    retrieve: sql('tasks/retrieve.sql'),
    delete: sql('tasks/delete.sql'),
    update: sql('tasks/update.sql'),
}

export {
    accounts,
    tasks,
};

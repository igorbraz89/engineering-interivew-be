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

export {
    accounts
};

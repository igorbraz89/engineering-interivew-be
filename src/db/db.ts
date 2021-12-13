import {IDatabase, IInitOptions, IMain} from "pg-promise";
import pgPromise from "pg-promise";
import Postgrator from 'postgrator';
import * as dotenv from 'dotenv';

dotenv.config();

interface IExtensions {
    bctx: any;
}

type ExtendedProtocolDB = IDatabase<IExtensions> & IExtensions;

type AuthorFieldsDBType = {
    createdBy?: number;
    updatedBy?: number;
};
const initOptions: IInitOptions<IExtensions> = {
    extend(obj: ExtendedProtocolDB) {
        // eslint-disable-next-line no-param-reassign
        obj.bctx = (optionsOrCallback, callback) => {
            const options = typeof optionsOrCallback === 'function' ? undefined : optionsOrCallback;
            const {bc: ignored, ...safeOptions} = options || {};
            const cb = typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
            const cbWrapper = async (tx) => {
                if (options && options.bc && options.bc.accountId) {
                    await tx.none(
                        [
                            'CREATE TEMP TABLE IF NOT EXISTS',
                            '  TEMP_TRANSACTION_CONTEXT(',
                            '    account_id INTEGER',
                            '  )',
                            'ON COMMIT DROP',
                        ].join(' ')
                    );
                    await tx.none('INSERT INTO TEMP_TRANSACTION_CONTEXT(account_id) VALUES($1)', [
                        options.bc.accountId,
                    ]);
                }
                return cb(tx);
            };
            return obj.tx(safeOptions, cbWrapper);
        };
    },
};
const pgp: IMain = pgPromise(initOptions);

function getDb(dbUrl?: string): ExtendedProtocolDB {
    console.log('dbUrl', dbUrl);
    const db = pgp({
        connectionString: dbUrl || process.env.DATABASE_URL,
        ...((!process.env.DATABASE_SSL || process.env.DATABASE_SSL === 'true') && {
            ssl: {
                rejectUnauthorized: false,
            },
        }),
    });
    return <pgPromise.IDatabase<IExtensions> & IExtensions>db;
}

async function migrate(to: string, dbUrl?: string) {
    const options: any = {
        connectionString: dbUrl || process.env.DATABASE_URL,
        driver: 'pg',
        migrationPattern: `${__dirname}/migrations/*.sql`,
        schemaTable: 'public.schemaversion2',
        ...((!process.env.DATABASE_SSL || process.env.DATABASE_SSL === 'true') && {
            ssl: {
                rejectUnauthorized: false,
            },
        }),
        validateChecksums: false, // Needed because of how checksums are calculated for JS migrations
    };
    const postgrator = new Postgrator(options);

    try {
        await postgrator.migrate(typeof to !== 'undefined' ? to : 'max');
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Migration failed', err);
        throw err;
    }
}
export { getDb, migrate };
export type { ExtendedProtocolDB, AuthorFieldsDBType };

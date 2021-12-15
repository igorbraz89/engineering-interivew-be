import pgTmp from "pg-tmp";
import { getDb, migrate } from "../db";
import {accountsData, accountsRef, profilesRef, tasksData} from "../../__mocks__/data";
import { createAccount } from "../accounts";
import { createTask } from "../tasks";
import {createUserProfile} from "../profiles";

const sampleAccount = accountsRef[0];
function hookUpTestDB() {
    let db;
    beforeEach(async () => {
        const { host, database } = await pgTmp({ setEnvironment: false, timeout: 30 });
        db = await getDb(`socket:${host}?db=${database}`);
        await migrate('max', db.$cn.connectionString);
    });
    afterEach(async () => {
        try {
            await migrate('000', db.$cn.connectionString);
        } finally {
            await db.$pool.end(() => {});
        }
    });
    return () => db;
}

const seedAccounts = (getDB) => {
    beforeEach(async () => {
        for (let i = 0; i < accountsData.length; i += 1) {
            // Guarantees order of insertion
            // eslint-disable-next-line no-await-in-loop
            await createAccount(getDB(), accountsData[i], 'Passw0rd');
        }
    });
}
const seedTasks = (getDB) => {
    beforeEach(async () => {
        for (let i = 0; i < tasksData.length; i += 1) {
            // Guarantees order of insertion
            // eslint-disable-next-line no-await-in-loop
            await createTask(getDB(), sampleAccount, tasksData[i]);
        }
    });
}
const seedProfiles = (getDB) => {
    beforeEach(async () => {
        for (let i = 0; i < profilesRef.length; i += 1) {
            // Guarantees order of insertion
            // eslint-disable-next-line no-await-in-loop
            await createUserProfile(getDB(), profilesRef[i]);
        }
    });
}
export { hookUpTestDB, seedAccounts, seedTasks, seedProfiles }

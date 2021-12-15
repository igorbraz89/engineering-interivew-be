import { ExtendedProtocolDB } from './db';
import { profiles } from "./sql";

type ProfileDBType = {
    role: string;
    active: boolean;
    accountId: number;
}
function mapRow(row) {
    return (row && {
        accountId: row.account_id,
        role: row.role,
        active: row.active
    })
}
async function createUserProfile(db: ExtendedProtocolDB, userProfile: ProfileDBType) {
    return db.one(profiles.create, {...userProfile }, mapRow);
}

async function updateUserProfile(db: ExtendedProtocolDB, userProfile: ProfileDBType) {
    return db.oneOrNone(profiles.update, {...userProfile }, mapRow);
}

async function retrieveUserProfile(db: ExtendedProtocolDB, accountId: number) {
    return db.oneOrNone(profiles.retrieve, { accountId }, mapRow);
}
export { createUserProfile, updateUserProfile, retrieveUserProfile };
export type { ProfileDBType };

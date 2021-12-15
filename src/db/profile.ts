import { ExtendedProtocolDB } from './db';
import { profiles } from "./sql";

type ProfileDBType = {
    role: string;
    active: boolean;
    accountId: number;
}
async function createUserProfile(db: ExtendedProtocolDB, userProfile: ProfileDBType) {
    return db.one(profiles.create, {...userProfile });
}

async function updateUserProfile(db: ExtendedProtocolDB, userProfile: ProfileDBType) {
    return db.oneOrNone(profiles.update, {...userProfile });
}

async function retrieveUserProfile(db: ExtendedProtocolDB, accountId: number) {
    return db.oneOrNone(profiles.retrieve, { accountId });
}
export { createUserProfile, updateUserProfile, retrieveUserProfile };
export type { ProfileDBType };

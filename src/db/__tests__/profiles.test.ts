import { hookUpTestDB, seedAccounts, seedProfiles } from "./helper";
import { createUserProfile, retrieveUserProfile, updateUserProfile } from "../profiles";
import { accountsRef, profilesRef } from "../../__mocks__/data";

const getDB = hookUpTestDB();
seedAccounts(getDB);
it('Create profile', async () => {
    const savedProfile = await createUserProfile(getDB(), profilesRef[0]);
    expect(savedProfile).toMatchObject(profilesRef[0]);
})

describe('With existing profile', () => {
    seedProfiles(getDB);
    it('Update Profile', async () => {
        const updatedProfile = {...profilesRef[0], role: 'dummy', active: false };
        const changedProfile = await updateUserProfile(getDB(), updatedProfile);
        expect(changedProfile).toMatchObject(updatedProfile);
    });

    it('Retrieve Account', async () => {
        const { id } = accountsRef[0];
        const userProfile = await retrieveUserProfile(getDB(), id);
        expect(userProfile).toBeDefined();
        expect(userProfile).toMatchObject(profilesRef[0])
    });
});

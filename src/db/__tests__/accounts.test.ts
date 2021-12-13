import {createAccount, retrieveAccountByUserName, SavedAccount, updateAccount} from "../accounts";
import {hookUpTestDB, seedAccounts} from "./helper";
import {accountsData, accountsRef} from "../../__mocks__/data";

const getDB = hookUpTestDB();
it('Create Account', async () => {
    const savedAccount = await createAccount(getDB(), accountsData[0], 'Passw0rd');
    expect(savedAccount).toBeDefined();
    expect(savedAccount).toBeGreaterThan(0);
})

describe('With existing accounts', () => {
    seedAccounts(getDB);
    it('Update Account', async () => {
        const updatedAccount = {...accountsRef[0], name: 'dummy'};
        const changedAccount = await updateAccount(getDB(), updatedAccount);
        expect(changedAccount).toBeDefined();
        expect(changedAccount).toMatchObject(updatedAccount);
    });

    it('Retrieve Account', async () => {
        const { userName } = accountsRef[0];
        const accounts: SavedAccount = await retrieveAccountByUserName(getDB(), userName);
        expect(accounts).toBeDefined();
        expect(accounts).toMatchObject(accountsRef[0])
    });
});

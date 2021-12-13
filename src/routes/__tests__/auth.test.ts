// @ts-nocheck
import request from 'supertest';
import { accountsRef} from "../../__mocks__/data";
import * as accounts from  '../../db/accounts';
import app from '../../app';

jest.mock('../../db/accounts');

it('Returns user account when authenticated', async () => {
  accounts.retrieveAccountByUserName.mockResolvedValue(accountsRef[0]);
  const agent = request.agent(app);
  const { body: { name, userName }, statusCode } = await agent.post('/api/auth/login');
  expect(statusCode).toBe(200);
  expect({ name, userName }).toMatchObject({ name: accountsRef[0].name, userName:  accountsRef[0].userName });
});

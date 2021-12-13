// @ts-nocheck

import * as request from 'supertest';
import { accountsData } from "../../__mocks__/data";

import app from '../../app';
import * as accounts from '../../db/accounts';

jest.mock('../../db/accounts');

function mockAuth(isUserAuth) {
  const agent = request.agent(
    app.use((err, req, res, next) => {
      // eslint-disable-next-line no-console
      console.error(err);
      next(err);
    })
  );
  beforeAll(async () => {
    accounts.retrieveAccountByUserName.mockImplementation(async (db, userName) => {
      let account = accountsData.find((a) => a.userName === userName);
      return isUserAuth ? account : null;
    });
    try {
      await agent.post('/api/auth/login');
    } catch(e) {
      console.log(e);
    }

  });

  afterAll(() => {
    accounts.retrieveAccountByUserName.mockReset();
  });
  return agent;
}

// eslint-disable-next-line import/prefer-default-export
export { mockAuth };

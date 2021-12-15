// @ts-nocheck

import * as request from 'supertest';
import {accountsData, accountsRef, profilesRef} from "../../__mocks__/data";
import enforce from 'express-sslify';

import app from '../../app';
import * as accounts from '../../db/accounts';
import * as profile from '../../db/profile';

jest.mock('../../db/accounts');
jest.mock('../../db/profile');


function mockAuth(role) {
  const agent = request.agent(
    app.use((err, req, res, next) => {
      // eslint-disable-next-line no-console
      console.error(err);
      enforce.HTTPS({ trustProtoHeader: true })
      next(err);
    })
  );
  beforeAll(async () => {
    accounts.retrieveAccountByUserName.mockImplementation(async () => {
      return role ? accountsRef[0] : null;
    });
    profile.retrieveUserProfile.mockImplementation(async () => {
      return role ? profilesRef[0] : null;
    });
    try {
      await agent.post('/api/auth/login');
    } catch(e) {
      console.log(e);
    }

  });

  afterAll(() => {
    accounts.retrieveAccountByUserName.mockReset();
    profile.retrieveUserProfile.mockReset();
  });
  return agent;
}

// eslint-disable-next-line import/prefer-default-export
export { mockAuth };

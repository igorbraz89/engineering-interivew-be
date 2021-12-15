import passport from 'passport';
import { Strategy as CustomStrategy } from 'passport-custom';
import type { ExtendedProtocolDB } from './db/db';
import {
    createAccount, retrieveAccountByUserName,
} from './db/accounts';
import { ConflictError } from './db/errors';
import {createUserProfile, retrieveUserProfile} from "./db/profiles";


const setUpPassport = (db: ExtendedProtocolDB) => {

  passport.use(
    'login',
    new CustomStrategy(async (req, done) => {
      try {
        const { userName, password } = req.body;
        const validAccount = await retrieveAccountByUserName(db, userName, password);
        if (!validAccount) {
          return done(null, false);
        }
        const { role } = await retrieveUserProfile(db, validAccount.id)
        return done(null, {...validAccount, role });
      } catch (err) {
        return done(err);
      }
    })
  );

 passport.use(
    'signup',
    new CustomStrategy(async (req, done) => {
      const { userName } = req.body;

      const existingAccount = await retrieveAccountByUserName(db, userName);
      if (existingAccount) {
        return done(
          new ConflictError(
            'Another account with the same user name already exists',
            'userName'
          ),
          null
        );
      }
      return db.tx(async (t: any) => {
           try {
               const { password } = req.body;
               const newAccount = await createAccount(t, req.body, password);
               const { role } = await createUserProfile(t, { accountId: newAccount, role: 'user', active: true });
               return done(null, { id: newAccount, role });
           } catch (err) {
               return done(err, null);
           }
      });
    })
  );

  if (process.env.NODE_ENV === 'test') {
    passport.use(
      'test',
      new CustomStrategy(async (req, done) => {
        const user = JSON.parse(req.header('X-Test-UserProfile') || '""');

        if (user !== null) {
          done(
            null,
              user || {
              id: 0,
              name: 'Tester',
              userName: 'test',
              authorized: true,
              role: 'user',
            }
          );
        } else {
          done(null, null);
        }
      })
    );
  }

  const passportMiddleware = passport.initialize();
  const sessionMiddleware = passport.session();

  passport.serializeUser((user: any, done) => {
    done(null, user.userName);
  });

  passport.deserializeUser(async (username: any, done) => {
    const account = await retrieveAccountByUserName(db, username);
    done(null, account as Express.User);
  });

  return {
    passport: passportMiddleware,
    session: sessionMiddleware,
  };
};

export default setUpPassport;

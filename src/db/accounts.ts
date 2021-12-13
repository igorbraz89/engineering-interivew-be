import { compare, hash } from 'bcrypt';
import * as Joi from 'joi';
import { ExtendedProtocolDB } from './db';
import { accounts } from "./sql";

type AccountDBType = {
  name: string;
  userName: string;
}
type SavedAccount = {
  id: number
} & AccountDBType;
const SALT_ROUNDS = 10;

const validName = Joi.string().min(2);
const validPassword = Joi.string().min(6);
const validUsername = Joi.string()
  .regex(/^(?!(-|.*-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]$/) // could not contain 2 or more '-' and should contain chars between a-z or A-Z or 0-9
  .min(3)
  .max(30);

const validSignup = Joi.object().keys({
  userName: validUsername.required(),
  name: validName.required(),
  password: validPassword.required(),
});

function mapRow(row) {
  return (row && {
    id: row.id,
    name: row.name,
    userName: row.user_name
  });
}

async function createAccount(db: ExtendedProtocolDB, account: AccountDBType, password: string) {
  await validSignup.validate({ ...account, password });
  const hashPassword = await hash(password, SALT_ROUNDS);
  const { id } = await db.one(accounts.create, { ...account, password: hashPassword });
  return id;
}

async function updateAccount(db: ExtendedProtocolDB, account: SavedAccount) {
  return await db.one(accounts.update, { ...account }, mapRow);
}

async function retrieveAccountByUserName(db: ExtendedProtocolDB, userName, txtPasw?) {
  const retrievedAccount = await db.oneOrNone(accounts.retrieveAccountByUserName, {userName});
  if (!retrievedAccount) {
    return null;
  }
  if(txtPasw) {
    const correctPassword = retrievedAccount?.password && (await compare(txtPasw, retrievedAccount?.password))
    if (!correctPassword) {
      return null;
    }
  }
  return mapRow(retrievedAccount);
}
export { createAccount, updateAccount, retrieveAccountByUserName }
export type { SavedAccount }

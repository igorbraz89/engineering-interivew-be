// @ts-nocheck
const path = require('path');
import dotenv from 'dotenv';

dotenv.config();

const CUR_MIGRATION_VERSION = '001';

/* eslint-disable no-console */
/* eslint-disable consistent-return */
const dbFile = (): string => {
  const dbFileSource = '../db/db';
  try {
    return path.join(__dirname, dbFileSource);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
};

/* eslint-disable-next-line import/no-dynamic-require */
const migrations = require(dbFile());

require('dotenv').config();

try {
  migrations
    .migrate(process.argv[2] || CUR_MIGRATION_VERSION)
    .then(() => {
      process.exit();
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
} catch (e) {
  console.error(e);
  process.exitCode = 1;
}

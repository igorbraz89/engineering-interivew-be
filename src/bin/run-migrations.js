"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
// @ts-nocheck
var path = require('path');
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1["default"].config();
var CUR_MIGRATION_VERSION = '001';
/* eslint-disable no-console */
/* eslint-disable consistent-return */
var dbFile = function () {
    var dbFileSource = '../db/db';
    try {
        return path.join(__dirname, dbFileSource);
    }
    catch (err) {
        console.error(err);
        process.exitCode = 1;
    }
};
/* eslint-disable-next-line import/no-dynamic-require */
var migrations = require(dbFile());
require('dotenv').config();
try {
    migrations
        .migrate(process.argv[2] || CUR_MIGRATION_VERSION)
        .then(function () {
        process.exit();
    })["catch"](function (error) {
        console.error(error);
        process.exitCode = 1;
    });
}
catch (e) {
    console.error(e);
    process.exitCode = 1;
}

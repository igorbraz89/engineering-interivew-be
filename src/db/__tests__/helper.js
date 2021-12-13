"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.seedTasks = exports.seedAccounts = exports.hookUpTestDB = void 0;
var pg_tmp_1 = __importDefault(require("pg-tmp"));
var db_1 = require("../db");
var data_1 = require("../../__mocks__/data");
var accounts_1 = require("../accounts");
var tasks_1 = require("../tasks");
var sampleAccount = data_1.accountsRef[0];
function hookUpTestDB() {
    var _this = this;
    var db;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, host, database;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, pg_tmp_1["default"])({ setEnvironment: false, timeout: 30 })];
                case 1:
                    _a = _b.sent(), host = _a.host, database = _a.database;
                    return [4 /*yield*/, (0, db_1.getDb)("socket:".concat(host, "?db=").concat(database))];
                case 2:
                    db = _b.sent();
                    return [4 /*yield*/, (0, db_1.migrate)('max', db.$cn.connectionString)];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 2, 4]);
                    return [4 /*yield*/, (0, db_1.migrate)('000', db.$cn.connectionString)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, db.$pool.end(function () { })];
                case 3:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    return function () { return db; };
}
exports.hookUpTestDB = hookUpTestDB;
var seedAccounts = function (getDB) {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < data_1.accountsData.length)) return [3 /*break*/, 4];
                    // Guarantees order of insertion
                    // eslint-disable-next-line no-await-in-loop
                    return [4 /*yield*/, (0, accounts_1.createAccount)(getDB(), data_1.accountsData[i], 'Passw0rd')];
                case 2:
                    // Guarantees order of insertion
                    // eslint-disable-next-line no-await-in-loop
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); });
};
exports.seedAccounts = seedAccounts;
var seedTasks = function (getDB) {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < data_1.tasksData.length)) return [3 /*break*/, 4];
                    // Guarantees order of insertion
                    // eslint-disable-next-line no-await-in-loop
                    return [4 /*yield*/, (0, tasks_1.createTask)(getDB(), sampleAccount, data_1.tasksData[i])];
                case 2:
                    // Guarantees order of insertion
                    // eslint-disable-next-line no-await-in-loop
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); });
};
exports.seedTasks = seedTasks;

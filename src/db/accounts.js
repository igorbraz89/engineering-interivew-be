"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.__esModule = true;
exports.retrieveAccountByUserName = exports.updateAccount = exports.createAccount = void 0;
var bcrypt_1 = require("bcrypt");
var Joi = __importStar(require("joi"));
var sql_1 = require("./sql");
var SALT_ROUNDS = 10;
var validName = Joi.string().min(2);
var validPassword = Joi.string().min(6);
var validUsername = Joi.string()
    .regex(/^(?!(-|.*-{2,}))[a-zA-Z0-9-]*[a-zA-Z0-9]$/) // could not contain 2 or more '-' and should contain chars between a-z or A-Z or 0-9
    .min(3)
    .max(30);
var validSignup = Joi.object().keys({
    userName: validUsername.required(),
    name: validName.required(),
    password: validPassword.required()
});
function mapRow(row) {
    return (row && {
        id: row.id,
        name: row.name,
        userName: row.user_name
    });
}
function createAccount(db, account, password) {
    return __awaiter(this, void 0, void 0, function () {
        var hashPassword, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, validSignup.validate(__assign(__assign({}, account), { password: password }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, bcrypt_1.hash)(password, SALT_ROUNDS)];
                case 2:
                    hashPassword = _a.sent();
                    return [4 /*yield*/, db.one(sql_1.accounts.create, __assign(__assign({}, account), { password: hashPassword }))];
                case 3:
                    id = (_a.sent()).id;
                    return [2 /*return*/, id];
            }
        });
    });
}
exports.createAccount = createAccount;
function updateAccount(db, account) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.one(sql_1.accounts.update, __assign({}, account), mapRow)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.updateAccount = updateAccount;
function retrieveAccountByUserName(db, userName, txtPasw) {
    return __awaiter(this, void 0, void 0, function () {
        var retrievedAccount, correctPassword, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.oneOrNone(sql_1.accounts.retrieveAccountByUserName, { userName: userName })];
                case 1:
                    retrievedAccount = _b.sent();
                    if (!retrievedAccount) {
                        return [2 /*return*/, null];
                    }
                    if (!txtPasw) return [3 /*break*/, 4];
                    _a = (retrievedAccount === null || retrievedAccount === void 0 ? void 0 : retrievedAccount.password);
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, bcrypt_1.compare)(txtPasw, retrievedAccount === null || retrievedAccount === void 0 ? void 0 : retrievedAccount.password)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    correctPassword = _a;
                    if (!correctPassword) {
                        return [2 /*return*/, null];
                    }
                    _b.label = 4;
                case 4: return [2 /*return*/, mapRow(retrievedAccount)];
            }
        });
    });
}
exports.retrieveAccountByUserName = retrieveAccountByUserName;

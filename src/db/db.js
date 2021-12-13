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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.migrate = exports.getDb = void 0;
var pg_promise_1 = __importDefault(require("pg-promise"));
var postgrator_1 = __importDefault(require("postgrator"));
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var initOptions = {
    extend: function (obj) {
        var _this = this;
        // eslint-disable-next-line no-param-reassign
        obj.bctx = function (optionsOrCallback, callback) {
            var options = typeof optionsOrCallback === 'function' ? undefined : optionsOrCallback;
            var _a = options || {}, ignored = _a.bc, safeOptions = __rest(_a, ["bc"]);
            var cb = typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
            var cbWrapper = function (tx) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(options && options.bc && options.bc.accountId)) return [3 /*break*/, 3];
                            return [4 /*yield*/, tx.none([
                                    'CREATE TEMP TABLE IF NOT EXISTS',
                                    '  TEMP_TRANSACTION_CONTEXT(',
                                    '    account_id INTEGER',
                                    '  )',
                                    'ON COMMIT DROP',
                                ].join(' '))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, tx.none('INSERT INTO TEMP_TRANSACTION_CONTEXT(account_id) VALUES($1)', [
                                    options.bc.accountId,
                                ])];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, cb(tx)];
                    }
                });
            }); };
            return obj.tx(safeOptions, cbWrapper);
        };
    }
};
var pgp = (0, pg_promise_1["default"])(initOptions);
function getDb(dbUrl) {
    console.log('dbUrl', dbUrl);
    var db = pgp(__assign({ connectionString: dbUrl || process.env.DATABASE_URL }, ((!process.env.DATABASE_SSL || process.env.DATABASE_SSL === 'true') && {
        ssl: {
            rejectUnauthorized: false
        }
    })));
    return db;
}
exports.getDb = getDb;
function migrate(to, dbUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var options, postgrator, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = __assign(__assign({ connectionString: dbUrl || process.env.DATABASE_URL, driver: 'pg', migrationPattern: "".concat(__dirname, "/migrations/*.sql"), schemaTable: 'public.schemaversion2' }, ((!process.env.DATABASE_SSL || process.env.DATABASE_SSL === 'true') && {
                        ssl: {
                            rejectUnauthorized: false
                        }
                    })), { validateChecksums: false });
                    postgrator = new postgrator_1["default"](options);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, postgrator.migrate(typeof to !== 'undefined' ? to : 'max')];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    // eslint-disable-next-line no-console
                    console.log('Migration failed', err_1);
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.migrate = migrate;

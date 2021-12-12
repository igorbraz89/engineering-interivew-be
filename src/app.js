"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var express_session_1 = __importDefault(require("express-session"));
var express_sslify_1 = __importDefault(require("express-sslify"));
var morgan_1 = __importDefault(require("morgan"));
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var helmet = __importStar(require("helmet"));
var db_1 = require("./db/db");
var passport_setup_1 = __importDefault(require("./passport-setup"));
var auth_1 = __importDefault(require("./routes/auth"));
var test_1 = __importDefault(require("./routes/test"));
var db = (0, db_1.getDb)();
var app = (0, express_1["default"])();
// Helmet security middleware -  It's easy to configure and provides a good set of validations to prevent common attacks
app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        scriptSrc: ["'self'", "'unsafe-inline'"],
        upgradeInsecureRequests: process.env.DISABLE_HTTPS === 'false' ? [] : null
    }
}));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
// Logging system
morgan_1["default"].token('sessionid', function (req) {
    return req.sessionID;
});
morgan_1["default"].token('user', function (req) {
    var _a, _b;
    return (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.passport) === null || _b === void 0 ? void 0 : _b.user;
});
app.use((0, morgan_1["default"])(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :user :sessionid'));
// Session middleware
if (process.env.NODE_ENV === 'test') {
    app.use((0, express_session_1["default"])({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
}
else {
    app.use((0, express_session_1["default"])({
        name: 'challengesession',
        secret: 'a4df5a96fecf5bad2a5b451559b9aeb8',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 86400000,
            sameSite: 'strict'
        }
    }));
}
// Body parser middleware
app.use(express_1["default"].json({ limit: '10mb' }));
app.use(express_1["default"].urlencoded({ limit: '10mb', extended: true }));
// Initialize Passport and restore authentication state, if any, from the session
var passportMiddlewares = (0, passport_setup_1["default"])(db);
app.use(passportMiddlewares.passport);
app.use(passportMiddlewares.session);
// Wire db
app.use(function (req, res, next) {
    req.db = db;
    next();
});
app.use('/api/auth', auth_1["default"]);
app.use('/api/test', test_1["default"]);
if (process.env.NODE_ENV === 'production') {
    app.use((0, morgan_1["default"])('common', {
        stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
    }));
    if (process.env.DISABLE_HTTPS === 'false') {
        app.use(express_sslify_1["default"].HTTPS({ trustProtoHeader: true }));
    }
}
app.use(function (err, req, res, next) {
    if (!res.headersSent && err.isJoi) {
        res.status(400).json({ message: err.message });
    }
    else {
        next(err);
    }
});
// Inserted some validations to better handle PG errors
app.use(function (err, req, res, next) {
    // https://www.postgresql.org/docs/10/errcodes-appendix.html
    var postgresUniqueViolation = '23505';
    var postgresInputIssues = function (code) {
        return ['22', '23', '44', 'P0'].some(function (errorClass) { return code.startsWith(errorClass); });
    };
    if (!res.headerSent && err.code && postgresInputIssues(err.code)) {
        res.status(err.code === postgresUniqueViolation ? 409 : 400).json({ message: err.message });
    }
    else {
        next(err);
    }
});
app.use(function (err, req, res, next) {
    if (!res.headersSent && err.isConflict) {
        res.status(409).json(err);
    }
    else {
        next(err);
    }
});
exports["default"] = app;

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
exports.ensureAuthenticated = void 0;
var express_promise_router_1 = __importDefault(require("express-promise-router"));
var passport_1 = __importDefault(require("passport"));
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var authenticateIfAuthorized = function (strategy) { return function (req, res, next) {
    passport_1["default"].authenticate(strategy, function (err, user) {
        if (err) {
            return next(err);
        }
        // TODO: In case of FE impl for this tech challenge redirect to error page.
        if (!user) {
            return res.redirect(303, '/');
        }
        return req.session.regenerate(function () {
            return req.login(user, function (loginErr) {
                if (loginErr) {
                    return next(loginErr);
                }
                return res.redirect(303, '/');
            });
        });
    })(req, res, next);
}; };
var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(401).json();
    }
};
exports.ensureAuthenticated = ensureAuthenticated;
function handleSignUp(req, res, next) {
    passport_1["default"].authenticate('signup', function (err, user) {
        if (err) {
            // TODO: redirect to the error page when it will be implemented
            return next(err);
        }
        if (!user.authorized) {
            return res.status(202).json(user);
        }
        return req.session.regenerate(function () {
            return req.login(user, function (loginErr) {
                if (loginErr) {
                    return next(loginErr);
                }
                return res.status(200).json(user);
            });
        });
    })(req, res, next);
}
function handleLogout(req, res) {
    req.session.destroy(function () { return req.logout(); });
    res.sendStatus(400).json();
}
var authRouter = (0, express_promise_router_1["default"])();
authRouter.use(function (req, _, next) {
    var returnTo = req.query.next;
    if (returnTo) {
        req.session.returnTo = decodeURIComponent(returnTo);
    }
    next();
});
authRouter.post('/signup', handleSignUp);
authRouter.post('/login', authenticateIfAuthorized(process.env.NODE_ENV === 'test' ? 'test' : 'login'));
authRouter.get('/logout', handleLogout);
authRouter.use(function (req, _, next) {
    var returnTo = req.query.next;
    if (returnTo) {
        req.session.returnTo = decodeURIComponent(returnTo);
    }
    next();
});
exports["default"] = authRouter;

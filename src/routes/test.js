"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_promise_router_1 = __importDefault(require("express-promise-router"));
var async_handler_1 = __importDefault(require("./async-handler"));
var auth_1 = require("./auth");
function handleTest(req, res) {
    return res.json({ message: 'Yes it works', user: req.user });
}
var testRouter = (0, express_promise_router_1["default"])();
testRouter.get('/', auth_1.ensureAuthenticated, (0, async_handler_1["default"])(handleTest));
exports["default"] = testRouter;

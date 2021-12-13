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
exports.__esModule = true;
exports.tasksRef = exports.tasksData = exports.accountsRef = exports.accountsData = void 0;
var sequences = {};
function nextId(seq) {
    var curValue = sequences[seq] || 0;
    var nextValue = curValue + 1;
    sequences[seq] = nextValue;
    return nextValue;
}
var accountsData = [
    {
        name: 'Igor',
        userName: 'braz'
    }
];
exports.accountsData = accountsData;
var accountsRef = accountsData.map(function (acc) { return (__assign(__assign({}, acc), { id: nextId('accounts') })); });
exports.accountsRef = accountsRef;
var tasksData = [
    {
        name: 'Study',
        status: 'in_progress'
    }
];
exports.tasksData = tasksData;
var tasksRef = tasksData.map(function (acc) { return (__assign(__assign({}, acc), { id: nextId('tasks'), createdBy: accountsRef[0].id, updatedBy: accountsRef[0].id })); });
exports.tasksRef = tasksRef;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callHook = exports.isEntries = exports.isPromise = void 0;
const index_1 = require("./index");
/**
 * Check if given value is a then-able.
 *
 * @param obj The object to test.
 */
function isPromise(obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
exports.isPromise = isPromise;
/**
 * Check if the given value is an object with entries.
 *
 * @param obj The object to test.
 */
function isEntries(obj) {
    return typeof obj === 'object' && typeof obj.entries === 'function';
}
exports.isEntries = isEntries;
function callHook(hook, args) {
    const hookArgs = args instanceof index_1.HookArgs ? args.args : [args];
    return hook(...hookArgs);
}
exports.callHook = callHook;

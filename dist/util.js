"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValue = exports.isEntries = exports.isPromise = void 0;
const hook_args_1 = require("./hook-args");
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
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.entries === 'function';
}
exports.isEntries = isEntries;
/**
 * Get the spreadable args from a HookArgs.
 *
 * @param value
 * @param wrap
 * @internal
 */
function getValue(value, wrap) {
    if (isPromise(value)) {
        return Promise
            .resolve(value)
            .then((resolvedValue) => {
            if (resolvedValue instanceof hook_args_1.HookArgs) {
                return resolvedValue.args;
            }
            else if (wrap) {
                return [resolvedValue];
            }
            return resolvedValue;
        });
    }
    if (value instanceof hook_args_1.HookArgs) {
        return value.args;
    }
    else if (wrap) {
        return [value];
    }
    return value;
}
exports.getValue = getValue;

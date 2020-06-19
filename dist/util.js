"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Check if given value is a then-able.
 *
 * @param {*} obj - The value to test.
 * @return {boolean}
 */
function isPromise(obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
exports.default = isPromise;

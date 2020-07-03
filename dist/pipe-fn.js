"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipe = void 0;
const pipe_1 = require("./pipe");
/**
 * Construct a new Pipe.
 * If entries is an Entries, each entry is added.
 * If entries is an object, each key value pair is added.
 * If entries is a function, it is added with itself as key.
 * @param entries
 */
function pipe(entries = {}) {
    const instance = new pipe_1.Pipe(entries);
    const fn = instance.transform.bind(instance);
    Object.setPrototypeOf(fn, instance);
    Object.setPrototypeOf(Object.getPrototypeOf(instance), Function.prototype);
    return fn;
}
exports.pipe = pipe;

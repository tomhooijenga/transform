"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipe = exports.HookArgs = void 0;
const hook_args_1 = require("./hook-args");
Object.defineProperty(exports, "HookArgs", { enumerable: true, get: function () { return hook_args_1.HookArgs; } });
const util_1 = require("./util");
class Pipe {
    /**
     * Construct a new Pipe.
     * If entries is an Entries, each entry is added.
     * If entries is an object, each key value pair is added.
     * If entries is a function, it is added with itself as key.
     * @param entries
     */
    constructor(entries = {}) {
        this.order = [];
        this.hooks = new Map();
        let addEntries = [];
        if (util_1.isEntries(entries)) {
            addEntries = [...entries.entries()];
        }
        else if (typeof entries === 'object') {
            addEntries = Object.entries(entries);
        }
        else if (typeof entries === 'function') {
            addEntries = [[entries, entries]];
        }
        addEntries.forEach(([key, value]) => this.set(key, value));
    }
    /**
     * Get a hook.
     */
    get(key) {
        return this.hooks.get(key);
    }
    /**
     * Append or overwrite a hook.
     */
    set(key, value) {
        if (!this.has(key)) {
            this.order.push(key);
        }
        this.hooks.set(key, value);
        return this;
    }
    /**
     * Check if a key is registered.
     */
    has(key) {
        return this.hooks.has(key);
    }
    /**
     * Delete a hook.
     */
    delete(key) {
        this.order = this.order.filter((entry) => entry !== key);
        return this.hooks.delete(key);
    }
    /**
     * Remove all hooks.
     */
    clear() {
        this.order.length = 0;
        this.hooks.clear();
    }
    /**
     * Insert a hook.
     *
     * @param neighbour - The key to insert before or after.
     * @param key - The key to use.
     * @param value - The hook to insert.
     * @param insertAfter - true to insert after neighbour, false to insert before.
     */
    insert(neighbour, key, value = key, insertAfter = true) {
        if (!this.has(neighbour)) {
            throw new Error(`No such neighbour key [${neighbour}]`);
        }
        const offset = insertAfter ? 1 : 0;
        const index = this.order.indexOf(neighbour);
        this.order.splice(index + offset, 0, key);
        this.hooks.set(key, value);
        return this;
    }
    /**
     * Insert a hook before another.
     *
     * @param neighbour - The key to insert before or after.
     * @param key - The key to use.
     * @param value - The hook to insert.
     */
    before(neighbour, key, value = key) {
        return this.insert(neighbour, key, value, false);
    }
    /**
     * Insert a hook after another.
     *
     * @param neighbour - The key to insert before or after.
     * @param key - The key to use.
     * @param value - The hook to insert.
     */
    after(neighbour, key, value = key) {
        return this.insert(neighbour, key, value, true);
    }
    /**
     * Transform the pipe with the given args.
     *
     * @param args - Initial arguments to call the first function with.
     */
    transform(...args) {
        const result = this.order.reduce((value, action) => {
            const hook = this.get(action);
            if (util_1.isPromise(value)) {
                return util_1.getValue(value, true)
                    .then((resolvedValue) => {
                    return hook(...resolvedValue);
                });
            }
            return hook(...util_1.getValue(value, true));
        }, new hook_args_1.HookArgs(...args));
        return util_1.getValue(result, false);
    }
    /**
     * Execute the given callback once for each entry.
     */
    forEach(callback, thisArg = null) {
        for (const key of this.order) {
            callback.call(thisArg, key, this.get(key), this);
        }
    }
    /**
     * Get an iterable for the registered key-hook pairs.
     */
    *[Symbol.iterator]() {
        for (const key of this.order) {
            yield [key, this.get(key)];
        }
    }
    /**
     * Get an iterable for the registered key-hook pairs.
     */
    *entries() {
        for (const key of this.order) {
            yield [key, this.get(key)];
        }
    }
    /**
     * Get an iterable for the registered keys.
     */
    *keys() {
        for (const key of this.order) {
            yield key;
        }
    }
    /**
     * Get an iterable for the registered hooks.
     */
    *values() {
        for (const key of this.order) {
            yield this.get(key);
        }
    }
    /**
     * Get the amount of entries.
     */
    get size() {
        return this.hooks.size;
    }
}
exports.default = Pipe;
exports.Pipe = Pipe;

"use strict";
// export interface Pipe {
//     constructor(entries: Object): Pipe;
//
// }
Object.defineProperty(exports, "__esModule", { value: true });
function isEntries(obj) {
    return typeof obj === 'object' && typeof obj.entries === 'function';
}
class Pipe {
    constructor(entries) {
        this.order = [];
        this.hooks = new Map();
        let addEntries = [];
        if (isEntries(entries)) {
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
    set(key, value) {
        if (!this.has(key)) {
            this.order.push(key);
        }
        this.hooks.set(key, value);
        return this;
    }
    has(key) {
        return this.hooks.has(key);
    }
}
exports.default = Pipe;
const x = new Pipe(new Map());
x.set('yo', () => {
});

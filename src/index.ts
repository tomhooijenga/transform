// export interface Pipe {
//     constructor(entries: Object): Pipe;
//
// }

import {isEntries} from './util';

interface Entries extends Object {
    entries(): IterableIterator<[any, Function]>;
}

export default class Pipe {

    protected order: Array<any> = [];

    protected hooks: Map<any, Function> = new Map();

    constructor(entries: Entries | Function) {
        let addEntries: Array<Array<any>> = [];

        if (isEntries(entries)) {
            addEntries = [...entries.entries()];
        } else if (typeof entries === 'object') {
            addEntries = Object.entries(entries);
        } else if (typeof entries === 'function') {
            addEntries = [[entries, entries]];
        }

        addEntries.forEach(([key, value]) => this.set(key, value));
    }

    set(key: any, value: Function): this {
        if (!this.has(key)) {
            this.order.push(key);
        }

        this.hooks.set(key, value);

        return this;
    }

    has(key: any): boolean {
        return this.hooks.has(key);
    }
}


const x = new Pipe(new Map());

x.set('yo', () => {
});
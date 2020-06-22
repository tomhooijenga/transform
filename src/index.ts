import {HookArgs} from "./hook-args";
import {Entries, ForEachCallback, Hook} from './types';
import {isPromise, isEntries, callHook} from './util';

export {
    HookArgs,
    Pipe,
}

export default class Pipe implements Iterable<[any, Hook]> {

    protected order: any[] = [];

    protected readonly hooks: Map<any, Hook> = new Map();

    constructor(entries: Entries | object | Hook = {}) {
        let addEntries: [any, Hook][] = [];

        if (isEntries(entries)) {
            addEntries = [...entries.entries()];
        } else if (typeof entries === 'object') {
            addEntries = Object.entries(entries);
        } else if (typeof entries === 'function') {
            addEntries = [['main', entries]];
        }

        addEntries.forEach(([key, value]) => this.set(key, value));
    }

    /**
     * Get a hook.
     */
    get(key: any): Hook | undefined {
        return this.hooks.get(key);
    }

    /**
     * Append or overwrite a hook.
     */
    set(key: any, value: Hook): this {
        if (!this.has(key)) {
            this.order.push(key);
        }

        this.hooks.set(key, value);

        return this;
    }

    /**
     * Check if a key is registered.
     */
    has(key: any): boolean {
        return this.hooks.has(key);
    }

    /**
     * Delete a hook.
     */
    delete(key: any): boolean {
        this.order = this.order.filter((entry) => entry !== key);
        return this.hooks.delete(key);
    }

    /**
     * Remove all hooks.
     */
    clear(): void {
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
    insert(neighbour: any, key: any, value: Hook = key, insertAfter: boolean = true): this {
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
    before(neighbour: any, key: any, value: Hook = key): this {
        return this.insert(neighbour, key, value, false);
    }

    /**
     * Insert a hook after another.
     *
     * @param neighbour - The key to insert before or after.
     * @param key - The key to use.
     * @param value - The hook to insert.
     */
    after(neighbour: any, key: any, value: Hook = key): this {
        return this.insert(neighbour, key, value, true);
    }

    /**
     * Transform the pipe with the given args.
     *
     * @param args - Single param to be used directly or a HookArgs to spread.
     */
    transform(...args: any[]): Promise<any> |  any {
        const result = this.order.reduce((value, action) => {
            const hook = this.get(action) as Hook;

            if (isPromise(value)) {
                return Promise
                    .resolve(value)
                    .then((resolvedValue) => {
                        return callHook(hook, resolvedValue);
                    });
            }

            return callHook(hook, value);
        }, new HookArgs(...args));

        if (isPromise(result)) {
            return Promise
                .resolve(result)
                .then((resolvedResult) => {
                    return resolvedResult instanceof HookArgs ? resolvedResult.args : resolvedResult;
                });
        }

        return result instanceof HookArgs ? result.args : result;
    }

    /**
     * Execute the given callback once for each entry.
     */
    forEach(callback: ForEachCallback, thisArg: any = null): void {
        for (const key of this.order) {
            callback.call(thisArg, key, this.get(key) as Hook, this);
        }
    }

    /**
     * Get an iterable for the registered key-hook pairs.
     */
    * [Symbol.iterator](): IterableIterator<[any, Hook]> {
        for (const key of this.order) {
            yield [key, this.get(key) as Hook];
        }
    }

    /**
     * Get an iterable for the registered key-hook pairs.
     */
    * entries(): Iterable<[any, Hook]> {
        for (const key of this.order) {
            yield [key, this.get(key) as Hook];
        }
    }

    /**
     * Get an iterable for the registered keys.
     */
    * keys(): Iterable<any> {
        for (const key of this.order) {
            yield key;
        }
    }

    /**
     * Get an iterable for the registered hooks.
     */
    * values(): Iterable<Hook> {
        for (const key of this.order) {
            yield this.get(key) as Hook;
        }
    }

    /**
     * Get the amount of entries.
     */
    get size(): number {
        return this.hooks.size;
    }
}

const p = new Pipe();
p.transform(new HookArgs())
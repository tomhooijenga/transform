import { HookArgs } from "./hook-args";
import { Entries, ForEachCallback, Hook } from './types';
export { HookArgs, Pipe, };
export default class Pipe implements Iterable<[any, Hook]> {
    protected order: any[];
    protected readonly hooks: Map<any, Hook>;
    /**
     * Construct from an object that has an `entries` method.
     * @param iterable
     */
    constructor(iterable: Entries);
    /**
     * Construct from a single function which is both the key and the hook.
     * @param entry
     */
    constructor(entry: Hook);
    /**
     * Construct from an object of keys and values.
     * @param entries
     */
    constructor(entries: object);
    /**
     * Get a hook.
     */
    get(key: any): Hook | undefined;
    /**
     * Append or overwrite a hook.
     */
    set(key: any, value: Hook): this;
    /**
     * Check if a key is registered.
     */
    has(key: any): boolean;
    /**
     * Delete a hook.
     */
    delete(key: any): boolean;
    /**
     * Remove all hooks.
     */
    clear(): void;
    /**
     * Insert a hook.
     *
     * @param neighbour - The key to insert before or after.
     * @param key - The key to use.
     * @param value - The hook to insert.
     * @param insertAfter - true to insert after neighbour, false to insert before.
     */
    insert(neighbour: any, key: any, value?: Hook, insertAfter?: boolean): this;
    /**
     * Insert a hook before another.
     *
     * @param neighbour - The key to insert before or after.
     * @param key - The key to use.
     * @param value - The hook to insert.
     */
    before(neighbour: any, key: any, value?: Hook): this;
    /**
     * Insert a hook after another.
     *
     * @param neighbour - The key to insert before or after.
     * @param key - The key to use.
     * @param value - The hook to insert.
     */
    after(neighbour: any, key: any, value?: Hook): this;
    /**
     * Transform the pipe with the given args.
     *
     * @param args - Initial arguments to call the first function with.
     */
    transform(...args: any[]): Promise<any> | any;
    /**
     * Execute the given callback once for each entry.
     */
    forEach(callback: ForEachCallback, thisArg?: any): void;
    /**
     * Get an iterable for the registered key-hook pairs.
     */
    [Symbol.iterator](): IterableIterator<[any, Hook]>;
    /**
     * Get an iterable for the registered key-hook pairs.
     */
    entries(): Iterable<[any, Hook]>;
    /**
     * Get an iterable for the registered keys.
     */
    keys(): Iterable<any>;
    /**
     * Get an iterable for the registered hooks.
     */
    values(): Iterable<Hook>;
    /**
     * Get the amount of entries.
     */
    get size(): number;
}

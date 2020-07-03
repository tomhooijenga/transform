# Installation
```
npm i @teamawesome/transform
```
# Usage
```typescript
import Pipe from '@teamawesome/transform'

const p = new Pipe({
    first: () => {},
});
// Insert a function after another
p.after('first', 'afterFirst', () => {});
// Insert a function before another
p.before('first', 'beforeFirst', () => {});

// will run 'beforeFirst', 'first', 'afterFirst'.
const value = p.transform();
```
# Constructor
Can be given an iterable with entries, an object, or just a function.
```typescript
new Pipe({
    first: () => {},
    second: () => {}
});

new Pipe(function main () {
});

new Pipe(new Map(...));

// Clone a pipe
new Pipe(otherPipe);
```

# Methods

##  insert, before, after
```typescript
const key = {};
const func = () => {};

// A function can be registered with any key.
pipe.insert('neighbour', key, func);

// You can also use the hook as the key. The following have the same result.
pipe.insert('neighbour', func, func);
pipe.insert('neighbour', func);
```
## transform
```typescript
import {Pipe, Arguments} from '@teamwesome/transform';

const pipe = new Pipe([
    (a, b) => a + b,
    (sum) => sum * 2, 
    (product) => product / 2, 
]);
// Each function is called with the result of the last function.
pipe.transform(2, 4); // 16

// If you want to return multiple args for the next hook, return a Arguments.
const pipe = new Pipe([
    (obj) => {
        const keys = Object.keys(obj);
        const values = Object.values(obj);
        return new Arguments(keys, values);
    },
    (keys, values) => {
        return new Arguments(
            keys.includes('hello'),
            values.includes('world')
        )
    }, 
]);

pipe.transform({
    hello: 'planet',
}); // [true, false]
```

## All methods
```typescript
export default class Pipe implements Iterable<[any, Hook]> {
    protected order: any[];
    protected readonly hooks: Map<any, Hook>;
    /**
     * Construct a new Pipe.
     * If entries is an Entries, each entry is added.
     * If entries is an object, each key value pair is added.
     * If entries is a function, it is added with itself as key.
     * @param entries
     */
    constructor(entries?: Entries | object | Hook);
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
     * @param args - Initial arguments call the first function with.
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

export interface Entries {
    entries(): IterableIterator<[any, Hook]>;
}
export declare type Hook = (...args: any[]) => any;
export declare type ForEachCallback = (key: any, hook: Hook, pipe: Pipe) => void;
```
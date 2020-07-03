import {Pipe} from "./pipe";
import {Entries, Hook} from "./types";

/**
 * Construct a new Pipe.
 * If entries is an Entries, each entry is added.
 * If entries is an object, each key value pair is added.
 * If entries is a function, it is added with itself as key.
 * @param entries
 */
export function pipe(entries: Entries | object | Hook = {}) {
    const instance = new Pipe(entries);
    const fn = instance.transform.bind(instance);
    Object.setPrototypeOf(fn, instance);
    Object.setPrototypeOf(Object.getPrototypeOf(instance), Function.prototype);
    return fn;
}
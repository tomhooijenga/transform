import {Entries, Hook} from "./types";
import {HookArgs} from "./index";

/**
 * Check if given value is a then-able.
 *
 * @param obj The object to test.
 */
export function isPromise(obj: any): obj is Promise<any> {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * Check if the given value is an object with entries.
 *
 * @param obj The object to test.
 */
export function isEntries(obj: any): obj is Entries {
    return typeof obj === 'object' && typeof obj.entries === 'function';
}

export function callHook(hook: Hook, args: HookArgs | any): any {
    const hookArgs = args instanceof HookArgs ? args.args : [args];
    return hook(...hookArgs);
}
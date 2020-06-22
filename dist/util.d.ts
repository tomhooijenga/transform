import { Entries, Hook } from "./types";
import { HookArgs } from "./index";
/**
 * Check if given value is a then-able.
 *
 * @param obj The object to test.
 */
export declare function isPromise(obj: any): obj is Promise<any>;
/**
 * Check if the given value is an object with entries.
 *
 * @param obj The object to test.
 */
export declare function isEntries(obj: any): obj is Entries;
export declare function callHook(hook: Hook, args: HookArgs | any): any;

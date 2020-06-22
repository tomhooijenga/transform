import { Entries } from "./types";
import { HookArgs } from "./hook-args";
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
/**
 * Get the spreadable args from a HookArgs.
 *
 * @param value
 * @param wrap
 * @internal
 */
export declare function getValue(value: HookArgs | any, wrap: boolean): Promise<any> | any;

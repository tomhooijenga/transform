import {Entries} from "./types";
import {HookArgs} from "./hook-args";

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
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.entries === 'function';
}

/**
 * Get the spreadable args from a HookArgs.
 *
 * @param value
 * @param wrap
 * @internal
 */
export function getValue(value: HookArgs | any, wrap: boolean): Promise<any> | any {
    if (isPromise(value)) {
        return Promise
            .resolve(value)
            .then((resolvedValue) => {
                if (resolvedValue instanceof HookArgs) {
                    return resolvedValue.args;
                } else if (wrap) {
                    return [resolvedValue];
                }
                return resolvedValue;
            });
    }

    if (value instanceof HookArgs) {
        return value.args;
    } else if (wrap) {
        return [value];
    }
    return value;
}
import {Entries} from "./types";
import {Arguments} from "./arguments";

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
 * Get the spreadable args from a Arguments.
 *
 * @param value
 * @param wrap
 * @internal
 */
export function getValue(value: Arguments | any, wrap: boolean): Promise<any> | any {
    if (isPromise(value)) {
        return Promise
            .resolve(value)
            .then((resolvedValue) => {
                if (resolvedValue instanceof Arguments) {
                    return resolvedValue.args;
                } else if (wrap) {
                    return [resolvedValue];
                }
                return resolvedValue;
            });
    }

    if (value instanceof Arguments) {
        return value.args;
    } else if (wrap) {
        return [value];
    }
    return value;
}
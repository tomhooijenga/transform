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
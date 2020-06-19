/**
 * Check if given value is a then-able.
 *
 * @param {*} obj - The value to test.
 * @return {boolean}
 */
export default function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

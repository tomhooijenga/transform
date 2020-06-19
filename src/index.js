import isPromise from './util';

export default class Pipe {
  /**
   * @type {*[]}
   * @private
   */
  order = [];

  /**
   * @type {Map<any, any>}
   * @private
   */
  hooks = new Map();

  /**
   * @param {Function|Iterable|Object} entries
   * @return {Function}
   */
  constructor(entries = {}) {
    let pairs;
    if (typeof entries.entries === 'function') {
      pairs = [...entries.entries()];
    } else if (typeof entries === 'object') {
      pairs = Object.entries(entries);
    } else if (typeof entries === 'function') {
      pairs = [['main', entries]];
    }

    pairs.forEach(([key, value]) => this.set(key, value));
  }

  /**
   * @param args
   * @param thisArg
   */
  transform(args, thisArg) {
    return this.order.reduce((value, action) => {
      const func = this.get(action);

      if (isPromise(value)) {
        return Promise.resolve(value).then(
          (resolvedValue) => func.call(thisArg, resolvedValue),
        );
      }

      return func.call(thisArg, value);
    }, args);
  }

  /**
   * Check if a hook is registered.
   *
   * @param {*} key The name of the hook
   * @return {boolean}
   */
  has(key) {
    return this.hooks.has(key);
  }

  /**
   * Get the registered hook or undefined.
   *
   * @param {*} key The name of the hook
   * @return {boolean}
   */
  get(key) {
    return this.hooks.get(key);
  }

  /**
   * Push a function on the stack or overwrite an existing one.
   *
   * @param {string|*} key The name of the hook
   * @param {Function} value The function to call
   * @return {Pipe}
   */
  set(key, value) {
    if (!this.has(key)) {
      this.order.push(key);
    }

    this.hooks.set(key, value);

    return this;
  }

  /**
   * Insert a function in the stack.
   *
   * @param {string|*} key The name of the hook
   * @param {Function} value The function to call
   * @param {string|*} neighbour The neighbour to insert before or after
   * @param {boolean} after True to insert after the neighbour, false to
   *                        insert before
   * @return {Pipe}
   */
  insert(neighbour, key, value = key, after = true) {
    if (!this.has(neighbour)) {
      throw new Error(`No such neighbour key [${neighbour}]`);
    }

    const offset = after ? 1 : 0;
    const index = this.order.indexOf(neighbour);

    this.order.splice(index + offset, 0, key);
    this.hooks.set(key, value);

    return this;
  }

  /**
   * Insert a function before another.
   *
   * @param {string|*} neighbour The neighbour to insert before
   * @param {string|*} key The name of the hook
   * @param {Function} value The function to call
   * @return {Pipe}
   */
  before(neighbour, key, value) {
    return this.insert(neighbour, key, value, false);
  }

  /**
   * Insert a function after another.
   * @param {string|*} neighbour The neighbour to insert after
   * @param {string|*} key The name of the hook
   * @param {Function} value The function to call
   * @return {Pipe}
   */
  after(neighbour, key, value) {
    return this.insert(neighbour, key, value, true);
  }

  /**
   * Remove a function from the stack.
   *
   * @param {string|*} key The name of the hook
   * @return {boolean}
   */
  delete(key) {
    this.order = this.order.filter((entry) => entry !== key);
    return this.hooks.delete(key);
  }

  /**
   * Clear the stack.
   * @return {undefined}
   */
  clear() {
    this.order.length = 0;
    this.hooks.clear();
  }

  /**
   * Execute the given callback once for each entry.
   *
   * @param {Function} callback
   * @param {*} thisArg
   */
  forEach(callback, thisArg) {
    for (let i = 0; i < this.order.length; i += 1) {
      const key = this.order[i];

      callback.call(thisArg, key, this.get(key), this);
    }
  }

  /**
   * @inheritDoc
   */
  * [Symbol.iterator]() {
    for (let i = 0; i < this.order.length; i += 1) {
      const key = this.order[i];

      yield [key, this.get(key)];
    }
  }

  /**
   * @inheritDoc
   */
  * entries() {
    for (let i = 0; i < this.order.length; i += 1) {
      const key = this.order[i];

      yield [key, this.get(key)];
    }
  }

  /**
   * @inheritDoc
   */
  * keys() {
    for (let i = 0; i < this.order.length; i += 1) {
      yield this.order[i];
    }
  }

  /**
   * @inheritDoc
   */
  * values() {
    for (let i = 0; i < this.order.length; i += 1) {
      yield this.get(this.order[i]);
    }
  }

  /**
   * Get the amount of entries.
   *
   * @return {Number}
   */
  get size() {
    return this.hooks.size;
  }
}

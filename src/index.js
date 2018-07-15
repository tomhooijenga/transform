export default class {
  /**
   * @type {Map<*, Function>}
   */
  actions = new Map();

  /**
   * @type {*[]}
   */
  order = [];

  /**
   * @param {Function|Iterable|Object} wrapped
   * @return {Function}
   */
  constructor (wrapped = {}) {
    let entries
    if (wrapped[Symbol.iterator]) {
      entries = [...wrapped.entries()]
    } else if (typeof wrapped === 'object') {
      entries = Object.entries(wrapped)
    } else if (typeof wrapped === 'function') {
      entries = [['main', wrapped]]
    }

    for (let i = entries.length - 1; i >= 0; i -= 1) {
      const [name, func] = entries[i]
      this.add(name, func)
    }
  }

  /**
   * @param args
   */
  call (args) {
    return this.order.reduce((value, action) => {
      if (value instanceof Promise) {
        return value.then(
          resolvedValue => this.actions.get(action)(resolvedValue),
        )
      }

      return this.actions.get(action)(value)
    }, args)
  }

  /**
   * Register a function on the stack
   *
   * @param {string|*} name The name of the hook
   * @param {Function} func The function to call
   * @param {string|null} after Optional hook to place this one after. When
   * empty, the hook is put in front of the stack
   */
  add (name, func, after = null) {
    this.actions.set(name, func)

    let index = 0
    if (after !== null) {
      if (!this.actions.has(after)) {
        throw new Error(`After function [${after}] not registered`)
      }
      index = this.order.indexOf(after) + 1
    }

    this.order.splice(index, 0, name)
  }

  /**
   * Remove a function from the stack
   * @param {string|*} name
   */
  remove (name) {
    if (!this.actions.has(name)) {
      throw new Error(`Function [${name}] not registered`)
    }

    this.actions.delete(name)
    this.order.splice(this.order.indexOf(name), 1)
  }
}

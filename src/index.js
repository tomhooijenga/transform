export default class Pipe extends Map {
  /**
   * @type {*[]}
   */
  order = []

  /**
   * @param {Function|Iterable|Object} wrapped
   * @return {Function}
   */
  constructor (wrapped = {}) {
    super()

    let entries
    if (wrapped[Symbol.iterator]) {
      entries = [...wrapped.entries()]
    } else if (typeof wrapped === 'object') {
      entries = Object.entries(wrapped)
    } else if (typeof wrapped === 'function') {
      entries = [['main', wrapped]]
    }

    entries.forEach(([key, value]) => this.set(key, value))
  }

  /**
   * @param args
   */
  call (args) {
    return this.order.reduce((value, action) => {
      if (value instanceof Promise) {
        return value.then(
          resolvedValue => this.get(action)(resolvedValue),
        )
      }

      return this.get(action)(value)
    }, args)
  }

  /**
   * Push a function on the stack
   *
   * @param {string|*} key The name of the hook
   * @param {Function} value The function to call
   * @return {Pipe}
   */
  set (key, value) {
    this.order.push(key)

    return super.set(key, value)
  }

  /**
   * Insert a function in the stack
   *
   * @param {string|*} key The name of the hook
   * @param {Function} value The function to call
   * @param {string|*} neighbour The neighbour to insert before or after
   * @param {boolean} after True to insert after the neighbour, false to
   *                        insert before
   * @return {Pipe}
   */
  insert (key, value, neighbour, after = true) {
    if (!this.has(neighbour)) {
      throw new Error(`No such neighbour key [${neighbour}]`)
    }

    const offset = after ? 1 : 0
    const index = this.order.indexOf(neighbour)

    this.order.splice(index + offset, 0, key)
    return super.set(key, value)
  }

  /**
   * Remove a function from the stack
   *
   * @param {string|*} key
   * @return {boolean}
   */
  delete (key) {
    this.order.filter(entry => entry !== key)

    return super.delete(key)
  }

  /**
   * Clear the stack
   */
  clear () {
    this.order.length = 0

    return super.clear()
  }
}

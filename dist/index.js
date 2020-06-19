"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _util = _interopRequireDefault(require("./util"));

var _Symbol$iterator;

_Symbol$iterator = Symbol.iterator;

var Pipe = /*#__PURE__*/function () {
  /**
   * @type {*[]}
   * @private
   */

  /**
   * @type {Map<any, any>}
   * @private
   */

  /**
   * @param {Function|Iterable|Object} entries
   * @return {Function}
   */
  function Pipe() {
    var _this = this;

    var entries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, Pipe);
    (0, _defineProperty2["default"])(this, "order", []);
    (0, _defineProperty2["default"])(this, "hooks", new Map());
    var pairs;

    if (typeof entries.entries === 'function') {
      pairs = (0, _toConsumableArray2["default"])(entries.entries());
    } else if ((0, _typeof2["default"])(entries) === 'object') {
      pairs = Object.entries(entries);
    } else if (typeof entries === 'function') {
      pairs = [['main', entries]];
    }

    pairs.forEach(function (_ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      return _this.set(key, value);
    });
  }
  /**
   * @param args
   * @param thisArg
   */


  (0, _createClass2["default"])(Pipe, [{
    key: "transform",
    value: function transform(args, thisArg) {
      var _this2 = this;

      return this.order.reduce(function (value, action) {
        var func = _this2.get(action);

        if ((0, _util["default"])(value)) {
          return Promise.resolve(value).then(function (resolvedValue) {
            return func.call(thisArg, resolvedValue);
          });
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

  }, {
    key: "has",
    value: function has(key) {
      return this.hooks.has(key);
    }
    /**
     * Get the registered hook or undefined.
     *
     * @param {*} key The name of the hook
     * @return {boolean}
     */

  }, {
    key: "get",
    value: function get(key) {
      return this.hooks.get(key);
    }
    /**
     * Push a function on the stack or overwrite an existing one.
     *
     * @param {string|*} key The name of the hook
     * @param {Function} value The function to call
     * @return {Pipe}
     */

  }, {
    key: "set",
    value: function set(key, value) {
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

  }, {
    key: "insert",
    value: function insert(key, value, neighbour) {
      var after = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      if (!this.has(neighbour)) {
        throw new Error("No such neighbour key [".concat(neighbour, "]"));
      }

      var offset = after ? 1 : 0;
      var index = this.order.indexOf(neighbour);
      this.order.splice(index + offset, 0, key);
      this.hooks.set(key, value);
      return this;
    }
    /**
     * Insert a function before another.
     *
     * @param {string|*} key The name of the hook
     * @param {Function} value The function to call
     * @param {string|*} neighbour The neighbour to insert before
     * @return {Pipe}
     */

  }, {
    key: "before",
    value: function before(key, value, neighbour) {
      return this.insert(key, value, neighbour, false);
    }
    /**
     * Insert a function after another.
     *
     * @param {string|*} key The name of the hook
     * @param {Function} value The function to call
     * @param {string|*} neighbour The neighbour to insert after
     * @return {Pipe}
     */

  }, {
    key: "after",
    value: function after(key, value, neighbour) {
      return this.insert(key, value, neighbour, true);
    }
    /**
     * Remove a function from the stack.
     *
     * @param {string|*} key
     * @return {boolean}
     */

  }, {
    key: "delete",
    value: function _delete(key) {
      this.order.filter(function (entry) {
        return entry !== key;
      });
      return this.hooks["delete"](key);
    }
    /**
     * Clear the stack.
     */

  }, {
    key: "clear",
    value: function clear() {
      this.order.length = 0;
      this.hooks.clear();
    }
    /**
     * Execute the given callback once for each entry.
     *
     * @param {Function} callback
     * @param {*} thisArg
     */

  }, {
    key: "forEach",
    value: function forEach(callback, thisArg) {
      for (var i = 0; i < this.order.length; i += 1) {
        var key = this.order[i];
        callback.call(thisArg, key, this.get(key), this);
      }
    }
    /**
     * @inheritDoc
     */

  }, {
    key: _Symbol$iterator,
    value: /*#__PURE__*/_regenerator["default"].mark(function value() {
      var i, key;
      return _regenerator["default"].wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              i = 0;

            case 1:
              if (!(i < this.order.length)) {
                _context.next = 8;
                break;
              }

              key = this.order[i];
              _context.next = 5;
              return [key, this.get(key)];

            case 5:
              i += 1;
              _context.next = 1;
              break;

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, value, this);
    })
    /**
     * @inheritDoc
     */

  }, {
    key: "entries",
    value: /*#__PURE__*/_regenerator["default"].mark(function entries() {
      var i, key;
      return _regenerator["default"].wrap(function entries$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              i = 0;

            case 1:
              if (!(i < this.order.length)) {
                _context2.next = 8;
                break;
              }

              key = this.order[i];
              _context2.next = 5;
              return [key, this.get(key)];

            case 5:
              i += 1;
              _context2.next = 1;
              break;

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, entries, this);
    })
    /**
     * @inheritDoc
     */

  }, {
    key: "keys",
    value: /*#__PURE__*/_regenerator["default"].mark(function keys() {
      var i;
      return _regenerator["default"].wrap(function keys$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              i = 0;

            case 1:
              if (!(i < this.order.length)) {
                _context3.next = 7;
                break;
              }

              _context3.next = 4;
              return this.order[i];

            case 4:
              i += 1;
              _context3.next = 1;
              break;

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, keys, this);
    })
    /**
     * @inheritDoc
     */

  }, {
    key: "values",
    value: /*#__PURE__*/_regenerator["default"].mark(function values() {
      var i;
      return _regenerator["default"].wrap(function values$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              i = 0;

            case 1:
              if (!(i < this.order.length)) {
                _context4.next = 7;
                break;
              }

              _context4.next = 4;
              return this.get(this.order[i]);

            case 4:
              i += 1;
              _context4.next = 1;
              break;

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, values, this);
    })
  }]);
  return Pipe;
}();

exports["default"] = Pipe;
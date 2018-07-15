"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _entries = _interopRequireDefault(require("@babel/runtime/core-js/object/entries"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _iterator = _interopRequireDefault(require("@babel/runtime/core-js/symbol/iterator"));

var _map = _interopRequireDefault(require("@babel/runtime/core-js/map"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _default =
/*#__PURE__*/
function () {
  /**
   * @type {Map<*, Function>}
   */

  /**
   * @type {*[]}
   */

  /**
   * @param {Function|Iterable|Object} wrapped
   * @return {Function}
   */
  function _default() {
    var wrapped = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, _default);
    (0, _defineProperty2.default)(this, "actions", new _map.default());
    (0, _defineProperty2.default)(this, "order", []);
    var entries;

    if (wrapped[_iterator.default]) {
      entries = (0, _toConsumableArray2.default)(wrapped.entries());
    } else if ((0, _typeof2.default)(wrapped) === 'object') {
      entries = (0, _entries.default)(wrapped);
    } else if (typeof wrapped === 'function') {
      entries = [['main', wrapped]];
    }

    for (var i = entries.length - 1; i >= 0; i -= 1) {
      var _entries$i = (0, _slicedToArray2.default)(entries[i], 2),
          name = _entries$i[0],
          func = _entries$i[1];

      this.add(name, func);
    }
  }
  /**
   * @param args
   */


  (0, _createClass2.default)(_default, [{
    key: "call",
    value: function call(args) {
      var _this = this;

      return this.order.reduce(function (value, action) {
        if (value instanceof _promise.default) {
          return value.then(function (resolvedValue) {
            return _this.actions.get(action)(resolvedValue);
          });
        }

        return _this.actions.get(action)(value);
      }, args);
    }
    /**
     * Register a function on the stack
     *
     * @param {string|*} name The name of the hook
     * @param {Function} func The function to call
     * @param {string|null} after Optional hook to place this one after. When
     * empty, the hook is put in front of the stack
     */

  }, {
    key: "add",
    value: function add(name, func) {
      var after = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      this.actions.set(name, func);
      var index = 0;

      if (after !== null) {
        if (!this.actions.has(after)) {
          throw new Error("After function [".concat(after, "] not registered"));
        }

        index = this.order.indexOf(after) + 1;
      }

      this.order.splice(index, 0, name);
    }
    /**
     * Remove a function from the stack
     * @param {string|*} name
     */

  }, {
    key: "remove",
    value: function remove(name) {
      if (!this.actions.has(name)) {
        throw new Error("Function [".concat(name, "] not registered"));
      }

      this.actions.delete(name);
      this.order.splice(this.order.indexOf(name), 1);
    }
  }]);
  return _default;
}();

exports.default = _default;
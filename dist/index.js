"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireDefault(require("@babel/runtime/core-js/map"));

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _entries = _interopRequireDefault(require("@babel/runtime/core-js/object/entries"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _iterator = _interopRequireDefault(require("@babel/runtime/core-js/symbol/iterator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var Pipe =
/*#__PURE__*/
function (_Map) {
  (0, _inherits2.default)(Pipe, _Map);

  /**
   * @type {*[]}
   */

  /**
   * @param {Function|Iterable|Object} wrapped
   * @return {Function}
   */
  function Pipe() {
    var _this;

    var wrapped = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Pipe);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Pipe).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "order", []);
    var entries;

    if (wrapped[_iterator.default]) {
      entries = (0, _toConsumableArray2.default)(wrapped.entries());
    } else if ((0, _typeof2.default)(wrapped) === 'object') {
      entries = (0, _entries.default)(wrapped);
    } else if (typeof wrapped === 'function') {
      entries = [['main', wrapped]];
    }

    entries.forEach(function (_ref) {
      var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      return _this.set(key, value);
    });
    return _this;
  }
  /**
   * @param args
   */


  (0, _createClass2.default)(Pipe, [{
    key: "call",
    value: function call(args) {
      var _this2 = this;

      return this.order.reduce(function (value, action) {
        if (value instanceof _promise.default) {
          return value.then(function (resolvedValue) {
            return _this2.get(action)(resolvedValue);
          });
        }

        return _this2.get(action)(value);
      }, args);
    }
    /**
     * Push a function on the stack
     *
     * @param {string|*} key The name of the hook
     * @param {Function} value The function to call
     * @return {Pipe}
     */

  }, {
    key: "set",
    value: function set(key, value) {
      this.order.push(key);
      return (0, _get2.default)((0, _getPrototypeOf2.default)(Pipe.prototype), "set", this).call(this, key, value);
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

  }, {
    key: "insert",
    value: function insert(key, value, neighbour) {
      var after = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      if (!this.has(neighbour)) {
        throw new Error("No such key [".concat(neighbour, "]"));
      }

      var offset = after ? 1 : 0;
      var index = this.order.indexOf(neighbour);
      this.order.splice(index + offset, 0, key);
      return (0, _get2.default)((0, _getPrototypeOf2.default)(Pipe.prototype), "set", this).call(this, key, value);
    }
    /**
     * Remove a function from the stack
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
      return (0, _get2.default)((0, _getPrototypeOf2.default)(Pipe.prototype), "delete", this).call(this, key);
    }
    /**
     * Clear the stack
     */

  }, {
    key: "clear",
    value: function clear() {
      this.order.length = 0;
      return (0, _get2.default)((0, _getPrototypeOf2.default)(Pipe.prototype), "clear", this).call(this);
    }
  }]);
  return Pipe;
}((0, _wrapNativeSuper2.default)(_map.default));

exports.default = Pipe;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJQaXBlIiwid3JhcHBlZCIsImVudHJpZXMiLCJmb3JFYWNoIiwia2V5IiwidmFsdWUiLCJzZXQiLCJhcmdzIiwib3JkZXIiLCJyZWR1Y2UiLCJhY3Rpb24iLCJ0aGVuIiwiZ2V0IiwicmVzb2x2ZWRWYWx1ZSIsInB1c2giLCJuZWlnaGJvdXIiLCJhZnRlciIsImhhcyIsIkVycm9yIiwib2Zmc2V0IiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiZmlsdGVyIiwiZW50cnkiLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQXFCQSxJOzs7OztBQUNuQjs7OztBQUtBOzs7O0FBSUEsa0JBQTJCO0FBQUE7O0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7QUFDekI7QUFEeUIsOEhBTm5CLEVBTW1CO0FBR3pCLFFBQUlDLE9BQUo7O0FBQ0EsUUFBSUQsMEJBQUosRUFBOEI7QUFDNUJDLGlEQUFjRCxRQUFRQyxPQUFSLEVBQWQ7QUFDRCxLQUZELE1BRU8sSUFBSSxzQkFBT0QsT0FBUCxNQUFtQixRQUF2QixFQUFpQztBQUN0Q0MsZ0JBQVUsc0JBQWVELE9BQWYsQ0FBVjtBQUNELEtBRk0sTUFFQSxJQUFJLE9BQU9BLE9BQVAsS0FBbUIsVUFBdkIsRUFBbUM7QUFDeENDLGdCQUFVLENBQUMsQ0FBQyxNQUFELEVBQVNELE9BQVQsQ0FBRCxDQUFWO0FBQ0Q7O0FBRURDLFlBQVFDLE9BQVIsQ0FBZ0I7QUFBQTtBQUFBLFVBQUVDLEdBQUY7QUFBQSxVQUFPQyxLQUFQOztBQUFBLGFBQWtCLE1BQUtDLEdBQUwsQ0FBU0YsR0FBVCxFQUFjQyxLQUFkLENBQWxCO0FBQUEsS0FBaEI7QUFaeUI7QUFhMUI7QUFFRDs7Ozs7Ozt5QkFHTUUsSSxFQUFNO0FBQUE7O0FBQ1YsYUFBTyxLQUFLQyxLQUFMLENBQVdDLE1BQVgsQ0FBa0IsVUFBQ0osS0FBRCxFQUFRSyxNQUFSLEVBQW1CO0FBQzFDLFlBQUlMLGlDQUFKLEVBQThCO0FBQzVCLGlCQUFPQSxNQUFNTSxJQUFOLENBQ0w7QUFBQSxtQkFBaUIsT0FBS0MsR0FBTCxDQUFTRixNQUFULEVBQWlCRyxhQUFqQixDQUFqQjtBQUFBLFdBREssQ0FBUDtBQUdEOztBQUVELGVBQU8sT0FBS0QsR0FBTCxDQUFTRixNQUFULEVBQWlCTCxLQUFqQixDQUFQO0FBQ0QsT0FSTSxFQVFKRSxJQVJJLENBQVA7QUFTRDtBQUVEOzs7Ozs7Ozs7O3dCQU9LSCxHLEVBQUtDLEssRUFBTztBQUNmLFdBQUtHLEtBQUwsQ0FBV00sSUFBWCxDQUFnQlYsR0FBaEI7QUFFQSx1R0FBaUJBLEdBQWpCLEVBQXNCQyxLQUF0QjtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7Ozs7MkJBVVFELEcsRUFBS0MsSyxFQUFPVSxTLEVBQXlCO0FBQUEsVUFBZEMsS0FBYyx1RUFBTixJQUFNOztBQUMzQyxVQUFJLENBQUMsS0FBS0MsR0FBTCxDQUFTRixTQUFULENBQUwsRUFBMEI7QUFDeEIsY0FBTSxJQUFJRyxLQUFKLHdCQUEwQkgsU0FBMUIsT0FBTjtBQUNEOztBQUVELFVBQU1JLFNBQVNILFFBQVEsQ0FBUixHQUFZLENBQTNCO0FBQ0EsVUFBTUksUUFBUSxLQUFLWixLQUFMLENBQVdhLE9BQVgsQ0FBbUJOLFNBQW5CLENBQWQ7QUFFQSxXQUFLUCxLQUFMLENBQVdjLE1BQVgsQ0FBa0JGLFFBQVFELE1BQTFCLEVBQWtDLENBQWxDLEVBQXFDZixHQUFyQztBQUNBLHVHQUFpQkEsR0FBakIsRUFBc0JDLEtBQXRCO0FBQ0Q7QUFFRDs7Ozs7Ozs7OzRCQU1RRCxHLEVBQUs7QUFDWCxXQUFLSSxLQUFMLENBQVdlLE1BQVgsQ0FBa0I7QUFBQSxlQUFTQyxVQUFVcEIsR0FBbkI7QUFBQSxPQUFsQjtBQUVBLDBHQUFvQkEsR0FBcEI7QUFDRDtBQUVEOzs7Ozs7NEJBR1M7QUFDUCxXQUFLSSxLQUFMLENBQVdpQixNQUFYLEdBQW9CLENBQXBCO0FBRUE7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFBpcGUgZXh0ZW5kcyBNYXAge1xuICAvKipcbiAgICogQHR5cGUgeypbXX1cbiAgICovXG4gIG9yZGVyID0gW11cblxuICAvKipcbiAgICogQHBhcmFtIHtGdW5jdGlvbnxJdGVyYWJsZXxPYmplY3R9IHdyYXBwZWRcbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqL1xuICBjb25zdHJ1Y3RvciAod3JhcHBlZCA9IHt9KSB7XG4gICAgc3VwZXIoKVxuXG4gICAgbGV0IGVudHJpZXNcbiAgICBpZiAod3JhcHBlZFtTeW1ib2wuaXRlcmF0b3JdKSB7XG4gICAgICBlbnRyaWVzID0gWy4uLndyYXBwZWQuZW50cmllcygpXVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHdyYXBwZWQgPT09ICdvYmplY3QnKSB7XG4gICAgICBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMod3JhcHBlZClcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB3cmFwcGVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBlbnRyaWVzID0gW1snbWFpbicsIHdyYXBwZWRdXVxuICAgIH1cblxuICAgIGVudHJpZXMuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB0aGlzLnNldChrZXksIHZhbHVlKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gYXJnc1xuICAgKi9cbiAgY2FsbCAoYXJncykge1xuICAgIHJldHVybiB0aGlzLm9yZGVyLnJlZHVjZSgodmFsdWUsIGFjdGlvbikgPT4ge1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUudGhlbihcbiAgICAgICAgICByZXNvbHZlZFZhbHVlID0+IHRoaXMuZ2V0KGFjdGlvbikocmVzb2x2ZWRWYWx1ZSksXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0KGFjdGlvbikodmFsdWUpXG4gICAgfSwgYXJncylcbiAgfVxuXG4gIC8qKlxuICAgKiBQdXNoIGEgZnVuY3Rpb24gb24gdGhlIHN0YWNrXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfCp9IGtleSBUaGUgbmFtZSBvZiB0aGUgaG9va1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB2YWx1ZSBUaGUgZnVuY3Rpb24gdG8gY2FsbFxuICAgKiBAcmV0dXJuIHtQaXBlfVxuICAgKi9cbiAgc2V0IChrZXksIHZhbHVlKSB7XG4gICAgdGhpcy5vcmRlci5wdXNoKGtleSlcblxuICAgIHJldHVybiBzdXBlci5zZXQoa2V5LCB2YWx1ZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgYSBmdW5jdGlvbiBpbiB0aGUgc3RhY2tcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8Kn0ga2V5IFRoZSBuYW1lIG9mIHRoZSBob29rXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHZhbHVlIFRoZSBmdW5jdGlvbiB0byBjYWxsXG4gICAqIEBwYXJhbSB7c3RyaW5nfCp9IG5laWdoYm91ciBUaGUgbmVpZ2hib3VyIHRvIGluc2VydCBiZWZvcmUgb3IgYWZ0ZXJcbiAgICogQHBhcmFtIHtib29sZWFufSBhZnRlciBUcnVlIHRvIGluc2VydCBhZnRlciB0aGUgbmVpZ2hib3VyLCBmYWxzZSB0b1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydCBiZWZvcmVcbiAgICogQHJldHVybiB7UGlwZX1cbiAgICovXG4gIGluc2VydCAoa2V5LCB2YWx1ZSwgbmVpZ2hib3VyLCBhZnRlciA9IHRydWUpIHtcbiAgICBpZiAoIXRoaXMuaGFzKG5laWdoYm91cikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gc3VjaCBrZXkgWyR7bmVpZ2hib3VyfV1gKVxuICAgIH1cblxuICAgIGNvbnN0IG9mZnNldCA9IGFmdGVyID8gMSA6IDBcbiAgICBjb25zdCBpbmRleCA9IHRoaXMub3JkZXIuaW5kZXhPZihuZWlnaGJvdXIpXG5cbiAgICB0aGlzLm9yZGVyLnNwbGljZShpbmRleCArIG9mZnNldCwgMCwga2V5KVxuICAgIHJldHVybiBzdXBlci5zZXQoa2V5LCB2YWx1ZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBmdW5jdGlvbiBmcm9tIHRoZSBzdGFja1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3wqfSBrZXlcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGRlbGV0ZSAoa2V5KSB7XG4gICAgdGhpcy5vcmRlci5maWx0ZXIoZW50cnkgPT4gZW50cnkgIT09IGtleSlcblxuICAgIHJldHVybiBzdXBlci5kZWxldGUoa2V5KVxuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIHRoZSBzdGFja1xuICAgKi9cbiAgY2xlYXIgKCkge1xuICAgIHRoaXMub3JkZXIubGVuZ3RoID0gMFxuXG4gICAgcmV0dXJuIHN1cGVyLmNsZWFyKClcbiAgfVxufVxuIl19
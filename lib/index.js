"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The objective of PromiseNotify is to listen for set of promises and 
 * notify the listener as soon as each promise is resolved. 
 * 
 * This is extremely useful when you have to make concurrent network calls 
 * and consume data as each one arrives.
 * 
 * const pNotify = new PromiseNotify([promises]);
 * pNotify.onEach({ result } => doSomething(result));
 */
var PromiseNotify = function () {
  function PromiseNotify(promises) {
    _classCallCheck(this, PromiseNotify);

    this.promises = promises;
  }

  /**
   * Notifier method which fires callback on each promise resolution.
   * 
   * @param {function} callback 
   */


  _createClass(PromiseNotify, [{
    key: "onEach",
    value: function onEach(callback) {
      // utility to call callback with error
      var errorCall = function errorCall(index, promise, error) {
        return callback({
          index: index,
          promise: promise,
          result: null,
          error: error
        });
      };

      this.promises.forEach(function (promise, index) {
        return promise.then(function (result) {
          callback({
            index: index,
            promise: promise,
            result: result
          });
        }, function (error) {
          return errorCall(index, promise, error);
        }).catch(function (error) {
          return errorCall(index, promise, error);
        });
      });
    }

    /**
     * Utility method to get notified once all promises are complete.
     * NOTE: Does not resolve with values from resolution.
     * 
     * @param {function} callback 
     */

  }, {
    key: "onAll",
    value: function onAll(callback) {
      var _this = this;

      var counter = 0;
      var resolveOnCondition = function resolveOnCondition() {
        if (++counter === _this.promises.length) {
          callback();
        }
      };
      this.promises.forEach(function (promise) {
        return promise.then(resolveOnCondition).catch(resolveOnCondition);
      });
    }
  }]);

  return PromiseNotify;
}();

module.exports = PromiseNotify;
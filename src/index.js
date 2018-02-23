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
class PromiseNotify {
  constructor(promises) {
    this.promises = promises;
  }

  /**
   * Notifier method which fires callback on each promise resolution.
   * 
   * @param {function} callback 
   */
  onEach(callback) {
    // utility to call callback with error
    const errorCall = (index, promise, error) => callback({
      index,
      promise,
      result:null,
      error
    });

    this.promises.forEach((promise, index) => 
      promise.then((result) => {
          callback({
            index,
            promise,
            result
          });
        }, error => errorCall(index, promise, error)
      )
      .catch(error => errorCall(index, promise, error))
    );
  }

  /**
   * Utility method to get notified once all promises are complete.
   * NOTE: Does not resolve with values from resolution.
   * 
   * @param {function} callback 
   */
  onAll(callback) {
    let counter = 0;
    const resolveOnCondition = () => {
      if (++counter === this.promises.length) {
        callback();
      }
    };
    this.promises.forEach(promise => promise.then(resolveOnCondition).catch(resolveOnCondition));
  }
}

module.exports = PromiseNotify;
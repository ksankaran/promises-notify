# promises-notify

Run each promise in parallel and notify listener on each promise completion. This is ideal for cases where you wanted to run several 
async tasks in parallel and consume the results as soon as each promises are complete.

```
const PromisesNotify = require('promises-notify');

const pNotify = new PromisesNotify();

pNotify.onEach({result, index, promise} => {
  // the argument object have three attributes
  // 1) result: the output from a async task
  // 2) index: the index of the promise in the input array
  // 3) promise: the original promise
});
```

const { expect } = require('chai');
const PromiseNotify = require('../index');

describe('Promise Notify Sanity Tests', () => {
  getPromise = (text, delay = 0, err) => 
    new Promise((resolve, reject) => 
      setTimeout(() => err ? reject(err) : resolve(text), delay));

  it('should resolve a single promise', (done) => {
    const pNotify = new PromiseNotify([getPromise('test')]);
    pNotify.onEach(({index, result}) => {
      expect(index).to.equal(0);
      expect(result).to.equal('test');
      done();
    });
  });

  it('should resolve two promises', (done) => {
    const pNotify = new PromiseNotify([
      getPromise('promise1'),
      getPromise('promise2', 100)
    ]);
    let counter = 0;
    pNotify.onEach(({index, result}) => {
      expect(counter++).to.equal(index);
      expect(result).to.equal(`promise${counter}`);
    });
    pNotify.onAll(() => done());
  });

  it('should resolve multiple promises', (done) => {
    const pNotify = new PromiseNotify([
      getPromise('promise1'),
      getPromise('promise2', 100),
      getPromise('promise3'),
      getPromise('promise4', 50),
      getPromise('promise5', 25)
    ]);
    let counter = 0;
    pNotify.onEach(({index, result}) => {
      expect(result).to.equal(`promise${index + 1}`);
      counter++;
    });
    pNotify.onAll(() => done(counter === 5 ? null : 'Promises didn\'t resolve as expected.'));
  });

  it('should handle rejects', (done) => {
    const pNotify = new PromiseNotify([
      getPromise('promise1', 0, 'MockError'),
      getPromise('promise2', 100)
    ]);
    let counter = 0;
    pNotify.onEach(({index, result, error}) => {
      if (index === 0) {
        console.log(error);
        expect(error).to.equal('MockError');
        counter++;
      } else {
        console.log(result);
        expect(result).to.equal('promise2');
        counter++
      }
    });
    pNotify.onAll(() => done(counter === 2 ? null : 'Promises didn\'t resolve as expected.'));
  });
});
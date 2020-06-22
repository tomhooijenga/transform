const should = require('should');
const {isPromise, isEntries, getValue} = require('../dist/util');
const {HookArgs} = require('../dist/hook-args');

describe('isPromise', () => {
  const fn = () => {};
  fn.then = () => {};

  const results = new Map([
    [null, false],
    [{}, false],
    [() => {}, false],
    ['string', false],

    [new Promise(() => {}), true],
    [{then() {}}, true],
    [fn, true],
  ]);

  for (const [obj, result] of results) {
    it(`${obj}`, () => {
      isPromise(obj).should.equal(result);
    });
  }
});

describe('isEntries', () => {
  const results = new Map([
    [null, false],
    [{}, false],
    [() => {}, false],
    ['string', false],
    [{entries: true}, false],

    [{entries() {}}, true],
  ]);

  for (const [obj, result] of results) {
    it(`${obj}`, () => {
      isEntries(obj).should.equal(result);
    });
  }
});

describe('getValue', () => {
  describe('wrapped', () => {
    const results = new Map([
      [null, [null]],
      [{}, [{}]],
      [['a', 'b'], [['a', 'b']]],

      [new HookArgs(1), [1]],
      [new HookArgs(1, 2, 3), [1, 2, 3]],
      [new HookArgs([1], 2), [[1], 2]],
    ]);

    for (const [obj, result] of results) {
      it(`${obj}`, () => {
        should(getValue(obj, true)).deepEqual(result);
      });
    }
  });

  describe('unwrapped', () => {
    const results = new Map([
      [null, null],
      [{}, {}],
      [['a', 'b'], ['a', 'b']],

      [new HookArgs(1), [1]],
      [new HookArgs(1, 2, 3), [1, 2, 3]],
      [new HookArgs([1], 2), [[1], 2]],
    ]);

    for (const [obj, result] of results) {
      it(`${obj}`, () => {
        should(getValue(obj, false)).deepEqual(result);
      });
    }
  })
});
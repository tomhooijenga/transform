const should = require('should');
const sinon = require('sinon');
require('should-sinon');
const {Pipe, HookArgs} = require('../dist');

it('constructor', () => {
  const p = new Pipe();
  p.should.be.instanceOf(Pipe);
});

it('constructor object', () => {
  sinon.spy(Pipe.prototype, 'set');

  const p = new Pipe({
    a: () => {},
    b: () => {},
  });

  p.set.should.be.calledTwice();
  p.order.should.deepEqual(['a', 'b']);

  Pipe.prototype.set.restore();
});

it('constructor func', () => {
  sinon.spy(Pipe.prototype, 'set');

  const p = new Pipe((() => {}));

  p.set.should.be.calledOnce();
  p.order.should.deepEqual(['main']);

  Pipe.prototype.set.restore();
});

it('set', () => {
  const p = new Pipe();
  const func = () => {};

  p.set('a', func);
  p.set('b', func);

  p.order.should.deepEqual(['a', 'b']);
  p.should.be.size(2);
});

it('set existing', () => {
  const p = new Pipe();
  const func = () => {};
  const func2 = () => {};

  p.set('a', func);
  p.set('b', func);
  p.set('a', func2);

  p.order.should.deepEqual(['a', 'b']);
  p.get('a').should.equal(func2);
  p.should.be.size(2);
});

it('insert', () => {
  const after = () => {};
  const before = () => {};
  const p = new Pipe(() => {});

  p.insert('main', 'after', after, );
  p.insert('after', after);
  p.insert('main', 'before', before, false);
  p.insert('before', before, undefined, false);
  p.order.should.deepEqual([before, 'before', 'main', 'after', after]);
});

it('before', () => {
  const func = () => {};
  const p = new Pipe(func);

  p.before('main', 'before', func);
  p.before('before', func);
  p.order.should.deepEqual([func, 'before', 'main']);
});

it('after', () => {
  const func = () => {};
  const p = new Pipe(func);

  p.after('main', 'after', func);
  p.after('after', func);
  p.order.should.deepEqual(['main', 'after', func]);
});

it('insert non-existent', () => {
  const func = () => {};
  const p = new Pipe(func);

  should(() => {
    p.insert('after', func, 'doesnotexist');
  }).throw({
    message: /^No such neighbour key/,
  });
});

it('transform', () => {
  const inc = sinon.spy((val) => {
    return val + 1
  });
  const p = new Pipe({
    a: inc,
    b: inc,
    c: inc,
  });

  p.transform(1).should.equal(4);
  inc.firstCall.should.be.calledWithExactly(1);
  inc.secondCall.should.be.calledWithExactly(2);
  inc.thirdCall.should.be.calledWithExactly(3);
  inc.should.be.called(3);
});

it('transform async', async () => {
  const inc = (val) => val + 1;
  const incAsync = sinon.spy((val) => Promise.resolve(val + 1));
  const p = new Pipe({
    a: incAsync,
    b: incAsync,
    c: inc,
  });

  await p.transform(1)
      .should.be.finally.equal(4)
    .and.should.be.Promise();
  incAsync.callCount.should.equal(2);
});

it('transform async custom promise', () => {
  const inc = (val) => val + 1;
  const incAsync = (val) => ({
    then(resolve) {
      return resolve(val + 1);
    },
  });

  const p = new Pipe({
    a: incAsync,
    b: incAsync,
    c: inc,
  });

  return p.transform(1)
    .should.finally.equal(4)
    .and.should.have.property('then');
});

it('transform HookArgs', () => {
  const inc = sinon.spy((val, second, third) => {
    return new HookArgs(val + 1, second, third);
  });
  const p = new Pipe({
    a: inc,
    b: inc,
    c: inc,
  });

  p.transform(1, 'second', 'third').should.deepEqual([4, 'second', 'third']);
  inc.firstCall.should.be.calledWith(1, 'second', 'third');
  inc.secondCall.should.be.calledWith(2, 'second', 'third');
  inc.thirdCall.should.be.calledWith(3, 'second', 'third');
  inc.callCount.should.equal(3);
})

it('transform async HookArgs', () => {
  const incAsync = sinon.spy((val, second, third) => {
    return Promise.resolve(new HookArgs(val + 1, second, third))
  });

  const p = new Pipe({
    a: incAsync,
    b: incAsync,
    c: incAsync,
  });

  const promise = p.transform(1, 'second', 'third');

  promise.should.finally.deepEqual([4, 'second', 'third']);
  incAsync.firstCall.should.be.calledWith(1, 'second', 'third');
  // incAsync.secondCall.should.be.calledWith(2, 'second', 'third');
  // incAsync.thirdCall.should.be.calledWith(3, 'second', 'third');
  // incAsync.callCount.should.equal(3);

  return promise;
})

it('should be ordered', () => {
  const func = () => {};
  const func2 = () => {};
  const keys = ['one', 'two', 'three'];
  const values = [func, func2, func];
  const entries = keys.map((key, i) => [key, values[i]]);
  const p = new Pipe({
    one: func,
    three: func,
  });
  p.insert('one', 'two', func2);

  [...p.keys()].should.deepEqual(keys);
  [...p.values()].should.deepEqual(values);
  [...p.entries()].should.deepEqual(entries);
  [...p].should.deepEqual(entries);
  [...p[Symbol.iterator]()].should.deepEqual(entries);
});

it('delete', () => {
  const p = new Pipe({
    a: () => {},
    c: () => {},
  });

  p.has('a').should.be.true();
  p.delete('a').should.be.true();
  p.has('a').should.be.false();
  p.order.should.not.containEql('a');
});

it('clear', () => {
  const p = new Pipe({
    a: () => {},
    c: () => {},
  });

  should(p.clear()).be.undefined();
  p.order.should.have.size(0);
  p.hooks.should.have.size(0);
});

it('forEach', () => {
  const callback = sinon.spy();
  const a = () => {};
  const b = () => {};
  const p = new Pipe({
    a,
    b,
  });

  p.forEach(callback);

  callback.should.be.calledTwice();
  callback.firstCall.should.be.calledWithExactly('a', a, p);
  callback.secondCall.should.be.calledWithExactly('b', b, p);
});

it('foreach thisArg', () => {
  const callback = sinon.spy();
  const a = () => {};
  const b = () => {};
  const thisArg = {};
  const p = new Pipe({
    a,
    b,
  });

  p.forEach(callback, thisArg);

  callback.should.be.calledTwice();
  callback.firstCall.should.be.calledWithExactly('a', a, p);
  callback.firstCall.thisValue.should.equal(thisArg);

  callback.secondCall.should.be.calledWithExactly('b', b, p);
  callback.secondCall.thisValue.should.equal(thisArg);
});

it('size', () => {
  const p = new Pipe();

  p.size.should.equal(0);
  p.set('a', () => {});
  p.size.should.equal(1);
  p.set('a', () => {});
  p.size.should.equal(1);
  p.set('b', () => {});
  p.size.should.equal(2);
  p.delete('a');
  p.size.should.equal(1);
  p.clear();
  p.size.should.equal(0);
});
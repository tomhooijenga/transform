const should = require('should');
const sinon = require('sinon');
require('should-sinon');
const Pipe = require('../dist').default;

it('constructor should return function', () => {
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

    p.set('a', func);
    p.set('b', func);
    p.set('a', func);

    p.order.should.deepEqual(['a', 'b', 'a']);
    p.should.be.size(2);
});

it('insert', () => {
  const func = () => {};
  const p = new Pipe(func);

  p.insert('after', func, 'main');
  p.insert('before', func, 'main', false);
  p.order.should.deepEqual(['before', 'main', 'after']);

});

it('insert non-existent', () => {
  const func = () => {};
  const p = new Pipe(func);

  should(() => {
    p.insert('after', func, 'doesnotexist');
  }).throw();
});

it('call', () => {
  const inc = sinon.spy(val => val + 1);
  const p = new Pipe({
    a: inc,
    b: inc,
    c: inc,
  });

  p.call(1).should.equal(4);
  inc.args[0][0].should.equal(1);
  inc.args[1][0].should.equal(2);
  inc.args[2][0].should.equal(3);
  inc.should.be.called(3);
});

it('call async', () => {
  const inc = sinon.spy(val => val + 1);
  const incAsync = sinon.spy(val => Promise.resolve(val + 1));
  const p = new Pipe({
    a: inc,
    b: incAsync,
    c: inc,
  });

  return p.call(1)
    .should.be.finally.equal(4)
    .and.should.be.Promise();
});

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
  p.insert('two', func2, 'one');

  [...p.keys()].should.deepEqual(keys);
  [...p.values()].should.deepEqual(values);
  [...p.entries()].should.deepEqual(entries);
  [...p].should.deepEqual(entries);
  [...p[Symbol.iterator]()].should.deepEqual(entries);
});

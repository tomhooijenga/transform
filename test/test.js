const should = require('should');
const sinon = require('sinon');
require('should-sinon');
const Pipe = require('../dist').default;

it('constructor should return function', () => {
  const p = new Pipe();
  p.should.be.instanceOf(Pipe);
});

it('constructor object', () => {
  sinon.spy(Pipe.prototype, 'add');

  const p = new Pipe({
    a: () => {},
    b: () => {},
  });

  p.add.should.be.calledTwice();
  p.order.should.deepEqual(['a', 'b']);

  Pipe.prototype.add.restore();
});

it('constructor func', () => {
  sinon.spy(Pipe.prototype, 'add');

  const p = new Pipe((() => {}));

  p.add.should.be.calledOnce();
  p.order.should.deepEqual(['main']);

  Pipe.prototype.add.restore();
});

it('add', () => {
  const p = new Pipe();
  const func = () => {};

  p.add('a', func);
  p.add('b', func);

  p.order.should.deepEqual(['b', 'a']);
  p.actions.should.be.size(2);
});

it('add after', () => {
  const func = () => {};
  const p = new Pipe(func);

  p.add('after', func, 'main');
  p.order.should.deepEqual(['main', 'after']);

  should(() => {
    p.add('after', func, 'doesnotexist');
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

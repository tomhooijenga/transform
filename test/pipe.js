const should = require('should');
const sinon = require('sinon');
const {Pipe, pipe, Arguments} = require('../dist');
require('should-sinon');

describe('Pipe', () => {
  tests((...args) => new Pipe(...args));
});
describe('pipe fn', () => {
  tests(pipe);

  it('constructor type', () => {
    const p = pipe();

    p.should
      .be.type('function')
      .and.instanceOf(Function)
      .and.instanceOf(Pipe);
  });

  it('call func', () => {
    const p = pipe((a) => a);

    p(1).should.eql(1);
  })

  it('call, apply, bind', () => {
    const p = pipe((...args) => args);

    p.call(null, 1, 2).should.eql([1, 2])
    p.apply(null, [1, 2]).should.eql([1, 2]);

    const bound = p.bind(null, 1);
    bound(2).should.eql([1, 2])
  });

  it('toString', () => {
    const p = pipe(() => 1);

    p.toString.should.eql(Function.prototype.toString);
    p.toString().should.eql('function () { [native code] }');
  });
});

/**
 * Run tests for a Pipe
 * @param {Function} factory - callback to generate pipes.
 */
function tests(factory) {
  it('constructor', () => {
    const p = factory();
    p.should.be.instanceOf(Pipe);
  });

  it('constructor object', () => {
    sinon.spy(Pipe.prototype, 'set');

    const p = factory({
      a: () => {
      },
      b: () => {
      },
    });

    p.set.callCount.should.eql(2);
    p.order.should.deepEqual(['a', 'b']);

    Pipe.prototype.set.restore();
  });

  it('constructor func', () => {
    sinon.spy(Pipe.prototype, 'set');

    const func = () => {
    };
    const p = factory(() => {
    });

    p.set.callCount.should.eql(1);
    p.order.should.deepEqual([func]);

    Pipe.prototype.set.restore();
  });

  it('set', () => {
    const p = factory();
    const func = () => {
    };

    p.set('a', func);
    p.set('b', func);

    p.order.should.deepEqual(['a', 'b']);
    p.size.should.eql(2);
  });

  it('set existing', () => {
    const p = factory();
    const func = () => {
    };
    const func2 = () => {
    };

    p.set('a', func);
    p.set('b', func);
    p.set('a', func2);

    p.order.should.deepEqual(['a', 'b']);
    p.get('a').should.equal(func2);
    p.size.should.eql(2);
  });

  it('insert', () => {
    const main = () => {
    };
    const after = () => {
    };
    const before = () => {
    };
    const p = factory(main);

    p.insert(main, 'after', after,);
    p.insert('after', after);
    p.insert(main, 'before', before, false);
    p.insert('before', before, undefined, false);
    p.order.should.deepEqual([before, 'before', main, 'after', after]);
  });

  it('before', () => {
    const main = () => {
    };
    const func = () => {
    };
    const p = factory(main);

    p.before(main, 'before', func);
    p.before('before', func);
    p.order.should.deepEqual([func, 'before', main]);
  });

  it('after', () => {
    const main = () => {
    };
    const func = () => {
    };
    const p = factory(main);

    p.after(main, 'after', func);
    p.after('after', func);
    p.order.should.deepEqual([main, 'after', func]);
  });

  it('insert non-existent', () => {
    const func = () => {
    };
    const p = factory(func);

    should(() => {
      p.insert('doesnotexists', 'after', func);
    }).throw({
      message: /^No such neighbour key/,
    });
  });

  it('transform', () => {
    const inc = sinon.spy((val) => {
      return val + 1
    });
    const p = factory({
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
    const incAsync = sinon.spy(function incAsync(val) {
      return Promise.resolve(val + 1)
    });
    const p = factory({
      a: incAsync,
      b: incAsync,
      c: inc,
    });

    await p.transform(1).should.finally.equal(4);
    incAsync.firstCall.should.be.calledWith(1);
    incAsync.firstCall.returnValue.should.finally.equal(2);

    incAsync.secondCall.should.be.calledWith(2);
    incAsync.secondCall.returnValue.should.finally.equal(3);

    incAsync.callCount.should.equal(2);
  });

  it('transform async custom promise', () => {
    const inc = (val) => val + 1;
    const incAsync = (val) => ({
      then(resolve) {
        return resolve(val + 1);
      },
    });

    const p = factory({
      a: incAsync,
      b: incAsync,
      c: inc,
    });

    return p.transform(1)
      .should.finally.equal(4)
      .and.should.have.property('then');
  });

  it('transform Arguments', () => {
    const inc = sinon.spy((val, second, third) => {
      return new Arguments(val + 1, second, third);
    });
    const p = factory({
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

  it('transform async Arguments', async () => {
    const incAsync = sinon.spy((val, second, third) => {
      return Promise.resolve(new Arguments(val + 1, second, third))
    });

    const p = factory({
      a: incAsync,
      b: incAsync,
    });

    await p.transform(1, 'second', 'third').should.finally.deepEqual([3, 'second', 'third']);
    incAsync.firstCall.should.be.calledWith(1, 'second', 'third');
    incAsync.secondCall.should.be.calledWith(2, 'second', 'third');
    incAsync.callCount.should.equal(2);
  })

  it('should be ordered', () => {
    const func = () => {
    };
    const func2 = () => {
    };
    const keys = ['one', 'two', 'three'];
    const values = [func, func2, func];
    const entries = keys.map((key, i) => [key, values[i]]);
    const p = factory({
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
    const p = factory({
      a: () => {
      },
      c: () => {
      },
    });

    p.has('a').should.be.true();
    p.delete('a').should.be.true();
    p.has('a').should.be.false();
    p.order.should.not.containEql('a');
  });

  it('clear', () => {
    const p = factory({
      a: () => {
      },
      c: () => {
      },
    });

    should(p.clear()).be.undefined();
    p.order.should.have.size(0);
    p.hooks.should.have.size(0);
  });

  it('forEach', () => {
    const callback = sinon.spy();
    const a = () => {
    };
    const b = () => {
    };
    const p = factory({
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
    const a = () => {
    };
    const b = () => {
    };
    const thisArg = {};
    const p = factory({
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
    const p = factory();

    p.size.should.equal(0);
    p.set('a', () => {
    });
    p.size.should.equal(1);
    p.set('a', () => {
    });
    p.size.should.equal(1);
    p.set('b', () => {
    });
    p.size.should.equal(2);
    p.delete('a');
    p.size.should.equal(1);
    p.clear();
    p.size.should.equal(0);
  });
}
'use strict';
class ReactOn {
  constructor() {
    this.subscriptions = [];
  }

  * foo(stream) {
    let secondResult = null;
    this._stream = stream.find((val)=> val.start );
    while (this._stream) {
      secondResult = yield this._stream.resolve(secondResult);
      this._stream = stream.find((val) => {
        if (secondResult.state == val.state) {
          return this._stream.childState.indexOf(secondResult.state) > -1
        } else {
          return false;
        }
      });
      if (this._stream)
        this.broadCast(this._stream.state);
    }
  }

  broadCast(result) {
    this.subscriptions.forEach(f => f(result));
  }

  subscribe(target) {
    this.subscriptions.push(target);
  }

  static create(options) {
    this.objInstance = new ReactOn();
    this.objInstance.generatorInstance = this.objInstance.foo(options.stream);
    this.objInstance.generatorInstance.next();
    return this.objInstance;
  }

  next(...arg) {
    return this.generatorInstance.next(...arg);
  }
}

// uses
{
  let machine = ReactOn.create({
    stream: [
      { state: 'state1', resolve: (state) => { console.log(state); }, childState: ['state1.1', 'state1.2'] , start: true},
      { state: 'state1.1', resolve: (state) => { console.log(state); }, childState: ['state1.1.1', 'state1.1.2'] },
      { state: 'state1.1.1', resolve: (state) => { console.log(state); }, childState: ['state1.1'] },
      { state: 'state1.2', resolve: (state) => { console.log(state); }, childState: [] },
      { state: 'state1.1.2', resolve: (state) => { console.log(state); }, childState: ['state1.2'] }
    ]
  });
  machine.subscribe((result) => {
    console.log('init sub', result);
  });

  console.log(machine.next({ state: 'state1.1' }));
  // mid of process subscription
  machine.subscribe((result) => {
    console.log('mid sub', result);
  });
  console.log(machine.next({ state: 'state1.1.2' }));
  machine.next({ state: 'state1.2' })
} 
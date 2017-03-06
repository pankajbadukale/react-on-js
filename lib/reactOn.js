'use strict';
class ReactOn {
  constructor() {
    this.subscriptions = {
      all: []
    };
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
    this.subscriptions[result] !== undefined && this.subscriptions[result].forEach(f => f(result, result));
    this.subscriptions.all.forEach(f => f(result, result.state));
  }

  subscribe(target) {
    this.subscriptions.all.push(target);
  }

  subscribeToState(states, target) {
    states.map((state) => {
      this.subscriptions[state] === undefined && (this.subscriptions[state] = []);
      this.subscriptions[state].push(target); 
    });
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

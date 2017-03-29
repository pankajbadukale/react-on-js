'use strict';
class ReactOn {
  constructor() {
    this.subscriptions = {
      all: []
    };
    this.stackStream=[];
  }

  * foo(stream) {
    let secondResult = null;
    this._original = Object.assign({},stream);
    this._stream = stream.find((val)=> val.start );
    while (this._stream) {
      secondResult = yield this._stream.resolve(secondResult, this.generatorInstance.dataBus);
      let nextState = stream.find((val) => {
        if (secondResult.state == val.state) {
          return (this._back || this._stream.childState == undefined || this._stream.childState.indexOf(secondResult.state) > -1 );
        } else {
          return false;
        }
      });
      if(nextState){      
        if(!this._back)  {
          this.stackStream.push(Object.assign({},this._stream));   //need to re-work
        }
        this._stream = nextState;     
        this.broadCast(this._stream.state);
      }      
      this._back = false;
    }
  }

  broadCast(result) {
    this.subscriptions[result] !== undefined && this.subscriptions[result].forEach(f => f(result, result));
    this.subscriptions.all.forEach(f => f(result, this.generatorInstance.dataBus));
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

  next(state, params) {
    this.generatorInstance.dataBus = params;
    return this.generatorInstance.next(state);
  }

  back(){
    let currentItem = this._stream;
    if(currentItem.back===undefined || currentItem.back){
      let curr = this.stackStream[this.stackStream.length -1];
      if(curr){
        let currentState = curr.state;
        this.stackStream.pop();
        this._stream = Object.assign({}, this.stackStream[this.stackStream.length -1]);
        this._back=true;
        this.generatorInstance.next({state:currentState});
      }
    }
    else{
       this.stackStream=[];
    }
  }

}

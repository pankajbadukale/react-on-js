'use strict';
class ReactOn {
 constructor() {
  this.subscriptions = [];
 }
 
 * foo() { 
   let firstResult = yield;
   this.broadCast(this.fnOne(firstResult));
    
   let secondResult = yield  2;
   this.broadCast(secondResult);
 }  
  
 fnOne(...params)  { 
   return params;
 }
  
 broadCast(result) {
    this.subscriptions.forEach (f => f(result));
 }
  
 subscribe(target) {
   this.subscriptions.push(target);
 }
  
 static create() {
   this.objInstance = new ReactOn();
   this.objInstance.generatorInstance = this.objInstance.foo();
   this.objInstance.generatorInstance.next();
   return this.objInstance;
 } 
  
 next(...arg) {
   this.generatorInstance.next(...arg);
 }
}


// uses
{
  let iter = ReactOn.create();
  // before next subscription
  iter.subscribe((result) => { 
    console.log('init sub', result); 
  });
  
  iter.next('hi'); 
  // mid of process subscription
  iter.subscribe((result) => { 
    console.log('mid sub', result); 
  });
  iter.next('bye', 'second bye'); 
} 
// uses

  let machine = ReactOn.create({
    stream: [
      { state: 'state1', resolve: (state) => { console.log(state); }, childState: ['state1.1'] , start: true},
      { state: 'state1.1', resolve: (state, data) => { console.log('=', data, state); }, childState: ['state1.1.1', 'state1.1.2'] },
      { state: 'state1.1.1', resolve: (state) => { console.log(state); }, childState: ['state1.1'] },
      { state: 'state1.2', resolve: (state) => { console.log(state); },  back: false},
      { state: 'state1.1.2', resolve: (state) => { console.log(state); }, childState: ['state1.2'] }
    ]
  });
  machine.subscribe((result, param) => {
    console.log('init sub global', result, param);
  });

  machine.subscribeToState(['state1.1.2'], (result, param) => {
    // console.log('curretn state is =>', state);
    // console.log('subscription for state 1.1.2 only');
    console.log('init sub ', result, param);
  });
  machine.subscribeToState(['state1.1.2', 'state1.1'], (result, param) => {
    // console.log('curretn state is more =>', state);
    // console.log('subscription for state 1.1.2 only more');
    console.log('init sub more', result, param);
  });

  /*console.log(machine.next({ state: 'state1.1' }));
  // mid of process subscription
  machine.subscribe((result) => {
    console.log('mid sub', result);
  });
  console.log(machine.next({ state: 'state1.1.2' }));
  machine.next({ state: 'state1.2' })*/

// Listen for fragment identifier value changes.
//machine.next({state: 'state1.1'});
machine.next({state: 'state1.1.2'}, {data: {a: 'pankaj'}});
machine.next({state: 'state1.1'}, {data: {b: 'badukale'}});
machine.next({state: 'state1.1.2'}, {data: {c: 'subhadip'}});
//machine.next({state: 'state1.2'});
machine.back();
machine.back();
machine.back();

//machine.next({state: 'state1.2'});
// window.addEventListener("hashchange", () => {
//   let state = location.hash;
//   state = state.replace('#/', '');
//   machine.next({state: state});
// });
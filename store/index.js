import { createStore, compose, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';

import reducers from '../reducers'; // Reducerは後ほど作ります


const store = createStore( // storeを作成
  reducers, // Reducerを適用
  // {},
  // compose(
  //   applyMiddleware(thunk),
  // )
);


export default store;
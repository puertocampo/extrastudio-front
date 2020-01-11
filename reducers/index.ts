import { combineReducers } from 'redux';

import UserReducer from './user'; // `review_reducer.js`は後ほど作ります


export default combineReducers({ // 本来はここで複数のReducerをひとまとめにする
  user: UserReducer, // `ReviewReducer`(review_reducer.js)を`review`とする
});
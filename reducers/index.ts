import { combineReducers } from 'redux';

import UserReducer from './user';
import EventReducer from './event';


export default combineReducers({
  user: UserReducer,
  events: EventReducer
});
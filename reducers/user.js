import {
  FETCH_USER,
  UPDATE_USER
} from '../actions/types';

const INITIAL_STATE = {
  user: {
    email: "",
    name: ""
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER:
      console.log('REDUCER FETCH_USER');
      console.log(action.payload);
      return { ...state, user: action.payload };

    case UPDATE_USER:
      console.log('REDUCER UPDATE_USER');
      return {
        ...state, user: action.payload
      };

    default:
      return state;
  }
};
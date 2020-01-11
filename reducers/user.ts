import {
  UPDATE_USER,
  INITIALIZE_USER
} from '../actions/types';

const INITIAL_STATE = {
  user: {
    userId: "",
    email: "",
    name: "",
    iconUrl: "",
    birthDate: new Date(),
    sex: "male",
    profession: "",
    address: "",
    interests: []
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state, user: action.payload
      };

    case INITIALIZE_USER:
      return {
        ...state, user: INITIAL_STATE.user
      }

    default:
      return state;
  }
};
import {
  UPDATE_USER
} from '../actions/types';

const INITIAL_STATE = {
  user: {
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

    default:
      return state;
  }
};
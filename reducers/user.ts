import {
  SET_USER,
  INITIALIZE_USER
} from '../actions/types/user';
import { IUser } from "../type/user";

const INITIAL_STATE: IUser = {
  userId: "",
  email: "",
  name: "",
  iconUrl: "",
  birthDate: new Date(),
  sex: "male",
  profession: "",
  address: "",
  interests: [],
  idToken: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state, ...action.payload
      };

    case INITIALIZE_USER:
      return {
        ...INITIAL_STATE
      }

    default:
      return state;
  }
};
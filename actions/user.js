import {
  FETCH_USER,
  UPDATE_USER
} from './types';

export const fetchUser = () => {
  return { type: FETCH_USER, payload: initUser };
};

export const updateUser = (user) => {
  return { type: UPDATE_USER, payload: user };
}

const initUser = {
  email: "",
  name: ""
}
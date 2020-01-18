import {
  LOGIN,
  LOGOUT,
  FETCH_USER,
  SET_USER,
  INITIALIZE_USER
} from './types/user';
import { IUser } from "../type/user";

export const login = () => {
  return { type: LOGIN };
}

export const logout = () => {
  return { type: LOGOUT };
}

export const fetchUser = () => {
  return { type: FETCH_USER }
}

export const setUser = (user: IUser) => {
  return { type: SET_USER, payload: user };
}

export const initializeUser = () => {
  return { type: INITIALIZE_USER };
}
import {
  LOGIN,
  LOGOUT,
  UPDATE_USER,
  INITIALIZE_USER
} from './types';
import { IUser } from "../type/user";

export const login = () => {
  return { type: LOGIN };
}

export const logout = () => {
  return { type: LOGOUT };
}

export const updateUser = (user: IUser) => {
  return { type: UPDATE_USER, payload: user };
}

export const initializeUser = () => {
  return { type: INITIALIZE_USER };
}
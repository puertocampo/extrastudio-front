import {
  UPDATE_USER,
  LOGIN
} from './types';
import { IUser } from "../type/user";

export const updateUser = (user: IUser) => {
  return { type: UPDATE_USER, payload: user };
}

export const login = () => {
  return { type: LOGIN };
}
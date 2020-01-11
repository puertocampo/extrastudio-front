import { put, call, takeLatest } from 'redux-saga/effects';
import Firebase from "../firebase";
import {
  LOGIN,
  LOGOUT
} from '../actions/types/user';
import { updateUser, initializeUser } from "../actions";

function* handleLogin() {
  const { user, err } = yield call(Firebase.handleLogIn);
  if (user) {
    yield put(updateUser(user));
  } else {
    console.log('err', err);
  }
}

function* handleLogout() {
  yield call(Firebase.handleLogOut);
  yield put(initializeUser());
}

const watchUserAsync = [
  takeLatest(LOGIN, handleLogin),
  takeLatest(LOGOUT, handleLogout)
];

export default watchUserAsync;
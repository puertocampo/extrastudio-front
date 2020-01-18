import { put, call, takeLatest } from 'redux-saga/effects';
import Api from "../api";
import Firebase from "../firebase";
import {
  LOGIN,
  LOGOUT,
  FETCH_USER
} from '../actions/types/user';
import { setUser, initializeUser } from "../actions";
import { getStorage, setStorage } from "./asyncStorage";

function* login() {
  const { firebaseUser, err } = yield call(Firebase.handleLogIn);
  if (!firebaseUser) {
    return;
  }
  const fetchUserResult = yield call(Api.fetchUser, { userId: firebaseUser.userId, idToken: firebaseUser.idToken })
  if (!fetchUserResult.user) {
    yield put(setUser(firebaseUser));
    return;
  }
  yield put(setUser(fetchUserResult.user));
}

function* logout() {
  yield call(Firebase.handleLogOut);
  yield put(initializeUser());
}

function* fetchUser() {
  const { userId, idToken } = yield call(getStorage, ['userId', 'idToken']);
  if (!userId || !idToken) {
    yield put(initializeUser());
    return;
  }
  const { user, err } = yield call(Api.fetchUser, { userId, idToken })
  if (user) {
    yield put(setUser(user));
  } else {
    console.log('err', err);
  }
}

const watchUserAsync = [
  takeLatest(LOGIN, login),
  takeLatest(LOGOUT, logout),
  takeLatest(FETCH_USER, fetchUser)
];

export default watchUserAsync;
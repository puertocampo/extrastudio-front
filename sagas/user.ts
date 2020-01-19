import { put, call, takeLatest } from 'redux-saga/effects';
import Api from "../api";
import Firebase from "../firebase";
import {
  LOGIN,
  LOGOUT,
  REGISTER_USER,
  FETCH_USER
} from '../actions/types/user';
import { setUser, initializeUser } from "../actions";
import { getStorage, setStorage, removeStorage } from "./asyncStorage";
import { getUser } from "../selectors";

function* login() {
  const { firebaseUser, err } = yield call(Firebase.handleLogIn);
  if (!firebaseUser || err) {
    return;
  }
  const fetchUserResult = yield call(Api.fetchUser, { userId: firebaseUser.userId, idToken: firebaseUser.idToken })
  if (!fetchUserResult.user) {
    yield put(setUser(firebaseUser));
    return;
  }
  yield put(setUser(fetchUserResult.user));
  yield call(setStorage, { userId: firebaseUser.userId, idToken: firebaseUser.idToken })
}

function* logout() {
  yield call(Firebase.handleLogOut);
  yield put(initializeUser());
  yield call(removeStorage, ['userId', 'idToken']);
}

function* registerUser(action) {
  const reqUser = action.payload;
  const { user, err } = yield call(Api.postUser, { user: reqUser, idToken: reqUser.idToken })
  if (!user) {
    return;
  }
  yield put(setUser(user));
  yield call(setStorage, { userId: user.userId, idToken: user.idToken })
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
  takeLatest(REGISTER_USER, registerUser),
  takeLatest(FETCH_USER, fetchUser)
];

export default watchUserAsync;
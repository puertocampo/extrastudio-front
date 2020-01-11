import { all, put, call, takeEvery } from 'redux-saga/effects';
import Firebase from "../firebase";
import {
  LOGIN
} from '../actions/types';
import { updateUser } from "../actions";

export function* handleLogin () {
  const{ user, err } = yield call(Firebase.handleLogIn);
  if (user) {
    yield put(updateUser(user));
  } else {
    console.log('err', err);
  }
}

export function* watchHandleLogin() {
  yield takeEvery(LOGIN, handleLogin)
}

export default function* rootSaga() {
    yield all([
      watchHandleLogin()
    ])
}

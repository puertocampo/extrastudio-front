import { all } from 'redux-saga/effects';

import watchUserAsync from "./user";

export default function* rootSaga() {
  yield all([
    ...watchUserAsync
  ])
}

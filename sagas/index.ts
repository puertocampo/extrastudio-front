import { all } from 'redux-saga/effects';

import watchUserAsync from "./user";
import watchEventAsync from "./event";

export default function* rootSaga() {
  yield all([
    ...watchUserAsync,
    ...watchEventAsync
  ])
}

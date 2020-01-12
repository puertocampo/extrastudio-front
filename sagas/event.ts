import { takeEvery, call, put, select } from 'redux-saga/effects';
import Api from "../api";
import {
  FETCH_EVENTS
} from '../actions/types/event';
import { updateEvents } from "../actions";
// import { getIdToken } from "../selectors";
import { getStorage } from "./asyncStorage";

function* fetchEvents() {
  // const idToken = yield select(getIdToken);
  const str = yield call(getStorage, ['userId', 'idToken']);
  const idToken = 'a';
  const { events, err } = yield call(Api.fetchEvents, idToken);
  // const events = yield call(Api.fetchEvents, idToken);
  console.log('events', events);
  if (events && events.length) {
    yield put(updateEvents(events));
  } else {
    // console.log('else', err);
    yield put(updateEvents([]));
  }
}

const watchEventAsync = [
  takeEvery(FETCH_EVENTS, fetchEvents)
];

export default watchEventAsync;
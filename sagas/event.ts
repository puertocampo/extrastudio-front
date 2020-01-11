import { takeEvery, call, put, select } from 'redux-saga/effects';
import Api from "../api";
import {
  FETCH_EVENTS
} from '../actions/types/event';
import { updateEvents } from "../actions";
import { getIdToken } from "../selectors";

function* fetchEvents() {
  const idToken = yield select(getIdToken);
  const { events, err } = yield call(Api.fetchEvents, idToken);
  if (events && events.length) {
    yield put(updateEvents(events));
  } else {
    console.log('err', err);
  }
}

const watchEventAsync = [
  takeEvery(FETCH_EVENTS, fetchEvents)
];

export default watchEventAsync;
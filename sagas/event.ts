import { takeLatest, call, put, select } from 'redux-saga/effects';
import Api from "../api";
import {
  FETCH_EVENTS
} from '../actions/types/event';
import { updateEvents } from "../actions";
import { getStorage } from "./asyncStorage";

function* fetchEvents() {
  const { idToken } = yield call(getStorage, ['idToken']);
  const { events, err } = yield call(Api.fetchEvents, idToken);
  if (events && events.length) {
    yield put(updateEvents(events));
  } else {
    yield put(updateEvents([]));
  }
}

const watchEventAsync = [
  takeLatest(FETCH_EVENTS, fetchEvents)
];

export default watchEventAsync;
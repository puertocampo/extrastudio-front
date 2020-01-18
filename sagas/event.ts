import { takeLatest, call, put } from 'redux-saga/effects';
import Api from "../api";
import Firebase from "../firebase";
import {
  FETCH_EVENTS, EVALUATE_EVENT
} from '../actions/types/event';
import { updateEvents } from "../actions";
import { getStorage } from "./asyncStorage";

function* fetchEvents(action) {
  const userId = action.payload.userId;
  const { idToken } = yield call(getStorage, ['idToken']);
  const { events, err } = yield call(Api.fetchEvents, { userId, idToken });
  if (events && events.length) {
    yield put(updateEvents(events));
  } else {
    yield put(updateEvents([]));
  }
}

function* evaluateEvent(action) {
  const { idToken } = yield call(getStorage, ['idToken']);
  yield call(Api.evaluateEvent, { ...action.payload, idToken });
  if (action.payload.evaluate === "LIKE") {
    yield call(Firebase.createCalendarEvent, { ...action.payload, idToken });
  }
}

const watchEventAsync = [
  takeLatest(FETCH_EVENTS, fetchEvents),
  takeLatest(EVALUATE_EVENT, evaluateEvent)
];

export default watchEventAsync;
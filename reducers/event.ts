import {
  UPDATE_EVENTS
} from '../actions/types/event';
import { IEvent } from "../type/event";
import { actionChannel } from 'redux-saga/effects';

const INITIAL_STATE: IEvent[] = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_EVENTS:
      return action.payload;

    default:
      return state;
  }
};
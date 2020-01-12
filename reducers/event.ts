import {
  UPDATE_EVENTS
} from '../actions/types/event';
import { IEvent } from "../type/event";

const INITIAL_STATE: IEvent[] = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_EVENTS:
      return {
        ...state, ...action.payload
      };

    default:
      return state;
  }
};
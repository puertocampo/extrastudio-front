import {
  FETCH_EVENTS,
  UPDATE_EVENTS
} from './types/event';
import { IEvent } from "../type/event";

export const fetchEvents = () => {
  return { type: FETCH_EVENTS };
}

export const updateEvents = (events: IEvent[]) => {
  return { type: UPDATE_EVENTS, payload: events };
}
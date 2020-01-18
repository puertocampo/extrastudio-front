import {
  FETCH_EVENTS,
  UPDATE_EVENTS,
  EVALUATE_EVENT
} from './types/event';
import { IEvent, IReqEvalEvent } from "../type/event";

export const fetchEvents = (userId: string) => {
  return { type: FETCH_EVENTS, payload: { userId } };
}

export const updateEvents = (events: IEvent[]) => {
  return { type: UPDATE_EVENTS, payload: events };
}

export const evaluateEvent = (req: IReqEvalEvent) => {
  return { type: EVALUATE_EVENT, payload: req };
}
interface IOwner {
  ownerId: string;
  name: string;
}

export interface IEvent {
  eventId: string;
  title: string;
  summary: string;
  eventUrl: string;
  startedAt: Date;
  endedAt: Date;
  limit: number;
  address: string;
  place: string;
  lat: number;
  lon: number;
  owners: IOwner[];
  updatedAt: Date;
  imagePath: string;
}

export interface IReqEvalEvent {
  event: IEvent;
  userId: string;
  email: string;
  evaluate: string;
}
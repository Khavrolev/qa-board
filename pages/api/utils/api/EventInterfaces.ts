export interface EventInterface {
  name: string;
  start: string;
  end: string;
}

export interface UpdateEventInterface {
  id: string;
  fields: EventInterface;
}

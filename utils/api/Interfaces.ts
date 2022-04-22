export interface CreateEventDB {
  name: string;
  start: Date;
  end: Date;
}

export interface CreateQuestionDB {
  text: string;
  event_id: string;
}

export interface ErrorData {
  message: string;
}

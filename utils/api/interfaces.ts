export interface ResponseData extends ErrorData {
  code: number;
}

export interface CreateEventDB {
  name: string;
  start: Date;
  end: Date;
}

export interface CreateQuestionDB {
  text: string;
  event_id: string;
  anonymousName: string | undefined;
}

export interface CreateUser {
  email: string;
  password: string;
}

export interface ErrorData {
  message: string;
}

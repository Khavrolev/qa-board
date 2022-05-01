import { EventDB, QuestionDB } from "@prisma/client";

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

export interface EventWithQuestionCounter extends EventDB {
  _count: {
    questions: number;
  };
}

export interface EventWithQuestions extends EventWithQuestionCounter {
  questions: QuestionDB[];
}

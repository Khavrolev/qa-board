import { EventDB, QuestionDB } from "@prisma/client";
import { UpdateLikeType } from "../enums/question";

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

export interface UpdateQuestionDB {
  id: string;
  type: UpdateLikeType;
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

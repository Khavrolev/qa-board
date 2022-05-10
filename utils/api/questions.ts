import { QuestionDB } from "@prisma/client";
import axios from "axios";
import { CreateQuestionDB, UpdateQuestionDB } from "./interfaces";

const questionsRoute = `api/db/questions`;

export const fetchCreateQuestion = async (question: CreateQuestionDB) => {
  const { text, event_id, anonymousName } = question;
  const res = await axios.post<QuestionDB>(`${questionsRoute}/createQuestion`, {
    text,
    event_id,
    anonymousName,
  });

  return res.data;
};

export const fetchUpdateQuestion = async (question: UpdateQuestionDB) => {
  const { id, type } = question;
  const res = await axios.put<QuestionDB>(
    `${questionsRoute}/updateLikesQuestion`,
    {
      id,
      type,
    },
  );

  return res.data;
};

export const fetchDeleteQuestion = async (id: string) => {
  const res = await axios.delete<QuestionDB>(
    `${questionsRoute}/deleteQuestion?id=${id}`,
  );

  return res.data;
};

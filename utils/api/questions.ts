import { QuestionDB } from "@prisma/client";
import axios from "axios";
import { CreateQuestionDB } from "./interfaces";

const questionsRoute = `api/db/questions`;

export const fetchCreateQuestion = async (question: CreateQuestionDB) => {
  const { text, event_id, anonymousName } = question;
  const res = await axios.post(`${questionsRoute}/createQuestion`, {
    text,
    event_id,
    anonymousName,
  });

  return res.data;
};

export const fetchUpdateQuestion = async (question: QuestionDB) => {
  const { id, likes } = question;
  const res = await axios.put(`${questionsRoute}/updateLikesQuestion`, {
    id,
    likes,
  });

  return res.data;
};

export const fetchDeleteQuestion = async (id: string) => {
  const res = await axios.delete(`${questionsRoute}/deleteQuestion?id=${id}`);

  return res.data;
};

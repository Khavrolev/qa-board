import { QuestionDB } from "@prisma/client";
import axios from "axios";
import { CreateQuestionDB } from "./Interfaces";

export const fetchCreateQuestion = async (question: CreateQuestionDB) => {
  const { text, event_id } = question;
  const res = await axios.post("api/db/Questions/createQuestion", {
    text,
    event_id,
  });

  return res.data;
};

export const fetchUpdateQuestion = async (question: QuestionDB) => {
  const { id, likes } = question;
  const res = await axios.put("api/db/Questions/updateLikesQuestion", {
    id,
    likes,
  });
  return res.data;
};

export const fetchDeleteQuestion = async (id: string) => {
  const res = await axios.delete(`api/db/Questions/deleteQuestion?id=${id}`);

  return res.data;
};

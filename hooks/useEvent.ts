import { EventDB, QuestionDB } from "@prisma/client";
import axios from "axios";
import { useCallback, useState } from "react";
import { fetchUpdateEvent } from "../utils/api/Eventss";
import { CreateQuestionDB } from "../utils/api/Interfacess";
import {
  fetchCreateQuestion,
  fetchDeleteQuestion,
  fetchUpdateQuestion,
} from "../utils/api/Questionss";
import { useError } from "./useError";

export const useEvent = (
  initialEvent: EventDB & {
    questions: QuestionDB[];
  },
) => {
  const [event, setEvent] = useState(initialEvent);
  const { errorFetching, setErrorFetching, handleResetError } = useError();

  const handleUpdateEvent = useCallback(
    async (event: EventDB, includeQuestions: boolean) => {
      try {
        const updatedEvent = await fetchUpdateEvent(event, includeQuestions);
        if (errorFetching) {
          setErrorFetching(null);
        }

        setEvent(updatedEvent);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorFetching(error.response?.data.message);
        }
        console.error(error);
      }
    },
    [errorFetching, setErrorFetching],
  );

  const handleCreateQuestion = useCallback(
    async (question: CreateQuestionDB) => {
      try {
        const newQuestion = await fetchCreateQuestion(question);
        if (errorFetching) {
          setErrorFetching(null);
        }

        setEvent((prevEvent) => {
          return {
            ...prevEvent,
            questions: [...prevEvent.questions, newQuestion],
          };
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorFetching(error.response?.data.message);
        }
        console.error(error);
      }
    },
    [errorFetching, setErrorFetching],
  );

  const handleUpdateQuestion = useCallback(
    async (question: QuestionDB) => {
      try {
        const updatedQuestion = await fetchUpdateQuestion(question);
        if (errorFetching) {
          setErrorFetching(null);
        }

        setEvent((prevEvent) => {
          return {
            ...prevEvent,
            questions: prevEvent.questions
              .map((question) =>
                question.id === updatedQuestion.id ? updatedQuestion : question,
              )
              .sort((prev, cur) =>
                prev.likes > cur.likes ? -1 : prev.likes < cur.likes ? 1 : 0,
              ),
          };
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorFetching(error.response?.data.message);
        }
        console.error(error);
      }
    },
    [errorFetching, setErrorFetching],
  );

  const handleDeleteEvent = useCallback(
    async (id: string) => {
      try {
        const deletedQuestion = await fetchDeleteQuestion(id);
        if (errorFetching) {
          setErrorFetching(null);
        }

        setEvent((prevEvent) => {
          return {
            ...prevEvent,
            questions: prevEvent.questions.filter(
              (question) => question.id !== deletedQuestion.id,
            ),
          };
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorFetching(error.response?.data.message);
        }
        console.error(error);
      }
    },
    [errorFetching, setErrorFetching],
  );

  return {
    event,
    handleUpdateEvent,
    handleCreateQuestion,
    handleUpdateQuestion,
    handleDeleteEvent,
    errorFetching,
    handleResetError,
  };
};

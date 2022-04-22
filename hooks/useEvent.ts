import { EventDB, QuestionDB } from "@prisma/client";
import { useCallback, useState } from "react";
import { fetchUpdateEvent } from "../utils/api/Event";
import { CreateQuestionDB } from "../utils/api/Interfaces";
import {
  fetchCreateQuestion,
  fetchDeleteQuestion,
  fetchUpdateQuestion,
} from "../utils/api/Questions";

export const useEvent = (
  initialEvent: EventDB & {
    questions: QuestionDB[];
  },
) => {
  const [event, setEvent] = useState(initialEvent);

  const handleUpdateEvent = useCallback(
    async (event: EventDB, includeQuestions: boolean) => {
      try {
        const updatedEvent = await fetchUpdateEvent(event, includeQuestions);
        setEvent(updatedEvent);
      } catch (error) {
        console.error(error);
      }
    },
    [],
  );

  const handleCreateQuestion = async (question: CreateQuestionDB) => {
    try {
      const newQuestion = await fetchCreateQuestion(question);
      setEvent((prevEvent) => {
        return {
          ...prevEvent,
          questions: [...prevEvent.questions, newQuestion],
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateQuestion = useCallback(async (question: QuestionDB) => {
    try {
      const updatedQuestion = await fetchUpdateQuestion(question);
      setEvent((prevEvent) => {
        return {
          ...prevEvent,
          questions: prevEvent.questions.map((question) =>
            question.id === updatedQuestion.id ? updatedQuestion : question,
          ),
        };
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleDeleteEvent = useCallback(async (id: string) => {
    try {
      const deletedQuestion = await fetchDeleteQuestion(id);
      setEvent((prevEvent) => {
        return {
          ...prevEvent,
          questions: prevEvent.questions.filter(
            (question) => question.id !== deletedQuestion.id,
          ),
        };
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    event,
    handleUpdateEvent,
    handleCreateQuestion,
    handleUpdateQuestion,
    handleDeleteEvent,
  };
};

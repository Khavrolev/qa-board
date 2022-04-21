import { EventDB, QuestionDB } from "@prisma/client";
import { useCallback, useState } from "react";
import { fetchUpdateEvent } from "../utils/api/Event";

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

  return { event, handleUpdateEvent };
};

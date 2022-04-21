import { EventDB, QuestionDB } from "@prisma/client";
import { useCallback, useState } from "react";
import {
  fetchCreateEvent,
  fetchDeleteEvent,
  fetchUpdateEvent,
} from "../utils/api/Event";
import { CreateEventDB } from "../utils/api/Interfaces";
import { isString } from "../utils/guards/Type";

export const useEvents = (
  initialEvents: (EventDB & {
    _count: {
      questions: number;
    };
  })[],
) => {
  const [events, setEvents] = useState(initialEvents);

  const sortEvents = (prev: EventDB, cur: EventDB) => {
    if (isString(prev.start) && isString(cur.start)) {
      return new Date(prev.start) >= new Date(cur.start) ? 1 : -1;
    }
    return 0;
  };

  const handleCreateEvent = async (event: CreateEventDB) => {
    try {
      const newEvent = await fetchCreateEvent(event);
      setEvents((prevEvents) => [...prevEvents, newEvent].sort(sortEvents));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateEvent = useCallback(
    async (event: EventDB, includeQuestions: boolean) => {
      try {
        const updatedEvent = await fetchUpdateEvent(event, includeQuestions);
        setEvents((prevEvents) =>
          prevEvents
            .map((event) =>
              event.id === updatedEvent.id ? updatedEvent : event,
            )
            .sort(sortEvents),
        );
      } catch (error) {
        console.error(error);
      }
    },
    [],
  );

  const handleDeleteEvent = useCallback(async (id: string) => {
    try {
      const deletedEvent = await fetchDeleteEvent(id);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== deletedEvent.id),
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  return { events, handleCreateEvent, handleUpdateEvent, handleDeleteEvent };
};

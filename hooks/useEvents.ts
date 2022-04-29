import { EventDB } from "@prisma/client";
import axios from "axios";
import { useCallback, useState } from "react";
import {
  fetchCreateEvent,
  fetchDeleteEvent,
  fetchUpdateEvent,
} from "../utils/api/Events";
import { CreateEventDB } from "../utils/api/Interfaces";
import { isString } from "../utils/guards/Type";
import { useError } from "./useError";

export const useEvents = (
  initialEvents: (EventDB & {
    _count: {
      questions: number;
    };
  })[],
) => {
  const [events, setEvents] = useState(initialEvents);
  const { errorFetching, setErrorFetching, handleResetError } = useError();

  const sortEvents = (prev: EventDB, cur: EventDB) => {
    if (isString(prev.start) && isString(cur.start)) {
      return new Date(prev.start) >= new Date(cur.start) ? 1 : -1;
    }
    return 0;
  };

  const handleCreateEvent = async (event: CreateEventDB) => {
    try {
      const newEvent = await fetchCreateEvent(event);
      if (errorFetching) {
        setErrorFetching(null);
      }

      setEvents((prevEvents) => [...prevEvents, newEvent].sort(sortEvents));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorFetching(error.response?.data.message);
      }
      console.error(error);
    }
  };

  const handleUpdateEvent = useCallback(
    async (event: EventDB, includeQuestions: boolean) => {
      try {
        const updatedEvent = await fetchUpdateEvent(event, includeQuestions);
        if (errorFetching) {
          setErrorFetching(null);
        }

        setEvents((prevEvents) =>
          prevEvents
            .map((event) =>
              event.id === updatedEvent.id ? updatedEvent : event,
            )
            .sort(sortEvents),
        );
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
        const deletedEvent = await fetchDeleteEvent(id);
        if (errorFetching) {
          setErrorFetching(null);
        }

        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== deletedEvent.id),
        );
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
    events,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    errorFetching,
    handleResetError,
  };
};

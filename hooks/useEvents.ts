import { EventDB } from "@prisma/client";
import axios from "axios";
import { useCallback, useState } from "react";
import {
  fetchCreateEvent,
  fetchDeleteEvent,
  fetchUpdateEvent,
} from "../utils/api/events";
import { CreateEventDB } from "../utils/api/interfaces";
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
    return new Date(prev.end) >= new Date(cur.end) ? 1 : -1;
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

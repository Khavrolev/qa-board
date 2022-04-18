import { FieldSet } from "airtable";
import { useCallback, useState } from "react";
import { EventData } from "../utils/airtable/Interfaces";
import {
  fetchCreateEvent,
  fetchDeleteEvent,
  fetchUpdateEvent,
} from "../utils/api/Event";

export const useEvents = (initialEvents: EventData[]) => {
  const [events, setEvents] = useState(initialEvents);

  const handleCreateEvent = async (event: FieldSet) => {
    try {
      const newEvent = await fetchCreateEvent(event);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateEvent = useCallback(async (event: EventData) => {
    try {
      const updatedEvent = await fetchUpdateEvent(event);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

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

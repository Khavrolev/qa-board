import { useCallback, useState } from "react";
import { EventsData } from "../pages/api/utils/airtable/Interfaces";
import {
  fetchCreateEvent,
  fetchUpdateEvent,
} from "../pages/api/utils/api/Event";
import {
  EventInterface,
  UpdateEventInterface,
} from "../pages/api/utils/api/EventInterfaces";

export const useEvents = (initialEvents: EventsData[]) => {
  const [events, setEvents] = useState(initialEvents);

  const handleCreateEvent = async (event: EventInterface) => {
    try {
      const newEvent = await fetchCreateEvent(event);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateEvent = useCallback(async (event: UpdateEventInterface) => {
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

  const handleDeleteEvent = useCallback(async (event: UpdateEventInterface) => {
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

  return { events, handleCreateEvent, handleUpdateEvent, handleDeleteEvent };
};

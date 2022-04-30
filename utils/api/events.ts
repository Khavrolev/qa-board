import { EventDB } from "@prisma/client";
import axios from "axios";
import { CreateEventDB } from "./interfaces";

const eventsRoute = `api/db/events`;

export const fetchCreateEvent = async (event: CreateEventDB) => {
  const { name, start, end } = event;
  const res = await axios.post(`${eventsRoute}/createEvent`, {
    name,
    start,
    end,
  });

  return res.data;
};

export const fetchUpdateEvent = async (
  event: EventDB,
  includeQuestions: boolean,
) => {
  const { id, name, start, end } = event;
  const res = await axios.put(`${eventsRoute}/updateEvent`, {
    id,
    name,
    start,
    end,
    includeQuestions,
  });

  return res.data;
};

export const fetchDeleteEvent = async (id: string) => {
  const res = await axios.delete(`${eventsRoute}/deleteEvent?id=${id}`);

  return res.data;
};

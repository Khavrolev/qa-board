import { EventDB } from "@prisma/client";
import axios from "axios";
import { CreateEventDB } from "./Interfaces";

export const fetchCreateEvent = async (event: CreateEventDB) => {
  const { name, start, end } = event;
  const res = await axios.post("api/db/Events/createEvent", {
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
  const res = await axios.put("api/db/Events/updateEvent", {
    id,
    name,
    start,
    end,
    includeQuestions,
  });

  return res.data;
};

export const fetchDeleteEvent = async (id: string) => {
  id = "sdf";
  const res = await axios.delete(`api/db/Events/deleteEvent?id=${id}`);

  return res.data;
};

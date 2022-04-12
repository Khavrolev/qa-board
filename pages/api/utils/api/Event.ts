import axios from "axios";
import { EventInterface, UpdateEventInterface } from "./EventInterfaces";

export const fetchCreateEvent = async (event: EventInterface) => {
  const { name, start, end } = event;
  const res = await axios.post("api/airtable/createEvent", {
    name,
    start,
    end,
  });

  return res.data;
};

export const fetchUpdateEvent = async (event: UpdateEventInterface) => {
  const { id, fields } = event;
  const res = await axios.put("api/airtable/updateEvent", {
    id,
    fields,
  });

  return res.data;
};

export const fetchDeleteEvent = async (id: string) => {
  const res = await axios.delete(`api/airtable/deleteEvent?id=${id}`);

  return res.data;
};

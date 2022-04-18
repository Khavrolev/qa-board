import { FieldSet } from "airtable";
import axios from "axios";
import { EventData } from "../airtable/Interfaces";

export const fetchCreateEvent = async (event: FieldSet) => {
  const { name, start, end } = event;
  const res = await axios.post("api/airtable/Events/createEvent", {
    name,
    start,
    end,
  });

  return res.data;
};

export const fetchUpdateEvent = async (event: EventData) => {
  const { id, fields } = event;
  const res = await axios.put("api/airtable/Events/updateEvent", {
    id,
    fields,
  });

  return res.data;
};

export const fetchDeleteEvent = async (id: string) => {
  const res = await axios.delete(`api/airtable/Events/deleteEvent?id=${id}`);

  return res.data;
};

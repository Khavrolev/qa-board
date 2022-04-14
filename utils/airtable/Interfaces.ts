import { FieldSet } from "airtable";

export interface EventsData {
  id: string;
  fields: FieldSet;
}

export interface ErrorData {
  message: string;
}

import { FieldSet } from "airtable";

export interface EventData {
  id: string;
  fields: FieldSet;
}

export interface ErrorData {
  message: string;
}

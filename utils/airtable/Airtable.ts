import Airtable, { FieldSet, Record, Records } from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  `${process.env.AIRTABLE_BASE_ID}`,
);
export const tableEvents = base(`${process.env.AIRTABLE_EVENTS_TABLE_NAME}`);
export const tableQuestions = base(
  `${process.env.AIRTABLE_QUESTIONS_TABLE_NAME}`,
);
export const tableLikes = base(`${process.env.AIRTABLE_LIKES_TABLE_NAME}`);

export const getMinifiedRecord = (record: Record<FieldSet>) => {
  return {
    id: record.id,
    fields: record.fields,
  };
};

export const getMinifiedRecords = (records: Records<FieldSet>) => {
  return records.map((record) => getMinifiedRecord(record));
};

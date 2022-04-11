import Airtable, { FieldSet, Record, Records } from "airtable";
import type { NextApiRequest, NextApiResponse } from "next";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  `${process.env.AIRTABLE_BASE_ID}`,
);
const table = base(`${process.env.AIRTABLE_EVENTS_TABLE_NAME}`);

interface EventsData {
  id: string;
  fields: FieldSet;
}

const getMinifiedEventsRecord = (record: Record<FieldSet>) => {
  return {
    id: record.id,
    fields: record.fields,
  };
};

const getMinifiedEventsRecords = (records: Records<FieldSet>) => {
  return records.map((record) => getMinifiedEventsRecord(record));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventsData[]>,
) {
  const records = await table.select().firstPage();
  const minifiedRecords = getMinifiedEventsRecords(records);
  res.status(200).json(minifiedRecords);
}

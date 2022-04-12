import type { NextApiRequest, NextApiResponse } from "next";
import { getMinifiedRecord, tableEvents } from "../utils/airtable/Airtable";
import { ErrorData, EventsData } from "../utils/airtable/Interfaces";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<EventsData | ErrorData>,
) => {
  const { name, start, end } = req.body;

  try {
    const createdRecords = await tableEvents.create([
      { fields: { name, start, end } },
    ]);
    const createdRecord = getMinifiedRecord(createdRecords[0]);
    res.status(200).json(createdRecord);
  } catch (error) {
    res.status(500).json({ message: "Ooops! Something went wrong" });
  }
};

export default handler;

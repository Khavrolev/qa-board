import type { NextApiRequest, NextApiResponse } from "next";
import { getMinifiedRecords, tableEvents } from "../utils/airtable/Airtable";
import { ErrorData, EventsData } from "../utils/airtable/Interfaces";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<EventsData[] | ErrorData>,
) => {
  try {
    const records = await tableEvents.select().firstPage();
    const minifiedRecords = getMinifiedRecords(records);
    res.status(200).json(minifiedRecords);
  } catch (error) {
    res.status(500).json({ message: "Ooops! Something went wrong" });
  }
};

export default handler;

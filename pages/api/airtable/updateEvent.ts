import type { NextApiRequest, NextApiResponse } from "next";
import {
  getMinifiedRecord,
  tableEvents,
} from "../../../utils/airtable/Airtable";
import { ErrorData, EventsData } from "../../../utils/airtable/Interfaces";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<EventsData | ErrorData>,
) => {
  const { id, fields } = req.body;

  try {
    const updatedRecords = await tableEvents.update([{ id, fields }]);
    const updatedRecord = getMinifiedRecord(updatedRecords[0]);
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: "Ooops! Something went wrong" });
  }
};

export default handler;

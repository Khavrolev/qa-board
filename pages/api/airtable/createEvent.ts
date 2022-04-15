import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getMinifiedRecord,
  tableEvents,
} from "../../../utils/airtable/Airtable";
import { ErrorData, EventsData } from "../../../utils/airtable/Interfaces";

const handler = withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse<EventsData | ErrorData>) => {
    const session = getSession(req, res);
    console.log(session);
    const { name, start, end } = req.body;

    try {
      const createdRecords = await tableEvents.create([
        { fields: { name, start, end, userId: session?.user?.sub } },
      ]);
      const createdRecord = getMinifiedRecord(createdRecords[0]);
      res.status(200).json(createdRecord);
    } catch (error) {
      res.status(500).json({ message: "Ooops! Something went wrong" });
    }
  },
);

export default handler;

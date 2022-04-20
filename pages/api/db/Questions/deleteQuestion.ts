import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getMinifiedRecord,
  tableEvents,
} from "../../../../utils/airtable/Airtable";
import { ErrorData, AirtableData } from "../../../../utils/airtable/Interfaces";
import { isString } from "../../../../utils/guards/Type";

const handler = withApiAuthRequired(
  async (
    req: NextApiRequest,
    res: NextApiResponse<AirtableData | ErrorData>,
  ) => {
    const { id } = req.query;

    try {
      const deletedRecords = await (isString(id)
        ? tableEvents.destroy([id])
        : tableEvents.destroy(id));
      const deletedRecord = getMinifiedRecord(deletedRecords[0]);
      res.status(200).json(deletedRecord);
    } catch (error) {
      res.status(500).json({ message: "Ooops! Something went wrong" });
    }
  },
);

export default handler;

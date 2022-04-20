import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import prisma from "../../../../utils/prisma/prisma";
import { EventDB } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { isString } from "../../../../utils/guards/Type";
import { ErrorData } from "../../../../utils/api/Interfaces";

const handler = withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse<EventDB | ErrorData>) => {
    const { id } = req.query;

    try {
      if (!isString(id)) {
        throw new Error();
      }
      const deletedRecord = await prisma.eventDB.delete({ where: { id } });
      res.status(200).json(deletedRecord);
    } catch (error) {
      res.status(500).json({ message: "Ooops! Something went wrong" });
    }
  },
);

export default handler;

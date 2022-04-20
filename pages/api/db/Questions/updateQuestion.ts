import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import prisma from "../../../../utils/prisma/prisma";
import { EventDB, QuestionDB } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorData } from "../../../../utils/api/Interfaces";

const handler = withApiAuthRequired(
  async (
    req: NextApiRequest,
    res: NextApiResponse<
      | (EventDB & {
          questions: QuestionDB[];
        })
      | ErrorData
    >,
  ) => {
    const { id, name, start, end } = req.body;

    try {
      const updatedRecord = await prisma.eventDB.update({
        where: { id },
        data: { name, start, end },
        include: { questions: true },
      });
      res.status(200).json(updatedRecord);
    } catch (error) {
      res.status(500).json({ message: "Ooops! Something went wrong" });
    }
  },
);

export default handler;

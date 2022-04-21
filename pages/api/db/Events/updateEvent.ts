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
          _count: {
            questions: number;
          };
          questions: QuestionDB[];
        })
      | ErrorData
    >,
  ) => {
    const { id, name, start, end, includeQuestions } = req.body;

    try {
      const options = {
        where: { id },
        data: { name, start, end },
        include: includeQuestions
          ? { questions: true }
          : { _count: { select: { questions: true } } },
      };
      const updatedRecord = await prisma.eventDB.update(options);
      res.status(200).json(updatedRecord);
    } catch (error) {
      res.status(500).json({ message: "Ooops! Something went wrong" });
    }
  },
);

export default handler;

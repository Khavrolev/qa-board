import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import prisma from "../../../../utils/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { EventDB, QuestionDB } from "@prisma/client";
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
    const session = getSession(req, res);
    const { name, start, end } = req.body;

    try {
      const createdRecord = await prisma.eventDB.create({
        data: {
          name,
          start,
          end,
          userId: session?.user?.sub,
          userName: session?.user?.nickname,
        },
        include: { questions: true },
      });
      res.status(200).json(createdRecord);
    } catch (error) {
      res.status(500).json({ message: "Ooops! Something went wrong" });
    }
  },
);

export default handler;

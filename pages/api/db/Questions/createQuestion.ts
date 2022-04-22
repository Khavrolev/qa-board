import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import prisma from "../../../../utils/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { QuestionDB } from "@prisma/client";
import { ErrorData } from "../../../../utils/api/Interfaces";

const handler = withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse<QuestionDB | ErrorData>) => {
    const session = getSession(req, res);
    const { text, event_id } = req.body;

    try {
      const createdRecord = await prisma.questionDB.create({
        data: {
          text,
          event_id,
          userId: session?.user?.sub,
          userName: session?.user?.nickname,
        },
      });
      res.status(200).json(createdRecord);
    } catch (error) {
      res.status(500).json({ message: "Ooops! Something went wrong" });
    }
  },
);

export default handler;

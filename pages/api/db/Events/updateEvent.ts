import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import prisma from "../../../../utils/prisma/prisma";
import { EventDB, QuestionDB } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorData } from "../../../../utils/api/Interfaces";
import { isString } from "../../../../utils/guards/Type";

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
      if (!isString(id)) {
        return res.status(400).json({ message: "Ooops! Wrong id" });
      }

      const session = getSession(req, res);
      const record = await prisma.eventDB.findUnique({ where: { id } });

      if (!record) {
        return res.status(400).json({ message: "Ooops! Wrong id" });
      }

      if (session?.user.sub !== record.userId) {
        return res.status(403).json({ message: "Ooops! Forbidden" });
      }

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

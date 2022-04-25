import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import prisma from "../../../../utils/prisma/prisma";
import { QuestionDB } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { isString } from "../../../../utils/guards/Type";
import { ErrorData } from "../../../../utils/api/Interfaces";

const handler = withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse<QuestionDB | ErrorData>) => {
    const { id } = req.query;

    try {
      if (!isString(id)) {
        return res.status(400).json({ message: "Ooops! Wrong id" });
      }

      const session = getSession(req, res);
      const record = await prisma.questionDB.findUnique({
        where: { id },
        include: { event: true },
      });

      if (!record) {
        return res.status(400).json({ message: "Ooops! Wrong id" });
      }

      if (
        session?.user.sub !== record.userId &&
        session?.user.sub !== record.event.userId
      ) {
        return res.status(403).json({ message: "Ooops! Forbidden" });
      }

      const deletedRecord = await prisma.questionDB.delete({ where: { id } });
      res.status(200).json(deletedRecord);
    } catch (error) {
      res.status(500).json({ message: "Ooops! Something went wrong" });
    }
  },
);

export default handler;

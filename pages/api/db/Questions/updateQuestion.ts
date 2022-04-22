import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import prisma from "../../../../utils/prisma/prisma";
import { QuestionDB } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorData } from "../../../../utils/api/Interfaces";

const handler = withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse<QuestionDB | ErrorData>) => {
    const { id, likes } = req.body;

    try {
      const updatedRecord = await prisma.questionDB.update({
        where: { id },
        data: { likes },
      });
      res.status(200).json(updatedRecord);
    } catch (error) {
      res.status(500).json({ message: "Ooops! Something went wrong" });
    }
  },
);

export default handler;

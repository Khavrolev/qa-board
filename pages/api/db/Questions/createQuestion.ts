import prisma from "../../../../utils/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { QuestionDB } from "@prisma/client";
import { ErrorData } from "../../../../utils/api/Interfaces";
import { getSession } from "next-auth/react";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<QuestionDB | ErrorData>,
) => {
  const { text, event_id } = req.body;

  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(500).json({ message: "Ooops! Something went wrong" });
    }

    const createdRecord = await prisma.questionDB.create({
      data: {
        text,
        event_id,
        userId: session?.user.id,
        userName: session?.user.email,
      },
    });
    res.status(200).json(createdRecord);
  } catch (error) {
    res.status(500).json({ message: "Ooops! Something went wrong" });
  }
};

export default handler;

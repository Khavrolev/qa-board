import prisma from "../../../../utils/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { QuestionDB } from "@prisma/client";
import { ErrorData } from "../../../../utils/api/Interfacess";
import { getSession } from "next-auth/react";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<QuestionDB | ErrorData>,
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { text, event_id, anonymousName } = req.body;

  try {
    const session = await getSession({ req });

    const createdRecord = await prisma.questionDB.create({
      data: {
        text,
        event_id,
        userId: session?.user.id,
        userName: session?.user.email || anonymousName,
      },
    });
    res.status(200).json(createdRecord);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default handler;

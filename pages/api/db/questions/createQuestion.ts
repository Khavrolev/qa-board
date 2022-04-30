import prisma from "../../../../utils/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { QuestionDB } from "@prisma/client";
import { ErrorData } from "../../../../utils/api/interfaces";
import { getSession } from "next-auth/react";
import { checkRequestType } from "../../../../utils/api/checkRequests";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<QuestionDB | ErrorData>,
) => {
  const { text, event_id, anonymousName } = req.body;

  try {
    checkRequestType(req.method, res, "POST");

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

import prisma from "../../../../utils/prisma/prisma";
import { QuestionDB } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorData } from "../../../../utils/api/interfaces";
import { checkRequestType } from "../../../../utils/api/checkRequests";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<QuestionDB | ErrorData>,
) => {
  const { id, likes } = req.body;

  try {
    checkRequestType(req.method, res, "PUT");

    const updatedRecord = await prisma.questionDB.update({
      where: { id },
      data: { likes },
    });
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default handler;

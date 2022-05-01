import prisma from "../../../../utils/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { QuestionDB } from "@prisma/client";
import { ErrorData } from "../../../../utils/api/interfaces";
import { getSession } from "next-auth/react";
import {
  responseErrors,
  sendApiResponse,
} from "../../../../utils/api/checkRequests";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<QuestionDB | ErrorData>,
) => {
  const { text, event_id, anonymousName } = req.body;

  try {
    if (req.method !== "POST") {
      return sendApiResponse<ErrorData>(res, responseErrors.MethodNotAllowed);
    }

    const session = await getSession({ req });

    const createdRecord = await prisma.questionDB.create({
      data: {
        text,
        event_id,
        userId: session?.user.id,
        userName: session?.user.email || anonymousName,
      },
    });
    sendApiResponse<QuestionDB>(res, {
      code: 201,
      object: createdRecord,
    });
  } catch (error) {
    return sendApiResponse<ErrorData>(res, responseErrors.ServerError);
  }
};

export default handler;

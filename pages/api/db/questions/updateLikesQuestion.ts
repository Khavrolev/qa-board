import prisma from "../../../../utils/prisma/prisma";
import { QuestionDB } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorData } from "../../../../utils/api/interfaces";
import {
  isString,
  responseErrors,
  sendApiResponse,
} from "../../../../utils/api/checkRequests";
import { UpdateLikeType } from "../../../../utils/enums/question";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<QuestionDB | ErrorData>,
) => {
  const { id, type } = req.body;

  try {
    if (req.method !== "PUT") {
      return sendApiResponse<ErrorData>(res, responseErrors.MethodNotAllowed);
    }

    if (!isString(id)) {
      return sendApiResponse<ErrorData>(res, responseErrors.WrongId);
    }

    const record = await prisma.questionDB.findUnique({ where: { id } });

    if (!record) {
      return sendApiResponse<ErrorData>(res, responseErrors.WrongId);
    }

    let likes = record.likes;
    if (type === UpdateLikeType.Decrement) {
      likes = likes - 1;
    } else if (type === UpdateLikeType.Increment) {
      likes = likes + 1;
    }

    const updatedRecord = await prisma.questionDB.update({
      where: { id },
      data: { likes },
    });
    sendApiResponse<QuestionDB>(res, {
      code: 200,
      object: updatedRecord,
    });
  } catch (error) {
    return sendApiResponse<ErrorData>(res, responseErrors.ServerError);
  }
};

export default handler;

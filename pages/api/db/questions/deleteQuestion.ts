import prisma from "../../../../utils/prisma/prisma";
import { QuestionDB } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorData } from "../../../../utils/api/interfaces";
import { getSession } from "next-auth/react";
import { Roles } from "../../../../utils/enums/user";
import {
  isString,
  responseErrors,
  sendApiResponse,
} from "../../../../utils/api/checkRequests";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<QuestionDB | ErrorData>,
) => {
  const { id } = req.query;

  try {
    if (req.method !== "DELETE") {
      return sendApiResponse<ErrorData>(res, responseErrors.MethodNotAllowed);
    }

    if (!isString(id)) {
      return sendApiResponse<ErrorData>(res, responseErrors.WrongId);
    }

    const record = await prisma.questionDB.findUnique({
      where: { id },
    });

    if (!record) {
      return sendApiResponse<ErrorData>(res, responseErrors.WrongId);
    }

    const session = await getSession({ req });
    if (
      session?.user.id !== record.userId &&
      session?.user.role !== Roles.Admin
    ) {
      return sendApiResponse<ErrorData>(res, responseErrors.NotAuthorizated);
    }

    const deletedRecord = await prisma.questionDB.delete({ where: { id } });
    sendApiResponse<QuestionDB>(res, {
      code: 200,
      object: deletedRecord,
    });
  } catch (error) {
    return sendApiResponse<ErrorData>(res, responseErrors.ServerError);
  }
};

export default handler;

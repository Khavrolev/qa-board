import prisma from "../../../../utils/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  ErrorData,
  EventWithQuestions,
} from "../../../../utils/api/interfaces";
import { getSession } from "next-auth/react";
import { Roles } from "../../../../utils/enums/user";
import {
  isString,
  responseErrors,
  sendApiResponse,
} from "../../../../utils/api/checkRequests";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<EventWithQuestions | ErrorData>,
) => {
  const { id, name, start, end, includeQuestions } = req.body;

  try {
    if (req.method !== "PUT") {
      return sendApiResponse<ErrorData>(res, responseErrors.MethodNotAllowed);
    }

    if (!isString(id)) {
      return sendApiResponse<ErrorData>(res, responseErrors.WrongId);
    }

    const record = await prisma.eventDB.findUnique({ where: { id } });

    if (!record) {
      return sendApiResponse<ErrorData>(res, responseErrors.WrongId);
    }

    const session = await getSession({ req });
    if (session?.user.role !== Roles.Admin) {
      return sendApiResponse<ErrorData>(res, responseErrors.NotAuthorizated);
    }

    const options = {
      where: { id },
      data: { name, start, end },
      include: includeQuestions
        ? { questions: true }
        : { _count: { select: { questions: true } } },
    };
    const updatedRecord = await prisma.eventDB.update(options);
    sendApiResponse<EventWithQuestions>(res, {
      code: 200,
      object: updatedRecord,
    });
  } catch (error) {
    return sendApiResponse<ErrorData>(res, responseErrors.ServerError);
  }
};

export default handler;

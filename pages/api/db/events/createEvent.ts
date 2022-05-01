import prisma from "../../../../utils/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  ErrorData,
  EventWithQuestionCounter,
} from "../../../../utils/api/interfaces";
import { getSession } from "next-auth/react";
import { Roles } from "../../../../utils/enums/user";
import {
  responseErrors,
  sendApiResponse,
} from "../../../../utils/api/checkRequests";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<EventWithQuestionCounter | ErrorData>,
) => {
  const { name, start, end } = req.body;

  try {
    if (req.method !== "POST") {
      return sendApiResponse<ErrorData>(res, responseErrors.MethodNotAllowed);
    }

    const session = await getSession({ req });
    if (session?.user.role !== Roles.Admin) {
      return sendApiResponse<ErrorData>(res, responseErrors.NotAuthorizated);
    }

    const createdRecord = await prisma.eventDB.create({
      data: {
        name,
        start,
        end,
        userId: session?.user.id,
        userName: session?.user.email,
      },
      include: { _count: { select: { questions: true } } },
    });
    sendApiResponse<EventWithQuestionCounter>(res, {
      code: 201,
      object: createdRecord,
    });
  } catch (error) {
    return sendApiResponse(res, responseErrors.ServerError);
  }
};

export default handler;

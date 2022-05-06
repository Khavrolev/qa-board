import { UserDB } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import {
  responseErrors,
  sendApiResponse,
} from "../../../../utils/api/checkRequests";
import { ErrorData } from "../../../../utils/api/interfaces";
import prisma from "../../../../utils/prisma/prisma";

const bcrypt = require("bcrypt");

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<UserDB | ErrorData>,
) => {
  const { email, password } = req.body;

  try {
    const record = await prisma.userDB.findUnique({ where: { email } });
    if (record) {
      return sendApiResponse<ErrorData>(res, responseErrors.UsedEmail);
    }

    const hash = await bcrypt.hash(password, 10);
    const createdRecord = await prisma.userDB.create({
      data: {
        email,
        password: hash,
      },
    });
    sendApiResponse<UserDB>(res, {
      code: 201,
      object: createdRecord,
    });
  } catch (error) {
    return sendApiResponse(res, responseErrors.ServerError);
  }
};

export default handler;

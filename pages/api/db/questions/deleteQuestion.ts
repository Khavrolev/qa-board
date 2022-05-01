import prisma from "../../../../utils/prisma/prisma";
import { QuestionDB } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorData } from "../../../../utils/api/interfaces";
import { getSession } from "next-auth/react";
import { Roles } from "../../../../utils/enums/user";
import { checkRequestType } from "../../../../utils/api/checkRequests";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<QuestionDB | ErrorData>,
) => {
  const { id } = req.query;

  try {
    checkRequestType(req.method, res, "DELETE");

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Wrong id" });
    }

    const session = await getSession({ req });
    if (!session) {
      return res.status(500).json({ message: "Something went wrong" });
    }

    const record = await prisma.questionDB.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!record) {
      return res.status(400).json({ message: "Wrong id" });
    }

    if (
      session?.user.id !== record.userId &&
      session?.user.role !== Roles.Admin
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deletedRecord = await prisma.questionDB.delete({ where: { id } });
    res.status(200).json(deletedRecord);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default handler;

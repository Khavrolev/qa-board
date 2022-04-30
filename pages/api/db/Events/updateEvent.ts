import prisma from "../../../../utils/prisma/prisma";
import { EventDB, QuestionDB } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorData } from "../../../../utils/api/Interfaces";
import { isString } from "../../../../utils/guards/Types";
import { getSession } from "next-auth/react";
import { adminRole } from "../../../../utils/const";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<
    | (EventDB & {
        _count: {
          questions: number;
        };
        questions: QuestionDB[];
      })
    | ErrorData
  >,
) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, name, start, end, includeQuestions } = req.body;

  try {
    if (!isString(id)) {
      return res.status(400).json({ message: "Wrong id" });
    }

    const session = await getSession({ req });
    if (!session) {
      return res.status(500).json({ message: "Something went wrong" });
    }

    const record = await prisma.eventDB.findUnique({ where: { id } });

    if (!record) {
      return res.status(400).json({ message: "Wrong id" });
    }

    if (session?.user.role !== adminRole) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const options = {
      where: { id },
      data: { name, start, end },
      include: includeQuestions
        ? { questions: true }
        : { _count: { select: { questions: true } } },
    };
    const updatedRecord = await prisma.eventDB.update(options);
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default handler;

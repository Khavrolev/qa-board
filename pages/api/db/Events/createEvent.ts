import prisma from "../../../../utils/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { EventDB } from "@prisma/client";
import { ErrorData } from "../../../../utils/api/Interfaces";
import { getSession } from "next-auth/react";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<
    | (EventDB & {
        _count: {
          questions: number;
        };
      })
    | ErrorData
  >,
) => {
  const { name, start, end } = req.body;

  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(500).json({ message: "Ooops! Something went wrong" });
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
    res.status(200).json(createdRecord);
  } catch (error) {
    res.status(500).json({ message: "Ooops! Something went wrong" });
  }
};

export default handler;

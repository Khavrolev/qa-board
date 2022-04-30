import prisma from "../../../../utils/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { EventDB } from "@prisma/client";
import { ErrorData } from "../../../../utils/api/Interfacess";
import { getSession } from "next-auth/react";
import { Roles } from "../../../../utils/enums/Userr";

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
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, start, end } = req.body;

  try {
    const session = await getSession({ req });
    if (session?.user.role !== Roles.Admin) {
      return res.status(403).json({ message: "Forbidden" });
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
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default handler;
import prisma from "../../../../utils/prisma/prisma";
import { EventDB } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { isString } from "../../../../utils/guards/Types";
import { ErrorData } from "../../../../utils/api/Interfaces";
import { getSession } from "next-auth/react";
import { adminRole } from "../../../../utils/const";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<EventDB | ErrorData>,
) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

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

    const deletedRecord = await prisma.eventDB.delete({ where: { id } });
    res.status(200).json(deletedRecord);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default handler;

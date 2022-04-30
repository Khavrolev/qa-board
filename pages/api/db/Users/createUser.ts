import { UserDB } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { ErrorData } from "../../../../utils/api/Interfaces";
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
      res.status(400).json({ message: "This email is used, try another one" });
    }

    const hash = await bcrypt.hash(password, 10);
    const createdRecord = await prisma.userDB.create({
      data: {
        email,
        password: hash,
      },
    });
    res.status(200).json(createdRecord);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default handler;

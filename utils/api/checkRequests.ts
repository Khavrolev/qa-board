import { NextApiResponse } from "next";
import { ErrorData } from "./interfaces";

export const checkRequestType = (
  method: string | undefined,
  res: NextApiResponse<ErrorData>,
  checkedMethod: string,
) => {
  if (method !== checkedMethod) {
    return res.status(405).json({ message: "Method not allowed" });
  }

  return null;
};

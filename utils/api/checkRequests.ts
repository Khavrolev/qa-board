import { NextApiResponse } from "next";
import { ErrorData } from "./interfaces";

interface ResponseApi<Type> {
  code: number;
  object: Type;
}

interface ResponseErrors {
  WrongId: ResponseApi<ErrorData>;
  NotAuthorizated: ResponseApi<ErrorData>;
  MethodNotAllowed: ResponseApi<ErrorData>;
  ServerError: ResponseApi<ErrorData>;
}

export const responseErrors: ResponseErrors = {
  WrongId: { code: 400, object: { message: "Wrong id" } },
  NotAuthorizated: { code: 403, object: { message: "Forbidden" } },
  MethodNotAllowed: { code: 405, object: { message: "Method not allowed" } },
  ServerError: { code: 500, object: { message: "Something went wrong" } },
};

export const sendApiResponse = <Type>(
  res: NextApiResponse,
  responseObject: ResponseApi<Type>,
) => {
  const { code, object } = responseObject;
  return res.status(code).json(object);
};

export const isString = (value: any): value is string => {
  return value && !Array.isArray(value);
};

import axios from "axios";
import { CreateUser } from "./interfaces";

const usersRoute = `api/db/users`;

export const fetchCreateUser = async (user: CreateUser) => {
  const { email, password } = user;
  const res = await axios.post(`${usersRoute}/createUser`, {
    email,
    password,
  });

  return res.data;
};

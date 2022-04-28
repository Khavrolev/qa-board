import axios from "axios";
import { CreateUser } from "./Interfaces";

export const fetchCreateUser = async (user: CreateUser) => {
  const { email, password } = user;
  const res = await axios.post("api/db/Users/createUser", {
    email,
    password,
  });

  return res.data;
};

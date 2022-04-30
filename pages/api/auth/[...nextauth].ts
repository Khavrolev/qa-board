import NextAuth from "next-auth";
import { User } from "next-auth";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { AUTH_SECRET, JWT_SECRET, NODE_ENV } from "../../../utils/const";
import prisma from "../../../utils/prisma/prisma";

const bcrypt = require("bcrypt");

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: { email: {}, password: {} },
      authorize,
    }),
  ],
  secret: AUTH_SECRET,
  jwt: {
    secret: JWT_SECRET,
  },
  callbacks: {
    session,
    jwt,
  },
  debug: NODE_ENV === "development",
});

async function authorize(
  credentials: Record<"email" | "password", string> | undefined,
) {
  try {
    const user = await prisma.userDB.findFirst({
      where: {
        email: credentials?.email,
      },
    });

    if (!user) {
      console.log(`User with email ${credentials?.email} not found`);
      return null;
    }

    const { id, email, password, role } = user;

    const correctPassword = await bcrypt.compare(
      credentials?.password,
      password,
    );

    if (!correctPassword) {
      console.log("Hash not matched logging in");
      return null;
    }

    return { id, email, role };
  } catch (error) {
    console.log(`Authorize error: ${error}`);
    return null;
  }
}

async function session({ session, token }: { session: Session; token: JWT }) {
  session.user = token.user;

  return session;
}

async function jwt({ token, user }: { token: JWT; user?: User | undefined }) {
  if (user) {
    token.user = user;
  }

  return token;
}

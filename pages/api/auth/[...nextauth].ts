import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../utils/prisma/prisma";

const bcrypt = require("bcrypt");

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
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
        }

        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
});

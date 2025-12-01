
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@/generated/prisma/browser";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME_IN_MINUTES = 15;

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // Return null for missing credentials
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          return null; // Return null if user not found
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error("Account is locked. Please try again later.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );

        if (!isPasswordValid) {
          const newAttempts = user.failedLoginAttempts + 1;
          let lockUntil: Date | null = null;

          if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
            lockUntil = new Date(
              new Date().getTime() + LOCKOUT_TIME_IN_MINUTES * 60 * 1000
            );
            await prisma.user.update({
              where: { id: user.id },
              data: { failedLoginAttempts: newAttempts, lockedUntil: lockUntil },
            });
            throw new Error(
              `Account locked for ${LOCKOUT_TIME_IN_MINUTES} minutes due to too many failed login attempts.`
            );
          } else {
            await prisma.user.update({
              where: { id: user.id },
              data: { failedLoginAttempts: newAttempts },
            });
          }

          return null; // Return null for invalid password
        }

        // If login is successful, reset attempts
        if (user.failedLoginAttempts > 0 || user.lockedUntil) {
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lockedUntil: null },
          });
        }

        return {
          id: user.id,
          email: user.email!,
          name: user.firstName,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as UserRole;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
});


import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@/generated/prisma/";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME_IN_MINUTES = 60;

const protectedRoutes = [
  '/admin',
  '/teacher',
  '/student',
  '/parent',
  '/profile',
  '/notifications',
  '/dashboard',
];

const { auth, handlers, signIn, signOut } = NextAuth({
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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = protectedRoutes.some(route => nextUrl.pathname.startsWith(route));

      if (isProtectedRoute && !isLoggedIn) {
        const loginUrl = new URL('/login', nextUrl.origin);
        loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        return Response.redirect(loginUrl);
      }

      return true;
    },
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user?.email) {
        // Find the user created/updated by PrismaAdapter
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, role: true, student: true }, // Select student profile to check existence
        });

        if (dbUser) {
          // Ensure the user has the STUDENT role if no other specific role is set by the adapter or user record
          if (!dbUser.role) { // If role is null or not explicitly set by adapter
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { role: UserRole.STUDENT },
            });
          }

          // Ensure a Student profile exists for this user if they are a STUDENT and don't have one
          // This implicitly handles the "unapproved" state as it's a default student profile,
          // which an admin would then review and potentially assign a different specific profile/role.
          if (dbUser.role === UserRole.STUDENT && !dbUser.student) {
            await prisma.student.create({
              data: { userId: dbUser.id },
            });
          }
        }
      }
      return true; // Continue with the sign-in process
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
});

export { auth, handlers, signIn, signOut };


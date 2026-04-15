import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@mindorbit/db";
import bcrypt from "bcryptjs";

/** NextAuth v4 reads NEXTAUTH_SECRET; we also accept AUTH_SECRET (e.g. Vercel / shared tooling). */
const authSecret =
  process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

export const authOptions = {
  ...(authSecret ? { secret: authSecret } : {}),
  session: { strategy: "jwt" as const, maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const emailInput = String(credentials.email).trim();
        const user = await prisma.user.findFirst({
          where: { email: { equals: emailInput, mode: "insensitive" } },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            planTier: true,
            passwordHash: true,
          },
        });
        if (!user?.passwordHash) return null;
        const valid = await bcrypt.compare(
          String(credentials.password),
          user.passwordHash
        );
        if (!valid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          planTier: user.planTier,
        };
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        (token as { id?: string }).id = user.id;
        token.email = user.email;
        (token as { role?: string }).role = user.role;
        (token as { planTier?: string }).planTier = user.planTier;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session?.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { planTier?: string }).planTier = token.planTier as string;
      }
      return session;
    },
  },
};

import { getServerSession as _getServerSession } from "next-auth";

export async function getServerSession() {
  return _getServerSession(authOptions);
}

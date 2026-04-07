/** NextAuth v4 reads NEXTAUTH_SECRET; repo docs use AUTH_SECRET — support both. */
export const authSecret =
  process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

import "next-auth";

export type UserRole = "STUDENT" | "CREATOR" | "ADMIN" | "SUPER_ADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: UserRole;
    };
  }
}

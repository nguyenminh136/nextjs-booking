import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    expiresAt?: number;
    error?: string;
  }

  interface JWT {
    accessToken?: string;
    expiresAt?: number;
  }

  interface User extends DefaultUser {
    id?: string;
  }
}

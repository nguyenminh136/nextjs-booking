import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    expiresAt?: number;
    error?: string;
  }

  interface JWT {
    accessToken?: string;
    expiresAt?: number;
    error?: string;
  }

  interface User extends DefaultUser {
    id?: string;
  }
}

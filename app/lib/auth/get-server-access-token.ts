import "server-only";

import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

/**
 * Reads the OAuth access token from NextAuth's encrypted, HttpOnly JWT cookie.
 * The token is deliberately not part of the client-visible Session object.
 */
export async function getServerAccessToken(): Promise<string | null> {
  const requestCookies = await cookies();

  // getToken accepts NextRequest/NextApiRequest. In App Router server contexts,
  // Next provides the cookie store separately. An empty header set ensures this
  // helper only accepts the session cookie, not a caller-supplied Bearer token.
  const token = await getToken({
    req: {
      headers: new Headers(),
      cookies: requestCookies
    } as unknown as NextRequest
  });

  if (!token || token.error === "AccessTokenExpired") {
    return null;
  }

  const expiresAt = Number(token.expiresAt);
  if (Number.isFinite(expiresAt) && Date.now() / 1000 >= expiresAt) {
    return null;
  }

  return typeof token.accessToken === "string" && token.accessToken.length > 0
    ? token.accessToken
    : null;
}

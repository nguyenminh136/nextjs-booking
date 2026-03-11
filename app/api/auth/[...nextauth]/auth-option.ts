import { AuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

// Determine NEXTAUTH_URL - use explicit setting or derive from Vercel environment
const getNextAuthUrl = () => {
  // Explicit NEXTAUTH_URL takes priority
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // On Vercel, derive from VERCEL_URL if available
  if (process.env.VERCEL_URL) {
    const protocol = process.env.VERCEL_ENV === 'production' ? 'https' : 'https';
    return `${protocol}://${process.env.VERCEL_URL}`;
  }

  // Development fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // Production fallback - this should rarely happen
  console.error('[NextAuth] Unable to determine NEXTAUTH_URL. Set NEXTAUTH_URL environment variable.');
  return 'http://localhost:3000';
};

const nextAuthUrl = getNextAuthUrl();

// Validate required environment variables
const requiredEnvVars = [
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
  "AUTH0_ISSUER",
  "NEXTAUTH_SECRET"
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`[NextAuth] Missing required environment variable: ${envVar}`);
  }
}

console.log(`[NextAuth] Using NEXTAUTH_URL: ${nextAuthUrl}`);

export const authOptions: AuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID || "",
      clientSecret: process.env.AUTH0_CLIENT_SECRET || "",
      issuer: process.env.AUTH0_ISSUER || "",
      authorization: {
        params: {
          audience: process.env.AUTH0_AUDIENCE
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture
        };
      }
    })
  ],
  pages: {
    signIn: "/login"
  },
  session: { 
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  basePath: "/api/auth",
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Ensure redirects are to the same origin for security
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.expiresAt = Number(account.expires_at);
        if (account?.access_token) token.accessToken = account.access_token;
      }
      if (token.expiresAt && Date.now() / 1000 > Number(token.expiresAt)) {
        token.error = "AccessTokenExpired";
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.expiresAt = token.expiresAt as number;
      session.error = token.error as string | undefined;
      return session;
    }
  }
};

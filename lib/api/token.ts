// JWT token management utilities

export interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Decode JWT token without verification (client-side only)
 * Note: This does NOT verify the token signature - verification happens on server
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

/**
 * Get time until token expiration in milliseconds
 */
export function getTokenExpiryTime(token: string): number {
  const decoded = decodeToken(token);
  if (!decoded) return 0;

  const now = Math.floor(Date.now() / 1000);
  const expiresIn = decoded.exp - now;
  return expiresIn * 1000; // Convert to milliseconds
}

/**
 * Get refresh time (5 minutes before expiration)
 */
export function getRefreshTime(token: string): number {
  const expiryTime = getTokenExpiryTime(token);
  const refreshTime = expiryTime - 5 * 60 * 1000; // 5 minutes before expiry
  return Math.max(refreshTime, 1000); // At least 1 second
}

/**
 * Extract user info from token
 */
export function getUserFromToken(token: string): { id: string; email: string; role: string } | null {
  const decoded = decodeToken(token);
  if (!decoded || isTokenExpired(token)) return null;

  return {
    id: decoded.sub,
    email: decoded.email,
    role: decoded.role,
  };
}

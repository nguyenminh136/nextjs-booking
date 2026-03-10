'use client';

/**
 * Check if an error is an authentication error
 */
export function isAuthError(error: any): boolean {
  if (error?.status === 401) return true;
  if (error?.error === 'Unauthorized') return true;
  if (error?.message?.includes('Unauthorized')) return true;
  if (error?.message?.includes('token')) return true;
  return false;
}

/**
 * Force user to login when auth token expires or is invalid
 */
export function handleAuthError(): void {
  // Clear any cached auth data
  if (typeof window !== 'undefined') {
    // Redirect to login page
    window.location.href = '/auth/signin';
  }
}

/**
 * Wrapper for API calls that handles auth errors
 */
export async function fetchWithAuthCheck(
  url: string,
  options?: RequestInit
): Promise<Response> {
  try {
    const res = await fetch(url, options);
    
    if (res.status === 401 || res.headers.get('content-type')?.includes('json')) {
      const data = await res.json();
      if (data?.error === 'Unauthorized' || res.status === 401) {
        handleAuthError();
        throw new Error('Unauthorized');
      }
    }
    
    return res;
  } catch (error: any) {
    if (isAuthError(error)) {
      handleAuthError();
    }
    throw error;
  }
}

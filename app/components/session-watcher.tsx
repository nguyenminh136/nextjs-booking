"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";

export default function SessionWatcher() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Handle token expiration
    const interval = setInterval(() => {
      if (session?.error === "AccessTokenExpired") {
        console.log("Session expired, signing out...");
        toast.info("Session expired. Please log in again.", {
          position: "top-center",
          richColors: true,
          onAutoClose: () => {
            signOut({ callbackUrl: "/auth/signin" });
          }
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [session?.error]);

  // Listen for global fetch errors with 401 status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // If we get a 401 Unauthorized, sign out the user
        if (response.status === 401) {
          // Check if response is JSON to avoid parsing issues
          const contentType = response.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const data = await response.json();
            if (data?.error === 'Unauthorized' || data?.message === 'Unauthorized') {
              console.log("Unauthorized error detected, signing out...");
              toast.error("Your session has expired. Please log in again.", {
                position: "top-center",
                richColors: true,
                onAutoClose: () => {
                  signOut({ callbackUrl: "/auth/signin" });
                }
              });
            }
          }
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}

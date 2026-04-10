"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SessionWatcher() {
  const router = useRouter();
  const tokenCheckRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let isSubscribed = true;

    // Check if token exists on mount
    const checkToken = () => {
      if (!isSubscribed) return;

      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/auth/login");
      }
    };

    // Initial check
    checkToken();

    // Set up periodic token validation (every 5 minutes)
    tokenCheckRef.current = setInterval(checkToken, 5 * 60 * 1000);

    // Cleanup
    return () => {
      isSubscribed = false;
      if (tokenCheckRef.current) {
        clearInterval(tokenCheckRef.current);
      }
    };
  }, [router]);

  return null;
}

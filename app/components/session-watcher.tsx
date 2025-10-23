"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";

export default function SessionWatcher() {
  const { data: session } = useSession();
  useEffect(() => {
    const interval = setInterval(() => {
      if (session?.error === "AccessTokenExpired") {
        console.log("Session expired, signing out...");
        toast.info("Session expired. Please log in again.", {
          position: "top-center",
          richColors: true,
          onAutoClose: () => {
            signOut({ callbackUrl: "/login" });
          }
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [session]);

  return null;
}

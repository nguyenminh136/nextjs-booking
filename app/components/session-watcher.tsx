"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function SessionWatcher() {
  const { data: session } = useSession();
  console.log(session);

  useEffect(() => {
    if (session?.error === "AccessTokenExpired") {
      console.warn("Token expired, logging out...");
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  return null;
}

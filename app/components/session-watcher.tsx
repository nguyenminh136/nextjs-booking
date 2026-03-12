"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SessionWatcher() {
  const supabase = createClient();
  const router = useRouter();
  const checkingRef = useRef(false);

  useEffect(() => {
    let isSubscribed = true;

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isSubscribed) return;

      if (event === "SIGNED_OUT" || (!session && event !== "INITIAL_SESSION")) {
        router.push("/auth/login");
      } else if (event === "TOKEN_REFRESHED") {
        console.log("Session refreshed");
      }
    });

    // Cleanup subscription
    return () => {
      isSubscribed = false;
      subscription?.unsubscribe();
    };
  }, [supabase, router]);

  return null;
}

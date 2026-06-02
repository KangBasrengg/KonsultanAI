"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AuthTrigger() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openAuthModal, isVerifying, user } = useAuth();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (isVerifying || user || hasTriggered.current) return;

    if (searchParams.get("login") === "true") {
      hasTriggered.current = true;
      openAuthModal("login");
      // Clean up the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, openAuthModal, isVerifying, user]);

  return null;
}

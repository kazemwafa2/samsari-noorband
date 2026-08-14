"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";
import { authListener } from "@/lib/auth-listener";

export function useSession() {
  const [session, setSession] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadSession() {
      const currentSession =
        await getSession();

      setSession(currentSession);
      setLoading(false);
    }

    loadSession();

    const unsubscribe =
      authListener(async () => {
        const currentSession =
          await getSession();

        setSession(currentSession);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    session,
    loading,
  };
}
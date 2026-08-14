"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/get-current-user";
import { authListener } from "@/lib/auth-listener";

export function useAuth() {
  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadUser() {
      const currentUser =
        await getCurrentUser();

      setUser(currentUser);
      setLoading(false);
    }

    loadUser();

    const unsubscribe =
      authListener(async () => {
        const currentUser =
          await getCurrentUser();

        setUser(currentUser);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
  };
}
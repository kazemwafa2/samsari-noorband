"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./use-auth";

export function useGuestOnly() {
  const router = useRouter();

  const { user, loading } =
    useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [
    user,
    loading,
    router,
  ]);

  return {
    user,
    loading,
  };
}
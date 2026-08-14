"use client";

import { useAuth } from "./use-auth";

export function useGuestOnly() {
  const { user, loading } = useAuth();

  return {
    user,
    loading,
  };
}

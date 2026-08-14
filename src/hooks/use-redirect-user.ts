"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "./use-user-role";
import { redirectUser } from "@/lib/redirect-user";

export function useRedirectUser() {
  const router = useRouter();

  const { role, loading } =
    useUserRole();

  useEffect(() => {
    if (!loading && role) {
      router.replace(
        redirectUser(role)
      );
    }
  }, [role, loading, router]);

  return {
    role,
    loading,
  };
}
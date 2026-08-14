"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "./use-user-role";

export function useRoleProtectedRoute(
  allowedRoles: string[]
) {
  const router = useRouter();

  const { role, loading } =
    useUserRole();

  useEffect(() => {
    if (
      !loading &&
      (!role ||
        !allowedRoles.includes(role))
    ) {
      router.replace("/");
    }
  }, [
    role,
    loading,
    router,
    allowedRoles,
  ]);

  return {
    role,
    loading,
  };
}
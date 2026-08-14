"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/use-user-role";

type RoleProtectedRouteProps = {
  children: ReactNode;
  allowedRoles: string[];
};

export default function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
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

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  if (
    !role ||
    !allowedRoles.includes(role)
  ) {
    return null;
  }

  return <>{children}</>;
}
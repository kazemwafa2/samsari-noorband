"use client";

import { ReactNode } from "react";
import { useSession } from "@/hooks/use-session";
import AuthLoading from "./auth-loading";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const { loading } = useSession();

  if (loading) {
    return <AuthLoading />;
  }

  return <>{children}</>;
}
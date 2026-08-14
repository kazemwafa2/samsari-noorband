"use client";

import { useEffect } from "react";
import { authListener } from "@/lib/auth-listener";

export function useAuthListener(
  callback: (event: string) => void
) {
  useEffect(() => {
    const unsubscribe =
      authListener(callback);

    return () => {
      unsubscribe();
    };
  }, [callback]);
}
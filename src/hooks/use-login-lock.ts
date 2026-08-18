"use client";

import { useEffect, useState } from "react";
import {
  isLoginLocked,
} from "@/lib/login-rate-limit";
import {
  getLoginLockTime,
} from "@/lib/get-login-lock-time";

export function useLoginLock() {
  const [locked, setLocked] =
    useState(false);

  const [remainingTime, setRemainingTime] =
    useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocked(isLoginLocked());
      setRemainingTime(
        getLoginLockTime()
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    locked,
    remainingTime,
  };
}
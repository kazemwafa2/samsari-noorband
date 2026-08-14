"use client";

import { useEffect, useState } from "react";
import {
  getRememberMe,
  saveRememberMe,
} from "@/lib/remember-me";

export function useRememberMe() {
  const [remember, setRemember] =
    useState(false);

  useEffect(() => {
    setRemember(getRememberMe());
  }, []);

  function updateRemember(
    value: boolean
  ) {
    setRemember(value);
    saveRememberMe(value);
  }

  return {
    remember,
    setRemember: updateRemember,
  };
}
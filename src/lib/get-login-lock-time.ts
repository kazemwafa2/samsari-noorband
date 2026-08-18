export function getLoginLockTime() {
  if (typeof window === "undefined") {
    return 0;
  }

  const lockedUntil = Number(
    localStorage.getItem(
      "login-locked-until"
    ) || "0"
  );

  if (!lockedUntil) {
    return 0;
  }

  const remainingTime =
    lockedUntil - Date.now();

  return remainingTime > 0
    ? Math.ceil(remainingTime / 1000)
    : 0;
}
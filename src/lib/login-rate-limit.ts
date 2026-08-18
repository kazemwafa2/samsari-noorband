const MAX_ATTEMPTS = 5;
const LOCK_TIME = 30 * 1000;

export function isLoginLocked() {
  if (typeof window === "undefined") {
    return false;
  }

  const lockedUntil = Number(
    localStorage.getItem("login-locked-until")
  );

  if (!lockedUntil) {
    return false;
  }

  return Date.now() < lockedUntil;
}

export function addLoginAttempt() {
  if (typeof window === "undefined") {
    return;
  }

  const attempts = Number(
    localStorage.getItem("login-attempts") || "0"
  );

  const newAttempts = attempts + 1;

  localStorage.setItem(
    "login-attempts",
    String(newAttempts)
  );

  if (newAttempts >= MAX_ATTEMPTS) {
    localStorage.setItem(
      "login-locked-until",
      String(Date.now() + LOCK_TIME)
    );
  }
}

export function resetLoginAttempts() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("login-attempts");
  localStorage.removeItem(
    "login-locked-until"
  );
}
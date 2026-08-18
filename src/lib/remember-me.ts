export function saveRememberMe(
  value: boolean
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    "remember-me",
    JSON.stringify(value)
  );
}

export function getRememberMe() {
  if (typeof window === "undefined") {
    return false;
  }

  return JSON.parse(
    localStorage.getItem(
      "remember-me"
    ) || "false"
  );
}

export function removeRememberMe() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    "remember-me"
  );
}
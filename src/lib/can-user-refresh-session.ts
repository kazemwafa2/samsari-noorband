import { hasUserRefreshToken } from "./has-user-refresh-token";
import { hasUserSession } from "./has-user-session";

export async function canUserRefreshSession() {
  const hasSession =
    await hasUserSession();

  if (!hasSession) {
    return false;
  }

  const hasRefreshToken =
    await hasUserRefreshToken();

  return hasRefreshToken;
}
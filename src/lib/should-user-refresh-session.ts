import { canUserRefreshSession } from "./can-user-refresh-session";
import { isUserSessionExpired } from "./is-user-session-expired";

export async function shouldUserRefreshSession() {
  const canRefresh =
    await canUserRefreshSession();

  if (!canRefresh) {
    return false;
  }

  const expired =
    await isUserSessionExpired();

  return expired;
}
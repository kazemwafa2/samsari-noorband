import { getCurrentUser } from "./get-current-user";

export async function getUserEmail() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return user.email ?? null;
}
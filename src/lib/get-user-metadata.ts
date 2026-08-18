import { getCurrentUser } from "./get-current-user";

export async function getUserMetadata() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return user.user_metadata ?? null;
}
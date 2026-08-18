import { getCurrentUser } from "./get-current-user";

export async function getUserId() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return user.id;
}
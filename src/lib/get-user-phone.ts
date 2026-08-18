import { getCurrentUser } from "./get-current-user";

export async function getUserPhone() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return user.phone ?? null;
}
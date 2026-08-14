import { ROLES } from "./roles";

export function isSeller(
  role: string | null
) {
  if (!role) {
    return false;
  }

  return role === ROLES.SELLER;
}
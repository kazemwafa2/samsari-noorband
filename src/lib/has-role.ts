export function hasRole(
  role: string | null,
  allowedRoles: string[]
) {
  if (!role) {
    return false;
  }

  return allowedRoles.includes(role);
}
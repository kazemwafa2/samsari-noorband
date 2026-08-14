export function redirectUser(role: string) {
  switch (role.toLowerCase()) {
    case "super_admin":
    case "admin":
    case "seller":
      return "/dashboard";

    case "customer":
      return "/site/profile";

    default:
      return "/";
  }
}

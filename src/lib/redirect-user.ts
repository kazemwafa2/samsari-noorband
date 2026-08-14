export function redirectUser(role: string) {
  switch (role) {
    case "SUPER_ADMIN":
      return "/dashboard";

    case "ADMIN":
      return "/dashboard";

    case "SELLER":
      return "/dashboard/seller";

    case "CUSTOMER":
      return "/profile";

    default:
      return "/";
  }
}
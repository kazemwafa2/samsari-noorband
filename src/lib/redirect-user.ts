export function redirectUser(role: string) {
  switch (role.toLowerCase()) {
    case "super_admin":
    case "admin":
    case "seller":
      return "/dashboard";

    // مأمور تحویل به پنل مخصوص خودش می‌رود، نه پنل کامل مدیریت
    case "courier":
      return "/courier";

    case "customer":
      return "/site/profile";

    default:
      return "/";
  }
}

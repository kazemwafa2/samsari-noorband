export const ROLES = {

  SUPER_ADMIN: "super_admin",

  ADMIN: "admin",

  SELLER: "seller",

  // نقش جدید: مأمور تحویل. فقط به یک پنل محدود (/courier) دسترسی دارد؛
  // نه به کل /dashboard.
  COURIER: "courier",

  VIP: "vip",

  PREMIUM: "premium",

  CUSTOMER: "customer",

} as const;


export type Role =
  typeof ROLES[keyof typeof ROLES];
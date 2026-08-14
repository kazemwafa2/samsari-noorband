export const ROLES = {

  SUPER_ADMIN: "super_admin",

  ADMIN: "admin",

  SELLER: "seller",

  VIP: "vip",

  PREMIUM: "premium",

  CUSTOMER: "customer",

} as const;


export type Role =
  typeof ROLES[keyof typeof ROLES];
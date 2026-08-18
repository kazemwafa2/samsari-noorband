export const Roles = {

  SUPER_ADMIN: "super_admin",

  ADMIN: "admin",

  MODERATOR: "moderator",

  SELLER: "seller",

  VIP: "vip",

  USER: "user",

} as const;


export type Role =
  (typeof Roles)[keyof typeof Roles];
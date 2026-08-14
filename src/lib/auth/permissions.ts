import type { Role } from "./roles";
import { ROLES } from "./roles";


export function hasRole(
  role: string | null,
  allowedRoles: Role[]
){

  if(!role){

    return false;

  }


  return allowedRoles.includes(
    role as Role
  );

}

//==================================
// سیستم Permission دانه‌ریز (جدید)
//==================================
// هسته منطقی یک سیستم مجوز است، نه یک UI مدیریت کامل دسترسی‌ها. هر
// نقش به مجموعه‌ای از رشته‌های مجوز نگاشت می‌شود. برای توسعه به سیستم
// کامل با UI مدیریت دسترسی، این جدول قابل انتقال به دیتابیس هم هست.

export const PERMISSIONS = {
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_DELETE: "products.delete",
  PRODUCTS_EDIT: "products.edit",
  ORDERS_MANAGE: "orders.manage",
  USERS_MANAGE: "users.manage",
  SELLER_PRODUCTS: "seller.products",
  DISCOUNTS_MANAGE: "discounts.manage",
  SETTINGS_MANAGE: "settings.manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.SELLER]: [PERMISSIONS.PRODUCTS_CREATE, PERMISSIONS.PRODUCTS_EDIT, PERMISSIONS.SELLER_PRODUCTS],
  [ROLES.VIP]: [],
  [ROLES.PREMIUM]: [],
  [ROLES.CUSTOMER]: [],
};

export function hasPermission(role: Role | string | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role as Role]?.includes(permission) ?? false;
}
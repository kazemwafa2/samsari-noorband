export interface User {
  id: string;

  name: string;

  email: string;

  avatar?: string;

  phone?: string;

  address?: string;

  language?: string;

  currency?: string;

  is_verified: boolean;

  is_active: boolean;

  role:
    | "admin"
    | "super_admin"
    | "customer"
    | "moderator"
    | "seller"
    | "courier";

  created_at: string;

  updated_at?: string;
}

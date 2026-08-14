export interface Checkout {
  id?: string;

  user_id: string;

  subtotal: number;

  discount?: number;

  delivery_price?: number;

  total: number;

  coupon_code?: string;

  payment_method?:
    | "paypal"
    | "bank"
    | "cash"
    | "stripe"
    | "other";

  payment_status?:
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

  order_status?:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  address: string;

  phone: string;

  notes?: string;

  currency?: string;

  language?: string;

  tracking_code?: string;

  created_at: string;

  updated_at?: string;
}
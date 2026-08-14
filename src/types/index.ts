// ================================
// LOCALE
// ================================

export type Language = {
  id: string
  code: string
  name: string
  name_local?: string
  direction: "rtl" | "ltr"
  flag?: string
  is_default?: boolean
}

export type Currency = {
  id: string
  code: string
  symbol: string
  name: string
  name_fa?: string
  name_local?: string
  exchange_rate?: number
  is_default?: boolean
}


// ================================
// LOCATION
// ================================

export type Country = {
  id: string
  name: string
  name_fa?: string
  name_local?: string
  code?: string
  flag?: string
  phone_code?: string
  currency_code?: string
  is_default?: boolean
}

export type Province = {
  id: string
  name: string
  name_fa?: string
  name_local?: string
  code?: string
  country_id?: string
}

export type District = {
  id: string
  name: string
  name_fa?: string
  name_local?: string
  code?: string
  province_id?: string
}

export type City = {
  id: string
  name: string
  name_fa?: string
  name_local?: string
  code?: string
  district_id?: string
  postal_code?: string
}

export type Address = {
  id: string
  user_id?: string

  country_id?: string
  province_id?: string
  district_id?: string
  city_id?: string

  address?: string
  postal_code?: string

  phone?: string

  latitude?: number
  longitude?: number

  is_default?: boolean
}


// ================================
// USER
// ================================

export type UserProfile = {
  id: string

  full_name?: string
  surname?: string
  username?: string

  email?: string
  phone?: string
  phone_code?: string

  birth_date?: string

  avatar_url?: string

  language_id?: string
  currency_id?: string

  country_id?: string
  province_id?: string
  district_id?: string
  city_id?: string

  village?: string
  address?: string

  is_verified?: boolean
}


// ================================
// CATEGORY
// ================================

export type Category = {
  id: string

  name: string
  name_fa?: string

  slug?: string
  image_url?: string

  is_active?: boolean
}


// ================================
// PRODUCT
// ================================

export type Product = {
  id: string

  name: string
  name_fa?: string

  description?: string

  price?: number
  discount_price?: number

  image_url?: string

  stock?: number

  category_id?: string

  is_active?: boolean
}


// ================================
// ORDER
// ================================

export type Order = {
  id: string

  user_id?: string

  order_number?: string

  status?:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned"

  total_price?: number
  shipping_price?: number
  discount_price?: number

  payment_method?: string
  payment_status?: string

  address_id?: string

  tracking_code?: string

  created_at?: string
  updated_at?: string
}


export type OrderItem = {
  id: string

  order_id?: string
  product_id?: string

  quantity?: number

  price?: number
  total_price?: number
}


export type OrderStatus = {
  id: string

  name?: string
  label_fa?: string

  code?: string

  color?: string
}


export type OrderStatusHistory = {
  id: string

  order_id?: string

  status?:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned"

  note?: string

  created_at?: string

  to_status?: OrderStatus
}


// ================================
// BANNER
// ================================

export type Banner = {
  id: string

  title?: string
  subtitle?: string

  image_url?: string

  button_text?: string
  button_link?: string

  is_active?: boolean
}


// ================================
// NOTIFICATION
// ================================

export type Notification = {
  id: string

  title: string
  message: string

  type?: string

  is_read?: boolean

  created_at?: string
}


// ================================
// SITE SETTINGS
// ================================

export type SiteSetting = {
  id: string

  site_name?: string
  site_logo?: string

  support_phone?: string
  support_email?: string
  support_address?: string
}

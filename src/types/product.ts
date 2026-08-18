export interface Product {

  id: number;

  title: string;

  price: number;

  stock: number;

  image: string;

  description: string;

  discount: number;

  category: string;

  is_available: boolean;

  created_at: string;

  updated_at?: string;

  views?: number;

  is_featured?: boolean;

  specifications?: Record<string, string>;

}
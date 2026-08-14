"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/product";

// نسخه قبلی این صفحه محصولات کاملا ساختگی داشت و دکمه «افزودن به سبد
// خرید» اصلا onClick نداشت (هیچ کاری نمی‌کرد).

export default function CategoryDetailsPage() {
  const supabase = createClient();
  const params = useParams();
  const slug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (slug) load();
  }, [slug]);

  async function load() {
    setLoading(true);

    const { data: category } = await supabase
      .from("categories")
      .select("id, title")
      .eq("slug", slug)
      .maybeSingle();

    if (category) {
      setCategoryTitle(category.title);

      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", category.id)
        .eq("is_available", true);

      setProducts(data || []);
    }

    setLoading(false);
  }

  function handleAddToCart(product: Product) {
    const finalPrice =
      product.discount > 0 ? product.price - (product.price * product.discount) / 100 : product.price;

    addItem({
      product_id: String(product.id),
      title: product.title,
      price: product.price,
      discount_percent: product.discount,
      final_price: finalPrice,
      image: product.image,
      stock_quantity: product.stock,
    });
  }

  return (
    <div className="container home-page">
      <h1 className="section-title">محصولات دسته {categoryTitle || slug}</h1>

      {loading && <p>در حال بارگذاری...</p>}

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h2>{product.title}</h2>
            <p className="product-price">{product.price.toLocaleString("fa-AF")} افغانی</p>

            <button className="primary-btn" onClick={() => handleAddToCart(product)} disabled={product.stock <= 0}>
              افزودن به سبد خرید
            </button>
          </div>
        ))}
      </div>

      {!loading && products.length === 0 && (
        <div className="empty-state">
          <h2>محصولی یافت نشد.</h2>
        </div>
      )}
    </div>
  );
}

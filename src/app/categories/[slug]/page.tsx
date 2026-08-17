"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/product";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { resolveTranslated } from "@/lib/i18n/resolveContent";
import { useCurrency } from "@/lib/currency";

// نسخه قبلی این صفحه محصولات کاملا ساختگی داشت و دکمه «افزودن به سبد
// خرید» اصلا onClick نداشت (هیچ کاری نمی‌کرد). همچنین اصلا به سیستم
// ترجمه وصل نبود — همه‌ی متن‌ها (حتی «در حال بارگذاری»، «افزودن به
// سبد خرید») همیشه فارسی خام بودند، صرف‌نظر از زبان سایت.

export default function CategoryDetailsPage() {
  const supabase = createClient();
  const params = useParams();
  const slug = params.slug as string;
  const { language } = useLanguage();
  const { format } = useCurrency();

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
      .select("id, title, title_translations")
      .eq("slug", slug)
      .maybeSingle();

    if (category) {
      setCategoryTitle(resolveTranslated(category.title, category.title_translations, language));

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
      <h1 className="section-title">
        {t("categoryProductsTitlePrefix", language)} {categoryTitle || slug}
      </h1>

      {loading && <p>{t("loadingText", language)}</p>}

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h2>{product.title}</h2>
            <p className="product-price">{format(Number(product.price))}</p>

            <button className="primary-btn" onClick={() => handleAddToCart(product)} disabled={product.stock <= 0}>
              {t("addToCartButton", language)}
            </button>
          </div>
        ))}
      </div>

      {!loading && products.length === 0 && (
        <div className="empty-state">
          <h2>{t("noProductsFoundText", language)}</h2>
        </div>
      )}
    </div>
  );
}

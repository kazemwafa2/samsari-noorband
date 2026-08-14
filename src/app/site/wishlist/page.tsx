"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";

import { useWishlist } from "@/hooks/useWishlist";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { useCurrency } from "@/lib/currency";

export default function Wishlist() {
  const { items, loading, remove } = useWishlist();
  const { language } = useLanguage();
  const { format } = useCurrency();

  return (
    <main className="container home-page space-y-6">
      <h1 className="section-title">{t("wishlistTitle", language)}</h1>

      {loading && <p>{t("loadingText", language)}</p>}

      {!loading && items.length === 0 && (
        <div className="wishlist-empty">
          <span className="wishlist-empty-icon">
            <Heart size={40} fill="#F472B6" />
          </span>
          <p>{t("wishlistEmpty", language)}</p>
        </div>
      )}

      <div className="product-grid">
        {items.map((item) => (
          <div key={item.id} className="product-card">
            <Link href={`/products/${item.product_id}`}>
              <h3>{item.products?.title || t("untitledProduct", language)}</h3>
              {item.products?.price && (
                <p>{format(Number(item.products.price))}</p>
              )}
            </Link>

            <button className="danger-btn" onClick={() => remove(item.product_id)}>
              <Trash2 size={18} /> {t("removeAction", language)}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

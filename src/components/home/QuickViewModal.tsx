"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Scale } from "lucide-react";
import { AnimatedHeart } from "@/components/AnimatedHeart";
import { CartAddedBurst } from "@/components/CartAddedBurst";
import { toast } from "sonner";

import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cart";
import { useCompareStore } from "@/store/compare";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";

interface QuickViewModalProps {
  product: Product | null;
  format: (price: number) => string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}

// قبلا هیچ راهی برای دیدن سریع محصول بدون رفتن به صفحه‌ی جداگانه‌اش
// وجود نداشت. این مودال با Esc یا کلیک روی پس‌زمینه بسته می‌شود.
export default function QuickViewModal({
  product,
  format,
  isFavorite,
  onToggleFavorite,
  onClose,
}: QuickViewModalProps) {
  const { language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const addToCompare = useCompareStore((state) => state.add);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!product) return null;

  const finalPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  function handleAdd() {
    if (!product) return;

    addItem({
      product_id: String(product.id),
      title: product.title,
      price: product.price,
      discount_percent: product.discount || 0,
      final_price: finalPrice,
      image: product.image,
      stock_quantity: product.stock,
    });

    toast.success(`«${product.title}» ${t("addedToCartWithQty", language).replace("{n}", String(quantity))}`);

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 700);
    onClose();
  }

  return (
    <div className="quick-view-overlay" onClick={onClose}>
      <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="quick-view-close" onClick={onClose} aria-label="بستن">
          <X size={18} />
        </button>

        <div className="quick-view-media">
          {product.image ? (
            <Image src={product.image} alt={product.title} width={320} height={320} />
          ) : (
            <div className="product-card-img-placeholder">{t("noImage", language)}</div>
          )}
        </div>

        <div className="quick-view-body">
          <h2>{product.title}</h2>

          {product.description && <p className="quick-view-desc">{product.description}</p>}

          <div className="product-card-price" style={{ margin: "10px 0" }}>
            {product.discount > 0 ? (
              <>
                <span className="product-price-old">{format(product.price)}</span>
                <strong className="product-price-new">{format(finalPrice)}</strong>
              </>
            ) : (
              <strong className="product-price-new">{format(product.price)}</strong>
            )}
          </div>

          <p className="quick-view-stock">
            {product.stock > 0
              ? t("stockCount", language).replace("{n}", String(product.stock))
              : t("outOfStock", language)}
          </p>

          <div className="quick-view-actions">
            <input
              type="number"
              min={1}
              max={Math.max(product.stock, 1)}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="quick-view-qty"
            />

            <button
              type="button"
              className="primary-btn"
              onClick={handleAdd}
              disabled={product.stock <= 0}
            >
              <span className={`cart-added-wrap ${justAdded ? "cart-added-pop" : ""}`}>
                <ShoppingBag size={16} />
                <CartAddedBurst show={justAdded} />
              </span>
              {t("addToCart", language)}
            </button>

            <button
              type="button"
              className="outline-btn quick-view-icon-btn"
              onClick={onToggleFavorite}
              aria-label="علاقه‌مندی"
            >
              <AnimatedHeart isFavorite={isFavorite} size={16} />
            </button>

            <button
              type="button"
              className="outline-btn quick-view-icon-btn"
              onClick={() => {
                addToCompare(product.id);
                toast.success(t("compareAddedToast", language));
              }}
              aria-label="مقایسه"
            >
              <Scale size={16} />
            </button>
          </div>

          <Link href={`/products/${product.id}`} className="quick-view-full-link">
            {t("viewFullProduct", language)}
          </Link>
        </div>
      </div>
    </div>
  );
}

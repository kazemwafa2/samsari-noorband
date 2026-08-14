"use client";

import { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Eye, Scale } from "lucide-react";
import { AnimatedHeart } from "@/components/AnimatedHeart";
import { CartAddedBurst } from "@/components/CartAddedBurst";
import { toast } from "sonner";

import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cart";
import { useCompareStore } from "@/store/compare";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";

interface RatingInfo {
  avg: number;
  count: number;
}

interface ProductStats {
  view_count: number;
  sold_count: number;
  comment_count: number;
  wishlist_count: number;
}

interface ProductCardProps {
  product: Product;
  format: (price: number) => string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  rating?: RatingInfo;
  badgeLabel?: string;
  onQuickView?: (product: Product) => void;
  stats?: ProductStats;
}

// کارت محصول مشترک برای همه‌ی بخش‌های صفحه اصلی (جدید، ویژه، تخفیف‌دار،
// پرفروش، اخیرا مشاهده‌شده). با React.memo پیچیده شده چون این کارت در
// چند شبکه (هرکدام تا ۸ آیتم) هم‌زمان رندر می‌شود؛ بدون memo هر تغییر
// state در صفحه اصلی (مثلا تیک شمارش معکوس) باعث رندر دوباره‌ی همه‌ی
// کارت‌ها می‌شد.
function ProductCard({
  product,
  format,
  isFavorite,
  onToggleFavorite,
  rating,
  badgeLabel,
  onQuickView,
  stats,
}: ProductCardProps) {
  const { language } = useLanguage();
  const addItem = useCartStore((state) => state.addItem);
  const [justAdded, setJustAdded] = useState(false);
  const addToCompare = useCompareStore((state) => state.add);

  const finalPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      toast.error(t("productOutOfStockToast", language));
      return;
    }

    addItem({
      product_id: String(product.id),
      title: product.title,
      price: product.price,
      discount_percent: product.discount || 0,
      final_price: finalPrice,
      image: product.image,
      stock_quantity: product.stock,
    });

    toast.success(`«${product.title}» ${t("productAddedToCartToast", language)}`);

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 700);
  }

  function handleCompare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const before = useCompareStore.getState().productIds.length;
    addToCompare(product.id);
    const after = useCompareStore.getState().productIds.length;

    if (after === before && before >= 4) {
      toast.error(t("compareMaxToast", language));
    } else if (after > before) {
      toast.success(t("compareAddedToast", language));
    }
  }

  function handleQuickView(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  }

  return (
    <Link href={`/products/${product.id}`} className="product-card-v2">
      <div className="product-card-media">
        {product.discount > 0 && (
          <span className="product-badge product-badge-danger">
            ‎-{product.discount}%
          </span>
        )}

        {!product.discount && badgeLabel && (
          <span className="product-badge product-badge-primary">{badgeLabel}</span>
        )}

        <div className="product-media-actions">
          <button
            type="button"
            className="product-fav-btn"
            aria-label={t("wishlist", language)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <AnimatedHeart isFavorite={isFavorite} size={16} />
          </button>

          {onQuickView && (
            <button
              type="button"
              className="product-fav-btn"
              aria-label={t("quickView", language)}
              onClick={handleQuickView}
            >
              <Eye size={16} />
            </button>
          )}

          <button
            type="button"
            className="product-fav-btn"
            aria-label={t("compareBarView", language)}
            onClick={handleCompare}
          >
            <Scale size={16} />
          </button>
        </div>

        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            width={260}
            height={260}
            sizes="(max-width: 600px) 45vw, (max-width: 1024px) 25vw, 220px"
            className="product-card-img"
          />
        ) : (
          <div className="product-card-img-placeholder">{t("noImage", language)}</div>
        )}

        <button type="button" className="product-quick-add" onClick={handleQuickAdd}>
          <span className={`cart-added-wrap ${justAdded ? "cart-added-pop" : ""}`}>
            <ShoppingBag size={15} />
            <CartAddedBurst show={justAdded} />
          </span>
          {t("quickAdd", language)}
        </button>
      </div>

      <div className="product-card-body">
        {rating && rating.count > 0 && (
          <div className="product-rating">
            <Star size={13} fill="#FBBF24" color="#FBBF24" />
            <span>{rating.avg.toFixed(1)}</span>
            <span className="product-rating-count">({rating.count})</span>
          </div>
        )}

        <h3>{product.title}</h3>

        <div className="product-card-price">
          {product.discount > 0 ? (
            <>
              <span className="product-price-old">{format(product.price)}</span>
              <strong className="product-price-new">{format(finalPrice)}</strong>
            </>
          ) : (
            <strong className="product-price-new">{format(product.price)}</strong>
          )}
        </div>

        {product.stock <= 0 ? (
          <span className="product-stock product-stock-out">{t("outOfStock", language)}</span>
        ) : product.stock <= 3 ? (
          <span className="product-stock product-stock-low">
            {t("productStockLow", language).replace("{n}", String(product.stock))}
          </span>
        ) : null}

        {/* شمارنده‌های بازدید/فروش/نظر — چک‌لیست بخش ۱۲. قبلا داده‌اش
            در دیتابیس بود (page_views، order_items، comments) ولی روی
            کارت محصول اصلا نمایش داده نمی‌شد. */}
        {stats && (
          <div className="product-stats-row" style={{ display: "flex", gap: 10, fontSize: 12, opacity: 0.75, marginTop: 4 }}>
            {stats.view_count > 0 && <span>👁 {stats.view_count}</span>}
            {stats.sold_count > 0 && <span>🛒 {stats.sold_count} فروش</span>}
            {stats.comment_count > 0 && <span>💬 {stats.comment_count}</span>}
          </div>
        )}
      </div>
    </Link>
  );
}

export default memo(ProductCard);

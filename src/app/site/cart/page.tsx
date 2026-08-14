"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { useCartStore } from "@/store/cart";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { getMessage } from "@/constants/messages";
import { useCurrency } from "@/lib/currency";

// نسخه قبلی این صفحه کاملا فیک بود: totalPrice و cartCount مقدار ثابت
// ۰ داشتند و هیچ‌وقت عوض نمی‌شدند، و پیام «هیچ محصولی در سبد نیست»
// همیشه نمایش داده می‌شد — حتی وقتی کاربر از صفحه محصول چیزی به سبد
// اضافه کرده بود. این یعنی سبد خرید واقعی هیچ‌وقت قابل مشاهده نبود.
//
// چیدمان هم از کارت‌های عمومی .card/.flex (بدون تصویر مشخص، دکمه‌های
// ریز نامرتب) به کارت‌های اختصاصی سبد خرید تغییر کرد تا هم‌سطح بقیه‌ی
// صفحاتی باشد که این نشست بازطراحی شدند.

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscountAmount = useCartStore((state) => state.getDiscountAmount);
  const getTotal = useCartStore((state) => state.getTotal);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const { language } = useLanguage();
  const { format } = useCurrency();

  return (
    <div className="home-page">
      <h1 className="section-title">{t("cartPageTitle", language)}</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <ShoppingBag size={48} strokeWidth={1.2} />
          <p>{getMessage("EMPTY_CART_MESSAGE", language)}</p>
          <Link href="/" className="primary-btn">
            {t("continueShoppingButton", language)}
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.product_id} className="cart-item">
                <div className="cart-item-media">
                  {item.image && (
                    <Image src={item.image} alt={item.title} width={90} height={90} />
                  )}
                </div>

                <div className="cart-item-body">
                  <h3>{item.title}</h3>
                  <p className="product-price-new">{format(item.final_price)}</p>

                  <div className="cart-item-controls">
                    <div className="product-qty-input">
                      <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>

                      <span style={{ width: 32, textAlign: "center" }}>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock_quantity}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      className="icon-btn"
                      onClick={() => {
                        // پیام REMOVE_CART_MESSAGE در فایل messages.ts از
                        // قبل تعریف شده بود ولی هیچ‌جای کد صدایش نمی‌زد؛
                        // این‌جا واقعا در لحظه حذف محصول از سبد نشان داده
                        // می‌شود.
                        removeItem(item.product_id);
                        toast(getMessage("REMOVE_CART_MESSAGE", language));
                      }}
                      title={t("removeAction", language)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              className="outline-btn"
              onClick={clearCart}
            >
              {t("clearCartButton", language)}
            </button>
          </div>

          <aside className="cart-summary">
            <h2>{t("totalItemsLabel", language).replace("{n}", String(getTotalItems()))}</h2>

            <div className="cart-summary-row">
              <span>{t("subtotalLabel", language)}</span>
              <span>{format(getSubtotal())}</span>
            </div>

            {getDiscountAmount() > 0 && (
              <div className="cart-summary-row" style={{ color: "var(--danger)" }}>
                <span>{t("discountLabel", language)}</span>
                <span>-{format(getDiscountAmount())}</span>
              </div>
            )}

            <div className="cart-summary-row cart-summary-total">
              <span>{t("finalAmountLabel", language)}</span>
              <span>{format(getTotal())}</span>
            </div>

            <div className="home-links">
              <Link href="/" className="secondary-btn">
                {t("continueShoppingButton", language)}
              </Link>

              <Link href="/site/checkout" className="primary-btn">
                {t("checkoutButton", language)}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

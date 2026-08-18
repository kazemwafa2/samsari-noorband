"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { OrderTracker } from "@/components/order/OrderTracker";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { useCurrency } from "@/lib/currency";

// OrderTracker قبلا در پروژه کامل ساخته شده بود (با اتصال واقعی به
// order_status_history) ولی هیچ‌جا استفاده نمی‌شد؛ این صفحه فقط متن
// ساده وضعیت را نشان می‌داد، بدون خط‌زمانی واقعی سفارش.
export default function OrderDetailPage() {
  const supabase = createClient();
  const params = useParams();
  const id = params.id as string;
  const { language } = useLanguage();
  const { format } = useCurrency();

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrder() {
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (orderError) {
      console.log(orderError);
      setLoading(false);
      return;
    }

    setOrder(orderData);

    const { data: itemData, error: itemError } = await supabase
      .from("order_items")
      .select("id, quantity, price, product_id")
      .eq("order_id", id);

    if (itemError) {
      console.log(itemError);
    } else {
      setItems(itemData || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrder();
  }, []);

  // مطابق همان واژگان یکپارچه‌شده در OrderTracker.tsx و پنل مدیریت
  function statusLabel(status: string) {
    switch (status) {
      case "pending": return t("statusPending", language);
      case "paid": return t("statusPaid", language);
      case "packing": return t("statusPacking", language);
      case "shipping": return t("statusShipping", language);
      case "completed": return t("statusCompleted", language);
      case "cancelled": return t("statusCancelled", language);
      case "returned": return t("statusReturned", language);
      default: return status;
    }
  }

  if (loading) {
    return (
      <main className="home-page">
        <h1>{t("fetchingOrderDetailsText", language)}</h1>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="home-page">
        <h1>{t("orderNotFoundTitle", language)}</h1>
      </main>
    );
  }

  return (
    <main className="home-page">
      <h1 className="section-title">{t("orderDetailsPageTitle", language)}</h1>

      <div className="card">
        <p>{t("orderCodeLabel", language)}: {order.id}</p>
        <p>{t("totalAmountLabel", language)}: {format(Number(order.total_price))}</p>
        <p>{t("discountLabel", language)}: {format(Number(order.discount_price))}</p>
        <p>{t("paymentStatusLabel", language)}: {order.payment_status === "paid" ? t("statusPaid", language) : t("statusPending", language)}</p>
        <p>{t("orderStatusLabel", language)}: {statusLabel(order.order_status || order.status)}</p>
        <p>
          {t("dateLabel", language)}:{" "}
          {new Date(order.created_at).toLocaleDateString(language === "en" ? "en-US" : "fa-AF")}
        </p>
        <p>
          <Link href={`/orders/${order.id}/invoice`}>{t("viewDownloadInvoiceLink", language)}</Link>
        </p>
      </div>

      <OrderTracker orderId={order.id} />

      <h2>{t("orderProductsTitle", language)}</h2>

      {items.length === 0 ? (
        <div className="card">{t("noItemsRegisteredText", language)}</div>
      ) : (
        items.map((item) => (
          <div key={item.id} className="card">
            <p>{t("productIdLabel", language)}: {item.product_id}</p>
            <p>{t("quantityLabel", language)}: {item.quantity}</p>
            <p>{t("priceLabel", language)}: {format(Number(item.price))}</p>
          </div>
        ))
      )}

      <Link href="/site/orders" className="primary-btn">
        {t("backToOrdersLink", language)}
      </Link>
    </main>
  );
}

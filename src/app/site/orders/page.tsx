"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { useCurrency } from "@/lib/currency";

export default function OrdersPage() {
  const supabase = createClient();
  const { language } = useLanguage();
  const { format } = useCurrency();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select("id, total_price, discount_price, payment_status, order_status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setOrders(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="home-page">
        <h1>{t("fetchingOrdersText", language)}</h1>
      </main>
    );
  }

  return (
    <main className="home-page">
      <h1 className="section-title">{t("myOrdersPageTitle", language)}</h1>

      {orders.length === 0 ? (
        <div className="card">
          <h2>{t("noOrdersYetTitle", language)}</h2>

          <Link href="/products" className="primary-btn">
            {t("viewProductsLink", language)}
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card">
            <h2>{t("orderCardTitle", language)}</h2>

            <p>{t("orderCodeLabel", language)}: {order.id}</p>
            <p>{t("amountLabel", language)}: {format(Number(order.total_price))}</p>
            <p>{t("paymentStatusLabel", language)}: {order.payment_status}</p>
            <p>{t("orderStatusLabel", language)}: {order.order_status}</p>
            <p>
              {t("dateLabel", language)}:{" "}
              {new Date(order.created_at).toLocaleDateString(language === "en" ? "en-US" : "fa-AF")}
            </p>

            <Link href={`/site/orders/${order.id}`} className="primary-btn">
              {t("viewDetailsLink", language)}
            </Link>
          </div>
        ))
      )}
    </main>
  );
}

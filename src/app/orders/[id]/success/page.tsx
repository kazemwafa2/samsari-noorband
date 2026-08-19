"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";

export default function OrderSuccessPage() {
  const supabase = createClient();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params?.id as string;
  const { language } = useLanguage();

  // api/payment/callback بعد از تایید/رد پرداخت زرین‌پال کاربر را با
  // ?payment=ok یا ?payment=failed به همین صفحه هدایت می‌کند — قبلا
  // این صفحه اصلا به این پارامتر نگاه نمی‌کرد، یعنی حتی سفارش‌هایی که
  // پرداختشان واقعا رد شده بود هم همین پیام «موفقیت» عمومی را می‌دیدند.
  const paymentResult = searchParams.get("payment");

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) load();
  }, [orderId]);

  async function load() {
    const { data } = await supabase
      .from("orders")
      .select("order_number, delivery_code, payment_method, payment_status")
      .eq("id", orderId)
      .single();

    setOrder(data);
  }

  // پرداخت آنلاین رد/ناموفق بوده — قبلا چنین حالتی اصلا در نظر گرفته
  // نشده بود و همین صفحه «موفقیت» عمومی نشان داده می‌شد.
  if (paymentResult === "failed") {
    return (
      <main className="home-page">
        <div className="glass rounded-3xl p-8 text-center space-y-6">
          <h1 className="text-4xl">❌</h1>

          <h2 className="section-title">{t("paymentFailedTitle", language)}</h2>

          <p>
            {t("paymentFailedText", language)}
          </p>

          <p>{t("orderCodeColonLabel", language)}</p>

          <div className="text-xl font-bold bg-white/10 p-4 rounded-2xl">
            {order?.order_number || orderId}
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href={`/site/payment?order_id=${orderId}`} className="primary-btn">
              {t("retryPaymentButton", language)}
            </Link>

            <Link href="/site/orders" className="primary-btn">
              {t("myOrdersLinkShort", language)}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="home-page">
      <div className="glass rounded-3xl p-8 text-center space-y-6">
        <div className="order-success-icon">
          <span className="order-success-emoji">✅</span>
          <span className="order-success-sparkles" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>

        <h2 className="section-title">{t("orderPlacedSuccessTitle", language)}</h2>

        <p>{t("thanksForPurchaseText", language)} 🌷💖</p>

        {order?.payment_method === "online" && paymentResult === "ok" && (
          <p style={{ color: "#22c55e" }}>{t("paymentConfirmedText", language)}</p>
        )}

        {order?.payment_method === "cod" && (
          <p>{t("codOrderConfirmedText", language)}</p>
        )}

        <p>{t("orderCodeColonLabel", language)}</p>

        <div className="text-xl font-bold bg-white/10 p-4 rounded-2xl">
          {order?.order_number || orderId}
        </div>

        {order?.delivery_code && (
          <>
            <p>
              {t("deliveryCodeInstructions", language)}
            </p>

            <div
              className="text-3xl font-bold bg-white/10 p-4 rounded-2xl"
              style={{ letterSpacing: "8px", color: "#8B5CF6" }}
            >
              {order.delivery_code}
            </div>
          </>
        )}

        <p>{t("orderWillBeShippedText", language)}</p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/" className="primary-btn">
            {t("backToHomeLink", language)}
          </Link>

          <Link href="/site/orders" className="primary-btn">
            {t("myOrdersLinkShort", language)}
          </Link>
        </div>
      </div>
    </main>
  );
}

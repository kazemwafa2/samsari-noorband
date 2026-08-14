"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";

// این صفحه سفارش را از طریق ?order_id در URL می‌گیرد (مثلا از صفحه
// جزئیات سفارش یا از انتهای checkout به اینجا هدایت می‌شوی) و درخواست
// پرداخت واقعی را از /api/payment می‌زند.

export default function Payment() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    if (!orderId) {
      setError("شماره سفارش مشخص نیست.");
      return;
    }

    setLoading(true);
    setError("");

    const response = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId }),
    });

    const result = await response.json();

    setLoading(false);

    if (!result.success) {
      setError(result.error || "خطا در اتصال به درگاه پرداخت.");
      return;
    }

    window.location.href = result.payment_url;
  }

  return (
    <main className="min-h-screen center">
      <div className="glass-card">
        <h1 className="section-title">💳 پرداخت سفارش</h1>

        {!orderId && (
          <p style={{ color: "red" }}>
            شماره سفارش پیدا نشد. از صفحه سفارش خود دوباره وارد شوید.
          </p>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="primary-btn" onClick={handlePay} disabled={loading || !orderId}>
          {loading ? <LoaderCircle className="loading" /> : "پرداخت و انتقال به درگاه"}
        </button>
      </div>
    </main>
  );
}

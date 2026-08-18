"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

// جریان کاری که کاربر خواسته بود: موقع تحویل، مأمور تحویل کد ۴ رقمی
// را از مشتری می‌گیرد، همان‌جا داخل سایت وارد می‌کند، و سایت خودش کد
// را با کد واقعی سفارش (delivery_code، که موقع ساخت سفارش خودکار
// تولید و روی فاکتور مشتری چاپ می‌شود) می‌سنجد. اگر درست بود، تحویل
// ثبت می‌شود (وضعیت سفارش، تاریخچه، و اعلان برای مشتری) — همه از طریق
// تابع امن verify_delivery_code در دیتابیس (db/schema.sql).

interface OrderResult {
  id: number;
  order_number: string | null;
  status: string;
  address: string | null;
  phone: string | null;
  delivery_code_verified: boolean;
}

export default function CourierPanel() {
  const supabase = createClient();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [code, setCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setMessage(null);
    setOrder(null);

    // نکته اصلاح‌شده: قبلا اینجا مستقیم از جدول orders می‌خواندیم که
    // RLS فقط سفارش‌های در وضعیت «shipping» را نشان می‌داد — یعنی هر
    // سفارشی که هنوز به آن مرحله نرسیده بود، اشتباهاً «پیدا نشد» نشان
    // داده می‌شد. حالا از تابع امن courier_search_order استفاده می‌شود
    // که هر سفارشی را با شماره‌ی دقیق پیدا می‌کند.
    const { data, error } = await supabase.rpc("courier_search_order", {
      p_query: query.trim(),
    });

    setSearching(false);

    const found = Array.isArray(data) ? data[0] : data;

    if (error || !found) {
      setMessage({ type: "error", text: "سفارشی با این شماره پیدا نشد." });
      return;
    }

    setOrder(found as OrderResult);
  }

  async function verify() {
    if (!order || !code.trim()) return;

    setVerifying(true);
    setMessage(null);

    const { data, error } = await supabase.rpc("verify_delivery_code", {
      p_order_id: order.id,
      p_code: code.trim(),
    });

    setVerifying(false);

    if (error) {
      setMessage({ type: "error", text: "خطا در بررسی کد: " + error.message });
      return;
    }

    if (data === true) {
      setMessage({ type: "success", text: "✅ تحویل با موفقیت ثبت شد." });
      setOrder({ ...order, status: "completed", delivery_code_verified: true });
      setCode("");
    } else {
      setMessage({ type: "error", text: "❌ کد وارد‌شده درست نیست. دوباره از مشتری بپرسید." });
    }
  }

  async function handleLogout() {
    await signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="home-page space-y-6" style={{ maxWidth: 480, margin: "0 auto" }}>
      <div className="flex items-center justify-between">
        <h1 className="section-title">🛵 پنل مأمور تحویل</h1>
        <button className="outline-btn" onClick={handleLogout} type="button">
          خروج
        </button>
      </div>

      <form onSubmit={search} className="glass-card space-y-3">
        <label>شماره سفارش را وارد کنید:</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="مثلا SMS-260815-9793 یا شناسه سفارش"
        />
        <button className="primary-btn" type="submit" disabled={searching}>
          {searching ? "در حال جستجو..." : "جستجوی سفارش"}
        </button>
      </form>

      {order && (
        <div className="glass-card space-y-3">
          <p>سفارش: #{order.order_number || order.id}</p>
          <p>آدرس: {order.address || "—"}</p>
          <p>تلفن مشتری: {order.phone || "—"}</p>
          <p>
            وضعیت فعلی:{" "}
            <strong>{order.status === "completed" ? "تحویل داده شده" : order.status}</strong>
          </p>

          {order.delivery_code_verified ? (
            <p style={{ color: "#22C55E", fontWeight: 700 }}>
              ✅ این سفارش قبلا تحویل داده شده.
            </p>
          ) : (
            <>
              <label>کد تحویل ۴ رقمی را از مشتری بگیرید و اینجا وارد کنید:</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="مثلا 5159"
                style={{ fontSize: 22, textAlign: "center", letterSpacing: 6 }}
              />
              <button
                className="primary-btn"
                onClick={verify}
                disabled={verifying || code.length !== 4}
                type="button"
              >
                {verifying ? "در حال بررسی..." : "تایید تحویل"}
              </button>
            </>
          )}
        </div>
      )}

      {message && (
        <p style={{ color: message.type === "error" ? "#EF4444" : "#22C55E", fontWeight: 700 }}>
          {message.text}
        </p>
      )}
    </main>
  );
}

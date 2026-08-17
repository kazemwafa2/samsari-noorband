"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import { logAction } from "@/lib/audit";

// دقیقا مطابق درخواست: به‌جای یک <select> خام، هر مرحله یک دکمه‌ی
// تایید مجزا با برچسب فارسی دارد و قبل از اعمال، تاییدیه می‌گیرد. بعد
// از هر تغییر وضعیت، هم در order_status_history ثبت می‌شود و هم یک
// اعلان واقعی برای مشتری (notifications) ساخته می‌شود — یعنی کاربر از
// طریق اعلان‌ها از تغییر وضعیت باخبر می‌شود.
const STATUS_STEPS: { value: string; label: string; icon: string }[] = [
  { value: "paid", label: "تایید پرداخت", icon: "💳" },
  { value: "packing", label: "آماده‌سازی سفارش", icon: "📦" },
  { value: "shipping", label: "تایید ارسال", icon: "🚚" },
  { value: "completed", label: "تایید تحویل نهایی", icon: "✅" },
];

const STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار بررسی",
  paid: "پرداخت تایید شده",
  packing: "در حال آماده‌سازی",
  shipping: "ارسال شده",
  completed: "تحویل داده شده",
  cancelled: "لغو شده",
  returned: "مرجوع شده",
};

const NOTIFICATION_MESSAGES: Record<string, string> = {
  paid: "پرداخت سفارش شما تایید شد.",
  packing: "سفارش شما در حال آماده‌سازی است.",
  shipping: "سفارش شما ارسال شد 🚚",
  completed: "سفارش شما با موفقیت تحویل داده شد 💗",
  cancelled: "متاسفانه سفارش شما لغو شد.",
  returned: "سفارش شما به‌عنوان مرجوعی ثبت شد.",
};

export default function OrderDetail() {
  const supabase = createClient();
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  async function loadOrder() {
    setLoading(true);

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (orderError || !orderData) {
      setOrder(null);
      setLoading(false);
      return;
    }

    setOrder(orderData);

    const { data: itemsData } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    setItems(itemsData || []);

    const { data: historyData } = await supabase
      .from("order_status_history")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: false });

    setHistory(historyData || []);
    setLoading(false);
  }

  async function updateStatus(newStatus: string, label: string) {
    if (!window.confirm(`${label} برای این سفارش ثبت شود؟`)) return;

    setSaving(true);
    setErrorMsg("");

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, order_status: newStatus })
      .eq("id", id);

    if (error) {
      setSaving(false);
      setErrorMsg("تغییر وضعیت با خطا مواجه شد: " + error.message);
      return;
    }

    // ثبت در تاریخچه — تا هم ادمین بعدا بتواند روند سفارش را ببیند و
    // هم برای مشتری (src/app/site/orders/[id]) قابل نمایش باشد
    const { data: userResult } = await supabase.auth.getUser();
    await supabase.from("order_status_history").insert({
      order_id: Number(id),
      status: newStatus,
      changed_by: userResult.user?.id || null,
    });

    // اعلان واقعی برای مشتری — دقیقا همان چیزی که خواسته شده بود:
    // «این وضعیت‌ها برای کاربر از طریق اعلان‌ها اعلان شود»
    if (order?.user_id) {
      await supabase.from("notifications").insert({
        user_id: order.user_id,
        title: `سفارش #${order.order_number || order.id}`,
        message: NOTIFICATION_MESSAGES[newStatus] || `وضعیت سفارش شما به «${STATUS_LABELS[newStatus] || newStatus}» تغییر کرد.`,
        type: "order",
        link: `/site/orders/${id}`,
      });
    }

    setSaving(false);
    setOrder((prev: any) => ({ ...prev, status: newStatus, order_status: newStatus }));
    logAction("update_status", "order", id, { newStatus });
    loadOrder();
  }

  async function cancelOrder() {
    if (!window.confirm("این سفارش کاملا لغو شود؟ این عملیات قابل بازگشت نیست.")) return;
    await updateStatus("cancelled", "لغو سفارش");
  }

  if (loading) {
    return (
      <main className="home-page">
        <p>در حال بارگذاری...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="home-page">
        <h1 className="section-title">سفارش پیدا نشد</h1>
      </main>
    );
  }

  const currentStatus = order.status || order.order_status || "pending";
  const isFinal = currentStatus === "completed" || currentStatus === "cancelled" || currentStatus === "returned";

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">
        📦 سفارش #{order.order_number || order.id}
      </h1>

      <div className="glass-card space-y-3">
        <p>مبلغ کل: {Number(order.total_amount ?? order.total ?? 0).toLocaleString("fa-AF")} افغانی</p>
        <p>آدرس: {order.address || "—"}</p>
        <p>تلفن: {order.phone || "—"}</p>
        <p>کد تحویل: {order.delivery_code || "—"} {order.delivery_code_verified && "✅ تایید شده"}</p>
        <p>
          وضعیت فعلی: <strong>{STATUS_LABELS[currentStatus] || currentStatus}</strong>
        </p>

        {errorMsg && <p style={{ color: "#EF4444" }}>{errorMsg}</p>}

        {!isFinal && (
          <div className="flex flex-wrap gap-2">
            {STATUS_STEPS.filter((s) => s.value !== currentStatus).map((step) => (
              <button
                key={step.value}
                className="primary-btn"
                disabled={saving}
                onClick={() => updateStatus(step.value, step.label)}
                type="button"
              >
                {step.icon} {step.label}
              </button>
            ))}

            <button
              className="outline-btn"
              disabled={saving}
              onClick={cancelOrder}
              type="button"
              style={{ borderColor: "#EF4444", color: "#EF4444" }}
            >
              ❌ لغو سفارش
            </button>
          </div>
        )}

        <Link href={`/orders/${id}/invoice`} className="primary-btn">
          🧾 مشاهده / دانلود فاکتور
        </Link>
      </div>

      {history.length > 0 && (
        <div className="glass-card space-y-2">
          <h2>📜 تاریخچه وضعیت</h2>
          {history.map((h) => (
            <p key={h.id} style={{ fontSize: 13, color: "#6B7280" }}>
              {STATUS_LABELS[h.status] || h.status} — {new Date(h.created_at).toLocaleString("fa-IR")}
            </p>
          ))}
        </div>
      )}

      <h2>اقلام سفارش</h2>

      {items.length === 0 && <p>آیتمی برای این سفارش ثبت نشده.</p>}

      {items.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>محصول</th>
              <th>تعداد</th>
              <th>قیمت واحد</th>
              <th>جمع</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>{Number(item.final_price || 0).toLocaleString("fa-AF")}</td>
                <td>{Number(item.total_price || 0).toLocaleString("fa-AF")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import { logAction } from "@/lib/audit";

const STATUS_OPTIONS = [
  "pending",
  "paid",
  "packing",
  "shipping",
  "completed",
  "cancelled",
  "returned",
];

export default function OrderDetail() {
  const supabase = createClient();
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    setLoading(false);
  }

  async function updateStatus(newStatus: string) {
    setSaving(true);

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert("تغییر وضعیت با خطا مواجه شد.");
      return;
    }

    setOrder((prev: any) => ({ ...prev, status: newStatus }));
    logAction("update_status", "order", id, { newStatus });
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

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">
        📦 سفارش #{order.order_number || order.id}
      </h1>

      <div className="glass-card">
        <p>مبلغ کل: {Number(order.total_amount ?? order.total ?? 0).toLocaleString("fa-AF")} افغانی</p>
        <p>آدرس: {order.address || "—"}</p>
        <p>تلفن: {order.phone || "—"}</p>

        <div>
          <label>وضعیت سفارش: </label>
          <select
            value={order.status}
            disabled={saving}
            onChange={(e) => updateStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <Link href={`/orders/${id}/invoice`} className="primary-btn">
          🧾 مشاهده / دانلود فاکتور
        </Link>
      </div>

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

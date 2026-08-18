"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

// نکته اصلاح‌شده: قبلا هیچ راهی برای پاک کردن سفارش‌های تستی/الکی از
// پنل وجود نداشت. حالا هر ردیف چک‌باکس دارد + دکمه حذف تکی، و یک دکمه
// «حذف انتخاب‌شده‌ها» برای پاک‌سازی گروهی. حذف فقط برای admin/super_admin
// مجاز است (RLS: orders_delete_admin_only در db/schema.sql).

export default function Orders() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("DASHBOARD ORDERS ERROR:", error);
      setErrorMsg(error.message);
    }

    setOrders(data || []);
    setSelected([]);
    setLoading(false);
  }

  function toggleSelect(id: number) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleSelectAll() {
    setSelected((prev) => (prev.length === orders.length ? [] : orders.map((o) => o.id)));
  }

  async function deleteOne(id: number) {
    if (!window.confirm("این سفارش کاملاً و برای همیشه حذف شود؟ این عملیات قابل بازگشت نیست.")) return;
    await deleteIds([id]);
  }

  async function deleteSelected() {
    if (selected.length === 0) return;
    if (!window.confirm(`${selected.length} سفارش انتخاب‌شده کاملاً حذف شوند؟ این عملیات قابل بازگشت نیست.`)) return;
    await deleteIds(selected);
  }

  async function deleteIds(ids: number[]) {
    setDeleting(true);

    const { error } = await supabase.from("orders").delete().in("id", ids);

    setDeleting(false);

    if (error) {
      alert("حذف با خطا مواجه شد: " + error.message);
      return;
    }

    loadOrders();
  }

  return (
    <main className="home-page space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="section-title">📦 مدیریت سفارشات</h1>

        {selected.length > 0 && (
          <button className="outline-btn" style={{ borderColor: "#EF4444", color: "#EF4444" }} onClick={deleteSelected} disabled={deleting}>
            <Trash2 size={16} /> حذف {selected.length} سفارش انتخاب‌شده
          </button>
        )}
      </div>

      {loading && <p>در حال بارگذاری...</p>}

      {!loading && errorMsg && <p style={{ color: "#EF4444" }}>خطا: {errorMsg}</p>}

      {!loading && !errorMsg && orders.length === 0 && <p>هنوز سفارشی ثبت نشده است.</p>}

      {!loading && orders.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" checked={selected.length === orders.length} onChange={toggleSelectAll} />
              </th>
              <th>شماره سفارش</th>
              <th>مبلغ کل</th>
              <th>وضعیت</th>
              <th>تاریخ ثبت</th>
              <th>عملیات</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(order.id)}
                    onChange={() => toggleSelect(order.id)}
                  />
                </td>
                <td>{order.order_number || order.id}</td>
                <td>
                  {Number(
                    order.total_amount ?? order.total ?? 0
                  ).toLocaleString("fa-AF")}{" "}
                  افغانی
                </td>
                <td>{order.status || "—"}</td>
                <td>
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString("fa-AF")
                    : "—"}
                </td>
                <td className="flex items-center gap-3">
                  <Link href={`/dashboard/orders/${order.id}`}>مشاهده</Link>
                  <button
                    type="button"
                    className="icon-btn"
                    title="حذف این سفارش"
                    onClick={() => deleteOne(order.id)}
                    disabled={deleting}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

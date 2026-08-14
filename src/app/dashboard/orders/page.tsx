"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

// توجه: چون در پروژه هیچ فایل SQL/migration‌ای برای جدول orders پیدا نشد،
// این صفحه با select("*") کار می‌کند و ستون‌ها را به‌صورت پویا نمایش می‌دهد
// تا مطمئن باشیم با اسکیمای واقعی دیتابیس شما هماهنگ است. اگر می‌خواهی
// ستون‌های دقیق (مثل status_id با join به جدول statuses) نمایش داده شود،
// باید select را بر اساس نام واقعی ستون‌ها در Supabase خودت تنظیم کنی.

export default function Orders() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("DASHBOARD ORDERS ERROR:", error);
    }

    setOrders(data || []);
    setLoading(false);
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">📦 مدیریت سفارشات</h1>

      {loading && <p>در حال بارگذاری...</p>}

      {!loading && orders.length === 0 && <p>هنوز سفارشی ثبت نشده است.</p>}

      {!loading && orders.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
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
                <td>
                  <Link href={`/dashboard/orders/${order.id}`}>مشاهده</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

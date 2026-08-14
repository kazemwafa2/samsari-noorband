"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Reports() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [rawOrders, setRawOrders] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    paidOrders: 0,
    cancelledOrders: 0,
    topProducts: [] as { title: string; qty: number }[],
  });

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    setLoading(true);

    const { data: orders } = await supabase.from("orders").select("*");
    setRawOrders(orders || []);

    const totalOrders = orders?.length || 0;
    const totalRevenue = (orders || []).reduce(
      (sum: number, o: any) => sum + Number(o.total_amount ?? o.total ?? 0),
      0
    );
    const paidOrders = (orders || []).filter((o: any) => o.status === "paid" || o.status === "completed").length;
    const cancelledOrders = (orders || []).filter((o: any) => o.status === "cancelled").length;

    const { data: items } = await supabase.from("order_items").select("product_name, quantity");

    const productMap: Record<string, number> = {};
    (items || []).forEach((item: any) => {
      productMap[item.product_name] = (productMap[item.product_name] || 0) + item.quantity;
    });

    const topProducts = Object.entries(productMap)
      .map(([title, qty]) => ({ title, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    setSummary({ totalOrders, totalRevenue, paidOrders, cancelledOrders, topProducts });
    setLoading(false);
  }

  async function exportExcel() {
    // xlsx فقط سمت کلاینت import می‌شود
    const XLSX = await import("xlsx");

    const rows = rawOrders.map((o) => ({
      "شماره سفارش": o.order_number || o.id,
      "مبلغ کل": o.total_amount ?? o.total ?? 0,
      وضعیت: o.status,
      تاریخ: o.created_at,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "سفارشات");
    XLSX.writeFile(workbook, `noorband-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  if (loading) {
    return (
      <main className="home-page">
        <p>در حال بارگذاری گزارشات...</p>
      </main>
    );
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">📊 گزارشات سایت</h1>

      <button className="primary-btn" onClick={exportExcel}>
        📥 خروجی Excel سفارشات
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card">
          <p>کل سفارشات</p>
          <h2>{summary.totalOrders}</h2>
        </div>
        <div className="glass-card">
          <p>درآمد کل</p>
          <h2>{summary.totalRevenue.toLocaleString("fa-AF")} افغانی</h2>
        </div>
        <div className="glass-card">
          <p>سفارشات پرداخت‌شده</p>
          <h2>{summary.paidOrders}</h2>
        </div>
        <div className="glass-card">
          <p>سفارشات لغوشده</p>
          <h2>{summary.cancelledOrders}</h2>
        </div>
      </div>

      <h2>پرفروش‌ترین محصولات</h2>

      {summary.topProducts.length === 0 && <p>داده‌ای برای نمایش وجود ندارد.</p>}

      {summary.topProducts.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>محصول</th>
              <th>تعداد فروش</th>
            </tr>
          </thead>
          <tbody>
            {summary.topProducts.map((p) => (
              <tr key={p.title}>
                <td>{p.title}</td>
                <td>{p.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

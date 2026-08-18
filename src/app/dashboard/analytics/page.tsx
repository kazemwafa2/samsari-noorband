"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Analytics() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [todayViews, setTodayViews] = useState(0);
  const [topPages, setTopPages] = useState<{ path: string; count: number }[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const { count: total } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count: today } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString());

    const { data: recentViews } = await supabase
      .from("page_views")
      .select("path")
      .order("created_at", { ascending: false })
      .limit(1000);

    const counts: Record<string, number> = {};
    (recentViews || []).forEach((v: any) => {
      counts[v.path] = (counts[v.path] || 0) + 1;
    });

    const top = Object.entries(counts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setTotalViews(total || 0);
    setTodayViews(today || 0);
    setTopPages(top);
    setLoading(false);
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">📈 آمار بازدید سایت</h1>

      {loading && <p>در حال بارگذاری...</p>}

      {!loading && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card">
              <p>کل بازدیدها</p>
              <h2>{totalViews.toLocaleString("fa-IR")}</h2>
            </div>
            <div className="glass-card">
              <p>بازدید امروز</p>
              <h2>{todayViews.toLocaleString("fa-IR")}</h2>
            </div>
          </div>

          <h2>پربازدیدترین صفحات (۱۰۰۰ بازدید اخیر)</h2>

          {topPages.length === 0 && <p>هنوز داده‌ای ثبت نشده.</p>}

          {topPages.length > 0 && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>مسیر</th>
                  <th>تعداد بازدید</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((p) => (
                  <tr key={p.path}>
                    <td>{p.path}</td>
                    <td>{p.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </main>
  );
}

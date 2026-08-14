"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// این صفحه از جدول site_settings (یک ردیف با id=1) استفاده می‌کند.
// ساختار جدول در db/schema.sql تعریف شده. اگر جدول را نساخته‌ای،
// اول migration را اجرا کن.

export default function ProductSetting() {
  const supabase = createClient();
  const [siteName, setSiteName] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [maintenanceEndsAt, setMaintenanceEndsAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();

    if (data) {
      setSiteName(data.site_name || "");
      setLowStockThreshold(String(data.low_stock_threshold ?? 5));
      setMaintenanceMode(!!data.maintenance_mode);
      setMaintenanceMessage(data.maintenance_message || "");
      setMaintenanceEndsAt(data.maintenance_ends_at ? data.maintenance_ends_at.slice(0, 16) : "");
    }

    setLoading(false);
  }

  async function save() {
    setSaving(true);

    const { error } = await supabase.from("site_settings").upsert({
      id: 1,
      site_name: siteName,
      low_stock_threshold: Number(lowStockThreshold),
      maintenance_mode: maintenanceMode,
      maintenance_message: maintenanceMessage,
      maintenance_ends_at: maintenanceEndsAt || null,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (error) alert("ذخیره با خطا مواجه شد: " + error.message);
    else alert("تنظیمات ذخیره شد.");
  }

  if (loading) return <main className="home-page"><p>در حال بارگذاری...</p></main>;

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">⚙️ تنظیمات عمومی و محصولات</h1>

      <div>
        <label>نام سایت</label>
        <input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
      </div>

      <div>
        <label>حد آستانه موجودی کم (هشدار)</label>
        <input
          type="number"
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(e.target.value)}
        />
      </div>

      <div className="flex">
        <label>
          <input
            type="checkbox"
            checked={maintenanceMode}
            onChange={(e) => setMaintenanceMode(e.target.checked)}
          />
          حالت تعمیر و نگهداری (سایت فقط برای ادمین در دسترس باشد)
        </label>
      </div>

      {maintenanceMode && (
        <div>
          <label>پیام حالت تعمیر</label>
          <textarea
            value={maintenanceMessage}
            onChange={(e) => setMaintenanceMessage(e.target.value)}
            placeholder="سایت در حال بروزرسانی است، به‌زودی برمی‌گردیم."
          />
        </div>
      )}

      {maintenanceMode && (
        <div>
          <label>زمان تقریبی پایان تعمیر (برای شمارش معکوس)</label>
          <input
            type="datetime-local"
            value={maintenanceEndsAt}
            onChange={(e) => setMaintenanceEndsAt(e.target.value)}
          />
        </div>
      )}

      <button className="primary-btn" onClick={save} disabled={saving}>
        {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </button>
    </main>
  );
}

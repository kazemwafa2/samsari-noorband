"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// نکته امنیتی مهم: کلید درگاه پرداخت (ZARINPAL_MERCHANT_ID) هرگز اینجا
// یا در دیتابیس ذخیره نمی‌شود، چون این صفحه سمت کلاینت اجرا می‌شود و هر
// چیزی که در دیتابیس عمومی بگذاری قابل خواندن است. کلید واقعی همیشه در
// .env.local (سمت سرور) می‌ماند. این صفحه فقط تنظیمات غیرمحرمانه را مدیریت می‌کند.

export default function PaymentSetting() {
  const supabase = createClient();
  const [codEnabled, setCodEnabled] = useState(false);
  const [minOrderAmount, setMinOrderAmount] = useState("0");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();

    if (data) {
      setCodEnabled(!!data.cod_enabled);
      setMinOrderAmount(String(data.min_order_amount ?? 0));
    }

    setLoading(false);
  }

  async function save() {
    setSaving(true);

    const { error } = await supabase.from("site_settings").upsert({
      id: 1,
      cod_enabled: codEnabled,
      min_order_amount: Number(minOrderAmount),
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (error) alert("ذخیره با خطا مواجه شد: " + error.message);
    else alert("تنظیمات ذخیره شد.");
  }

  if (loading) return <main className="home-page"><p>در حال بارگذاری...</p></main>;

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">💳 تنظیمات پرداخت</h1>

      <div className="glass-card">
        <p>
          درگاه پرداخت زرین‌پال از طریق متغیر <code>ZARINPAL_MERCHANT_ID</code> در{" "}
          <code>.env.local</code> فعال می‌شود (به دلایل امنیتی، کلید را نباید در
          دیتابیس یا این صفحه ذخیره کرد).
        </p>
      </div>

      <div className="flex">
        <label>
          <input
            type="checkbox"
            checked={codEnabled}
            onChange={(e) => setCodEnabled(e.target.checked)}
          />
          پرداخت در محل (نقدی هنگام تحویل) فعال باشد
        </label>
      </div>

      <div>
        <label>حداقل مبلغ سفارش (افغانی)</label>
        <input
          type="number"
          value={minOrderAmount}
          onChange={(e) => setMinOrderAmount(e.target.value)}
        />
      </div>

      <button className="primary-btn" onClick={save} disabled={saving}>
        {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </button>
    </main>
  );
}

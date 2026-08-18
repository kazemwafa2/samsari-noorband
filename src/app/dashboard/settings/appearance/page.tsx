"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSiteSettings, type ThemeSettings } from "@/lib/site-settings";

// دقیقا همان چیزی که خواسته شده بود: «از پنل داخل دکمه تنظیمات سایت
// باید همه سایت را ویرایش کند: رنگ‌ها، گلاس شیشه‌ای، رنگ دکمه‌ها،
// پس‌زمینه دکمه‌ها، پس‌زمینه سایت، نوشته‌ها، حتی اندازه بنرها».
//
// این صفحه در جدول site_settings.theme (ستون jsonb) ذخیره می‌کند و
// ThemeInjector.tsx (که در ریشه‌ی اپ mount شده) همان مقادیر را در
// زمان اجرا با document.documentElement.style.setProperty روی همان
// CSS custom properties که globals.css از قبل همه‌جا استفاده می‌کند
// می‌نویسد — یعنی نیازی به build دوباره نیست و بلافاصله کل سایت را
// تغییر می‌دهد.

const FIELDS: { key: keyof ThemeSettings; label: string; type: "color" | "text" }[] = [
  { key: "primary", label: "رنگ اصلی سایت (دکمه‌ها، آیکون‌های فعال)", type: "color" },
  { key: "secondary", label: "رنگ دوم (گرادیان‌ها)", type: "color" },
  { key: "background", label: "پس‌زمینه کلی سایت", type: "color" },
  { key: "cardBg", label: "پس‌زمینه کارت‌ها", type: "color" },
  { key: "darkText", label: "رنگ نوشته‌های اصلی", type: "color" },
  { key: "btnGradientStart", label: "پس‌زمینه دکمه‌ها — شروع گرادیان", type: "color" },
  { key: "btnGradientEnd", label: "پس‌زمینه دکمه‌ها — پایان گرادیان", type: "color" },
  { key: "btnText", label: "رنگ متن دکمه‌ها", type: "color" },
];

export default function AppearanceSettings() {
  const supabase = createClient();
  const { refresh } = useSiteSettings();

  const [theme, setTheme] = useState<ThemeSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("site_settings")
      .select("theme")
      .eq("id", 1)
      .single();

    if (data?.theme && typeof data.theme === "object") {
      setTheme(data.theme);
    }

    setLoading(false);
  }

  function update(key: keyof ThemeSettings, value: string) {
    setTheme((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);

    const { error } = await supabase.from("site_settings").upsert({
      id: 1,
      theme,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (error) {
      alert("ذخیره با خطا مواجه شد: " + error.message);
      return;
    }

    alert("رنگ‌بندی سایت ذخیره شد و همین الان روی کل سایت اعمال شد.");
    refresh();
  }

  async function resetToDefault() {
    if (!window.confirm("همه رنگ‌ها به حالت پیش‌فرض برگردند؟")) return;
    setTheme({});

    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert({
      id: 1,
      theme: {},
      updated_at: new Date().toISOString(),
    });
    setSaving(false);

    if (!error) {
      alert("رنگ‌بندی به حالت پیش‌فرض برگشت.");
      refresh();
    }
  }

  if (loading) return <main className="home-page"><p>در حال بارگذاری...</p></main>;

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">🎨 تنظیمات ظاهری سایت</h1>
      <p style={{ color: "#6B7280" }}>
        تغییر هر مقدار، بلافاصله بعد از ذخیره روی کل سایت (نه فقط یک صفحه) اعمال می‌شود.
        اگر خانه‌ای را خالی بگذارید، همان رنگ پیش‌فرض سایت باقی می‌ماند.
      </p>

      <div className="glass-card space-y-4">
        {FIELDS.map((field) => (
          <div key={field.key} className="flex items-center gap-3" style={{ justifyContent: "space-between" }}>
            <label>{field.label}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme[field.key] || "#8B5CF6"}
                onChange={(e) => update(field.key, e.target.value)}
                style={{ width: 44, height: 34, padding: 0, border: "none" }}
              />
              <input
                type="text"
                value={theme[field.key] || ""}
                onChange={(e) => update(field.key, e.target.value)}
                placeholder="پیش‌فرض"
                style={{ width: 110 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card space-y-4">
        <h2>شفافیت گلاس شیشه‌ای</h2>
        <p style={{ color: "#6B7280" }}>عددی بین 0 (کاملا شفاف) تا 1 (کاملا مات) — پیش‌فرض حدود 0.55</p>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={theme.glassOpacity ? Number(theme.glassOpacity) : 0.55}
          onChange={(e) => update("glassOpacity", e.target.value)}
        />
        <span>{theme.glassOpacity || "0.55"}</span>
      </div>

      <div className="glass-card space-y-4">
        <h2>اندازه بنر اصلی (Hero)</h2>
        <p style={{ color: "#6B7280" }}>مثلا 340px یا 420px</p>
        <input
          type="text"
          value={theme.heroMinHeight || ""}
          onChange={(e) => update("heroMinHeight", e.target.value)}
          placeholder="340px"
        />
      </div>

      <div className="flex gap-3">
        <button className="primary-btn" onClick={save} disabled={saving}>
          {saving ? "در حال ذخیره..." : "ذخیره و اعمال روی کل سایت"}
        </button>
        <button className="outline-btn" onClick={resetToDefault} disabled={saving} type="button">
          بازگشت به پیش‌فرض
        </button>
      </div>
    </main>
  );
}

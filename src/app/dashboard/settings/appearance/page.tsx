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

// پیش‌فرض‌های آماده‌ی «سبک شیشه» — درخواست کاربر: «این گلاس یخی را
// اضافه کن تا بعدا بتوانم بعدا تم را به این شکل تبدیل کنم، چند تا
// گلاس دیگه هم خودت اضافه کن، حالت شب/روز هر کدام را خودت انتخاب کن».
// هر پیش‌فرض یک ترکیب هماهنگ از رنگ پس‌زمینه/متن/دکمه + گلاس شیشه‌ای
// است، نه فقط رنگ گلاس تنها — چون یک گلاس یخی روی پس‌زمینه‌ی صورتی
// قبلی هماهنگ به‌نظر نمی‌رسید.
interface GlassPreset {
  id: string;
  label: string;
  description: string;
  mode: "light" | "dark";
  swatch: string; // گرادیان برای پیش‌نمایش کارت
  theme: ThemeSettings;
}

const GLASS_PRESETS: GlassPreset[] = [
  {
    id: "ice",
    label: "❄️ شیشه یخی",
    description: "روشن، سرد و بلوری — دقیقا همان سبکی که فرستادید",
    mode: "light",
    swatch: "linear-gradient(135deg,#38BDF8,#0284C7)",
    theme: {
      primary: "#0284C7",
      secondary: "#38BDF8",
      background: "#EFF8FF",
      cardBg: "#FFFFFF",
      darkText: "#0C4A6E",
      btnGradientStart: "#0EA5E9",
      btnGradientEnd: "#38BDF8",
      btnText: "#FFFFFF",
      glassBg: "rgba(224,242,254,.55)",
      glassBorder: "rgba(186,230,253,.8)",
      glassBlur: "26px",
    },
  },
  {
    id: "rose",
    label: "🌸 شیشه صورتی",
    description: "روشن و ملایم — هماهنگ با هدر/بنر صورتی فعلی سایت",
    mode: "light",
    swatch: "linear-gradient(135deg,#F472B6,#EC4899)",
    theme: {
      primary: "#EC4899",
      secondary: "#F472B6",
      background: "#FFF5F8",
      cardBg: "#FFFFFF",
      darkText: "#831843",
      btnGradientStart: "#EC4899",
      btnGradientEnd: "#DB2777",
      btnText: "#FFFFFF",
      glassBg: "rgba(253,242,248,.6)",
      glassBorder: "rgba(251,207,232,.7)",
      glassBlur: "20px",
    },
  },
  {
    id: "gold-night",
    label: "🌙 شیشه طلایی شبانه",
    description: "تیره و لوکس — برای حس گرم و شبانه",
    mode: "dark",
    swatch: "linear-gradient(135deg,#FBBF24,#1C1508)",
    theme: {
      primary: "#F59E0B",
      secondary: "#FBBF24",
      background: "#1C1508",
      cardBg: "#2A2011",
      darkText: "#FDE9C0",
      btnGradientStart: "#F59E0B",
      btnGradientEnd: "#FBBF24",
      btnText: "#1C1508",
      glassBg: "rgba(41,32,15,.55)",
      glassBorder: "rgba(251,191,36,.25)",
      glassBlur: "22px",
    },
  },
  {
    id: "purple-night",
    label: "🌌 شیشه بنفش شبانه",
    description: "تیره و آرام — هماهنگ با رنگ اصلی برند نوربند",
    mode: "dark",
    swatch: "linear-gradient(135deg,#C084FC,#120E1F)",
    theme: {
      primary: "#8B5CF6",
      secondary: "#C084FC",
      background: "#120E1F",
      cardBg: "#1E1830",
      darkText: "#EDE9FE",
      btnGradientStart: "#8B5CF6",
      btnGradientEnd: "#C084FC",
      btnText: "#FFFFFF",
      glassBg: "rgba(30,24,48,.55)",
      glassBorder: "rgba(196,181,253,.2)",
      glassBlur: "22px",
    },
  },
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

  function applyPreset(preset: GlassPreset) {
    setTheme(preset.theme);
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
        <h2>🧊 سبک‌های آماده شیشه</h2>
        <p style={{ color: "#6B7280" }}>
          روی هرکدام بزنید تا همه‌ی رنگ‌ها/گلاس پایین این صفحه با آن هماهنگ شود؛ بعد می‌توانید دستی هم تنظیمشان کنید.
          فقط انتخاب کردن ذخیره نمی‌کند — در آخر «ذخیره و اعمال» را بزنید.
        </p>

        <div className="glass-preset-grid">
          {GLASS_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="glass-preset-card"
              onClick={() => applyPreset(preset)}
            >
              <span className="glass-preset-swatch" style={{ background: preset.swatch }} />
              <strong>{preset.label}</strong>
              <span className="glass-preset-desc">{preset.description}</span>
              <span className="glass-preset-mode">{preset.mode === "dark" ? "🌙 مناسب حالت تاریک" : "☀️ مناسب حالت روشن"}</span>
            </button>
          ))}
        </div>
      </div>

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
        <h2>🧊 تنظیمات دقیق گلاس شیشه‌ای</h2>

        <label>رنگ/شفافیت پس‌زمینه گلاس (مثلا rgba(224,242,254,.55))</label>
        <input
          type="text"
          value={theme.glassBg || ""}
          onChange={(e) => update("glassBg", e.target.value)}
          placeholder="rgba(255,255,255,.55)"
        />

        <label>رنگ حاشیه گلاس (مثلا rgba(186,230,253,.8))</label>
        <input
          type="text"
          value={theme.glassBorder || ""}
          onChange={(e) => update("glassBorder", e.target.value)}
          placeholder="rgba(255,255,255,.35)"
        />

        <label>میزان بلور گلاس (مثلا 22px)</label>
        <input
          type="text"
          value={theme.glassBlur || ""}
          onChange={(e) => update("glassBlur", e.target.value)}
          placeholder="22px"
        />
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

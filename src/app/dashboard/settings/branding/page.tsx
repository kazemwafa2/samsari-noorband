"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useSiteSettings } from "@/lib/site-settings";

// این صفحه دقیقا همان چیزی است که در چک‌لیست خواسته شده بود: «لوگوی
// سایت باید قابل تنظیم و تغییر باشد» و «عکس آدرس دوکان به‌صورت
// روز/شب، از پنل مدیریت». هر سه فایل (لوگو، عکس روز، عکس شب) واقعا
// در Supabase Storage آپلود می‌شوند (jpg/png/svg — همان چیزی که
// input[accept=image/*] پشتیبانی می‌کند) و بلافاصله در کل سایت
// (ناوبار و فوتر) اعمال می‌شوند.

export default function BrandingSettings() {
  const supabase = createClient();
  const { refresh } = useSiteSettings();

  const [logoUrl, setLogoUrl] = useState("");
  const [dayUrl, setDayUrl] = useState("");
  const [nightUrl, setNightUrl] = useState("");
  const [heroUrl, setHeroUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("site_settings")
      .select("logo_url, store_image_day_url, store_image_night_url, hero_image_url")
      .eq("id", 1)
      .single();

    if (data) {
      setLogoUrl(data.logo_url || "");
      setDayUrl(data.store_image_day_url || "");
      setNightUrl(data.store_image_night_url || "");
      setHeroUrl(data.hero_image_url || "");
    }

    setLoading(false);
  }

  async function save() {
    setSaving(true);

    const { error } = await supabase.from("site_settings").upsert({
      id: 1,
      logo_url: logoUrl || null,
      store_image_day_url: dayUrl || null,
      store_image_night_url: nightUrl || null,
      hero_image_url: heroUrl || null,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (error) {
      alert("ذخیره با خطا مواجه شد: " + error.message);
      return;
    }

    alert("تنظیمات برندینگ ذخیره شد.");
    refresh(); // فورا در ناوبار/فوتر همین صفحه هم اعمال شود
  }

  if (loading) return <main className="home-page"><p>در حال بارگذاری...</p></main>;

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">🖼️ برندینگ (لوگو و آدرس دوکان)</h1>

      <div className="glass-card space-y-4">
        <h2>لوگوی سایت</h2>
        <p style={{ color: "#6B7280" }}>
          فرمت‌های jpg، png و svg پشتیبانی می‌شوند. اگر خالی بماند، آیکون پیش‌فرض الماس نمایش داده می‌شود.
        </p>
        <ImageUploader value={logoUrl} onUploaded={setLogoUrl} folder="branding" />
      </div>

      <div className="glass-card space-y-4">
        <h2>🖼️ عکس بنر اصلی (Hero)</h2>
        <p style={{ color: "#6B7280" }}>
          عکسی که کنار متن اسلایدر بالای صفحه اصلی نمایش داده می‌شود (مثلا عکس یک محصول ویژه).
          اگر خالی بماند، یک آیکون ساده جایگزین آن می‌شود.
        </p>
        <ImageUploader value={heroUrl} onUploaded={setHeroUrl} folder="branding" />
      </div>

      <div className="glass-card space-y-4">
        <h2>☀️ عکس آدرس دوکان — حالت روز</h2>
        <ImageUploader value={dayUrl} onUploaded={setDayUrl} folder="branding" />
      </div>

      <div className="glass-card space-y-4">
        <h2>🌙 عکس آدرس دوکان — حالت شب</h2>
        <p style={{ color: "#6B7280" }}>
          اگر خالی بماند، همان عکس حالت روز در شب هم استفاده می‌شود.
        </p>
        <ImageUploader value={nightUrl} onUploaded={setNightUrl} folder="branding" />
      </div>

      <button className="primary-btn" onClick={save} disabled={saving}>
        {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </button>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { VideoUploader } from "@/components/admin/VideoUploader";
import { useSiteSettings } from "@/lib/site-settings";
import { Plus } from "lucide-react";

// این صفحه دقیقا همان چیزی است که در چک‌لیست خواسته شده بود: «لوگوی
// سایت باید قابل تنظیم و تغییر باشد» و «عکس آدرس دوکان به‌صورت
// روز/شب، از پنل مدیریت». هر فایل واقعا در Supabase Storage آپلود
// می‌شود و بلافاصله در کل سایت (ناوبار و فوتر) اعمال می‌شود.
//
// اضافه شد: گالری چند-عکسی آدرس دوکان (قبلا فقط یک عکس روز/شب بود)،
// لینک‌های شبکه‌های اجتماعی + واتساپ (قبلا در کد هارد‌کد بودند)، و
// انتخاب اینکه کدام شبکه به‌صورت بارکد روی فاکتور چاپ شود.

const BARCODE_PLATFORMS = [
  { value: "whatsapp", label: "واتساپ" },
  { value: "facebook", label: "فیسبوک" },
  { value: "instagram", label: "اینستاگرام" },
];

export default function BrandingSettings() {
  const supabase = createClient();
  const { refresh } = useSiteSettings();

  const [logoUrl, setLogoUrl] = useState("");
  const [dayUrl, setDayUrl] = useState("");
  const [nightUrl, setNightUrl] = useState("");
  const [heroUrl, setHeroUrl] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialWhatsapp, setSocialWhatsapp] = useState("");
  const [barcodePlatforms, setBarcodePlatforms] = useState<string[]>(["whatsapp"]);
  const [promoVideoUrl, setPromoVideoUrl] = useState("");
  const [promoVideoEnabled, setPromoVideoEnabled] = useState(false);
  const [promoSocialLink, setPromoSocialLink] = useState("");
  // تشخیص نوع منبع فعلی برای نمایش دکمه‌ی درست انتخاب‌شده هنگام بارگذاری
  const [promoSource, setPromoSource] = useState<"upload" | "link" | "social">("link");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("site_settings")
      .select(
        "logo_url, store_image_day_url, store_image_night_url, hero_image_url, store_gallery_urls, social_facebook, social_instagram, social_whatsapp, invoice_barcode_platforms, promo_video_url, promo_video_enabled, promo_social_link"
      )
      .eq("id", 1)
      .single();

    if (data) {
      setLogoUrl(data.logo_url || "");
      setDayUrl(data.store_image_day_url || "");
      setNightUrl(data.store_image_night_url || "");
      setHeroUrl(data.hero_image_url || "");
      setGallery(Array.isArray(data.store_gallery_urls) ? data.store_gallery_urls : []);
      setSocialFacebook(data.social_facebook || "");
      setSocialInstagram(data.social_instagram || "");
      setSocialWhatsapp(data.social_whatsapp || "");
      setBarcodePlatforms(
        Array.isArray(data.invoice_barcode_platforms) ? data.invoice_barcode_platforms : ["whatsapp"]
      );
      setPromoVideoUrl(data.promo_video_url || "");
      setPromoVideoEnabled(!!data.promo_video_enabled);
      setPromoSocialLink(data.promo_social_link || "");
      // اگر قبلا لینک شبکه اجتماعی تنظیم شده، همان تب باز شود؛ وگرنه
      // اگر لینک ویدیو در باکت videos خودمان بود یعنی آپلودی است
      if (data.promo_social_link) {
        setPromoSource("social");
      } else if (data.promo_video_url && data.promo_video_url.includes("/videos/")) {
        setPromoSource("upload");
      } else {
        setPromoSource("link");
      }
    }

    setLoading(false);
  }

  function toggleBarcodePlatform(value: string) {
    setBarcodePlatforms((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  }

  function updateGalleryItem(index: number, url: string) {
    setGallery((prev) => {
      const next = [...prev];
      if (url) {
        next[index] = url;
      } else {
        next.splice(index, 1);
      }
      return next;
    });
  }

  async function save() {
    setSaving(true);

    const { error } = await supabase.from("site_settings").upsert({
      id: 1,
      logo_url: logoUrl || null,
      store_image_day_url: dayUrl || null,
      store_image_night_url: nightUrl || null,
      hero_image_url: heroUrl || null,
      store_gallery_urls: gallery.filter(Boolean),
      social_facebook: socialFacebook || null,
      social_instagram: socialInstagram || null,
      social_whatsapp: socialWhatsapp || null,
      invoice_barcode_platforms: barcodePlatforms,
      promo_video_url: promoSource === "social" ? null : (promoVideoUrl || null),
      promo_video_enabled: promoVideoEnabled,
      promo_social_link: promoSource === "social" ? (promoSocialLink || null) : null,
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
      <h1 className="section-title">🖼️ برندینگ، تماس و رسانه</h1>

      <div className="glass-card space-y-4">
        <h2>لوگوی سایت</h2>
        <p style={{ color: "#6B7280" }}>
          فرمت‌های jpg، png و svg پشتیبانی می‌شوند. اگر خالی بماند، آیکون پیش‌فرض نمایش داده می‌شود.
          این لوگو همچنین آیکون نصب PWA روی گوشی را هم به‌روز می‌کند.
        </p>
        <ImageUploader value={logoUrl} onUploaded={setLogoUrl} folder="branding" allowRemove />
      </div>

      <div className="glass-card space-y-4">
        <h2>🖼️ عکس بنر اصلی (Hero) — پیش‌فرض سراسری</h2>
        <p style={{ color: "#6B7280" }}>
          اگر یک بنر مشخص (از /dashboard/banners با زون «hero») عکس اختصاصی خودش را داشته باشد،
          همان اولویت دارد؛ این عکس فقط برای بنرهایی است که عکس جداگانه ندارند.
        </p>
        <ImageUploader value={heroUrl} onUploaded={setHeroUrl} folder="branding" allowRemove />
      </div>

      <div className="glass-card space-y-4">
        <h2>☀️ عکس آدرس دوکان — حالت روز</h2>
        <ImageUploader value={dayUrl} onUploaded={setDayUrl} folder="branding" allowRemove />
      </div>

      <div className="glass-card space-y-4">
        <h2>🌙 عکس آدرس دوکان — حالت شب</h2>
        <p style={{ color: "#6B7280" }}>اگر خالی بماند، همان عکس حالت روز در شب هم استفاده می‌شود.</p>
        <ImageUploader value={nightUrl} onUploaded={setNightUrl} folder="branding" allowRemove />
      </div>

      <div className="glass-card space-y-4">
        <h2>📸 گالری چند-عکسی آدرس دوکان</h2>
        <p style={{ color: "#6B7280" }}>
          چند عکس مختلف از دوکان (نمای بیرونی، داخل، تابلو و...) — اولین عکس این گالری در فوتر سایت نمایش داده می‌شود.
        </p>

        {gallery.map((url, index) => (
          <div key={index} className="flex items-center gap-3">
            <ImageUploader
              value={url}
              onUploaded={(newUrl) => updateGalleryItem(index, newUrl)}
              folder="branding"
              allowRemove
            />
          </div>
        ))}

        <button
          type="button"
          className="outline-btn"
          onClick={() => setGallery((prev) => [...prev, ""])}
        >
          <Plus size={16} /> افزودن عکس دیگر
        </button>
      </div>

      <div className="glass-card space-y-4">
        <h2>🔗 لینک‌های شبکه‌های اجتماعی و واتساپ</h2>
        <p style={{ color: "#6B7280" }}>
          این لینک‌ها در فوتر سایت و فاکتورها استفاده می‌شوند. اگر خالی بماند، مقدار پیش‌فرض سایت به کار می‌رود.
        </p>

        <label>لینک فیسبوک</label>
        <input
          type="url"
          value={socialFacebook}
          onChange={(e) => setSocialFacebook(e.target.value)}
          placeholder="https://facebook.com/..."
        />

        <label>لینک اینستاگرام</label>
        <input
          type="url"
          value={socialInstagram}
          onChange={(e) => setSocialInstagram(e.target.value)}
          placeholder="https://instagram.com/..."
        />

        <label>شماره واتساپ (با کد کشور، بدون +)</label>
        <input
          type="text"
          value={socialWhatsapp}
          onChange={(e) => setSocialWhatsapp(e.target.value)}
          placeholder="93765323400"
        />
      </div>

      <div className="glass-card space-y-4">
        <h2>📊 کیوآر کد شبکه‌های اجتماعی روی فاکتور</h2>
        <p style={{ color: "#6B7280" }}>
          کدام شبکه‌ها به‌صورت کیوآر کد (قابل اسکن با دوربین گوشی) روی فاکتور چاپی/دانلودی چاپ شوند؟
        </p>

        {BARCODE_PLATFORMS.map((p) => (
          <label key={p.value} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={barcodePlatforms.includes(p.value)}
              onChange={() => toggleBarcodePlatform(p.value)}
            />
            {p.label}
          </label>
        ))}
      </div>

      <div className="glass-card space-y-4">
        <h2>🎬 ویدیوی تبلیغاتی صفحه اصلی</h2>
        <p style={{ color: "#6B7280" }}>
          سه راه برای تنظیم ویدیوی تبلیغاتی: آپلود مستقیم فایل، لینک ویدیو (یوتیوب/آپارات/mp4)، یا لینک یک پست/ریلز از شبکه اجتماعی.
        </p>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={promoVideoEnabled}
            onChange={(e) => setPromoVideoEnabled(e.target.checked)}
          />
          نمایش ویدیوی تبلیغاتی در صفحه اصلی
        </label>

        <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
          {(
            [
              { value: "upload", label: "📤 آپلود فایل ویدیو" },
              { value: "link", label: "🔗 لینک ویدیو" },
              { value: "social", label: "📱 لینک شبکه اجتماعی" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={promoSource === opt.value ? "primary-btn" : "outline-btn"}
              onClick={() => setPromoSource(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {promoSource === "upload" && (
          <VideoUploader value={promoVideoUrl} onUploaded={setPromoVideoUrl} folder="promo" />
        )}

        {promoSource === "link" && (
          <input
            type="url"
            value={promoVideoUrl}
            onChange={(e) => setPromoVideoUrl(e.target.value)}
            placeholder="https://.../video.mp4 یا لینک امبد یوتیوب/آپارات"
          />
        )}

        {promoSource === "social" && (
          <>
            <p style={{ color: "#6B7280" }}>
              لینک پست/ریلز اینستاگرام یا ویدیوی فیسبوک را وارد کنید. چون این شبکه‌ها معمولا اجازه‌ی پخش مستقیم ویدیو در سایت‌های دیگر را نمی‌دهند، به‌صورت یک کارت قابل‌کلیک که کاربر را به همان شبکه می‌برد نمایش داده می‌شود.
            </p>
            <input
              type="url"
              value={promoSocialLink}
              onChange={(e) => setPromoSocialLink(e.target.value)}
              placeholder="https://instagram.com/reel/... یا https://facebook.com/.../videos/..."
            />
          </>
        )}
      </div>

      <button className="primary-btn" onClick={save} disabled={saving}>
        {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </button>
    </main>
  );
}

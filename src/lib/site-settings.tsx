"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// این Provider برای اطلاعاتی است که قبلا در کد (src/constants/site.ts)
// ثابت بودند ولی باید از پنل مدیریت قابل تغییر باشند: لوگو، عکس(های)
// آدرس دوکان، بنر اصلی، لینک‌های شبکه‌های اجتماعی/واتساپ، ویدیوی
// تبلیغاتی، و تم رنگی سایت. اگر مقدارشان در دیتابیس خالی باشد، سایت از
// مقدار/تصویر پیش‌فرض داخلی استفاده می‌کند — یعنی هیچ‌وقت خراب نمی‌ماند.

export interface ThemeSettings {
  primary?: string;
  secondary?: string;
  background?: string;
  cardBg?: string;
  darkText?: string;
  btnGradientStart?: string;
  btnGradientEnd?: string;
  btnText?: string;
  glassOpacity?: string; // مثلا "0.55" — نسخه قدیمی، هنوز پشتیبانی می‌شود
  heroMinHeight?: string; // مثلا "340px"
  // فیلدهای جدید برای سبک‌های مختلف شیشه (مثلا شیشه یخی) — درخواست
  // کاربر: «این گلاس را روی تنظیمات سایت اضافه کن تا بعدا بتوانم تم و
  // گلاس شیشه‌ای را به این شکل تبدیل کنم»
  glassBg?: string; // مثلا "rgba(224,242,254,.6)"
  glassBorder?: string; // مثلا "rgba(186,230,253,.7)"
  glassBlur?: string; // مثلا "24px"
}

interface SiteSettingsValue {
  logoUrl: string | null;
  storeImageDayUrl: string | null;
  storeImageNightUrl: string | null;
  storeGalleryUrls: string[];
  heroImageUrl: string | null;
  socialFacebook: string | null;
  socialInstagram: string | null;
  socialWhatsapp: string | null;
  invoiceBarcodePlatforms: string[];
  promoVideoUrl: string | null;
  promoVideoEnabled: boolean;
  promoSocialLink: string | null;
  theme: ThemeSettings;
  loading: boolean;
  refresh: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsValue | null>(null);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [storeImageDayUrl, setStoreImageDayUrl] = useState<string | null>(null);
  const [storeImageNightUrl, setStoreImageNightUrl] = useState<string | null>(null);
  const [storeGalleryUrls, setStoreGalleryUrls] = useState<string[]>([]);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [socialFacebook, setSocialFacebook] = useState<string | null>(null);
  const [socialInstagram, setSocialInstagram] = useState<string | null>(null);
  const [socialWhatsapp, setSocialWhatsapp] = useState<string | null>(null);
  const [invoiceBarcodePlatforms, setInvoiceBarcodePlatforms] = useState<string[]>(["whatsapp"]);
  const [promoVideoUrl, setPromoVideoUrl] = useState<string | null>(null);
  const [promoVideoEnabled, setPromoVideoEnabled] = useState(false);
  const [promoSocialLink, setPromoSocialLink] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeSettings>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const { data } = await supabase
      .from("site_settings")
      .select(
        "logo_url, store_image_day_url, store_image_night_url, store_gallery_urls, hero_image_url, social_facebook, social_instagram, social_whatsapp, invoice_barcode_platforms, promo_video_url, promo_video_enabled, promo_social_link, theme"
      )
      .eq("id", 1)
      .single();

    setLogoUrl(data?.logo_url || null);
    setStoreImageDayUrl(data?.store_image_day_url || null);
    setStoreImageNightUrl(data?.store_image_night_url || null);
    setStoreGalleryUrls(Array.isArray(data?.store_gallery_urls) ? data.store_gallery_urls : []);
    setHeroImageUrl(data?.hero_image_url || null);
    setSocialFacebook(data?.social_facebook || null);
    setSocialInstagram(data?.social_instagram || null);
    setSocialWhatsapp(data?.social_whatsapp || null);
    setInvoiceBarcodePlatforms(
      Array.isArray(data?.invoice_barcode_platforms) ? data.invoice_barcode_platforms : ["whatsapp"]
    );
    setPromoVideoUrl(data?.promo_video_url || null);
    setPromoVideoEnabled(!!data?.promo_video_enabled);
    setPromoSocialLink(data?.promo_social_link || null);
    setTheme(data?.theme && typeof data.theme === "object" ? data.theme : {});
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        logoUrl,
        storeImageDayUrl,
        storeImageNightUrl,
        storeGalleryUrls,
        heroImageUrl,
        socialFacebook,
        socialInstagram,
        socialWhatsapp,
        invoiceBarcodePlatforms,
        promoVideoUrl,
        promoVideoEnabled,
        promoSocialLink,
        theme,
        loading,
        refresh: load,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings باید داخل SiteSettingsProvider استفاده شود.");
  return ctx;
}

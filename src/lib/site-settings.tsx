"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// این Provider برای اطلاعاتی است که قبلا در کد (src/constants/site.ts)
// ثابت بودند ولی باید از پنل مدیریت قابل تغییر باشند: لوگوی سایت و
// عکس آدرس دوکان (روز/شب). اگر مقدارشان در دیتابیس خالی باشد،
// null برمی‌گردد و کامپوننت‌ها از تصویر/آیکون پیش‌فرض داخلی استفاده
// می‌کنند — یعنی سایت هیچ‌وقت بدون لوگو نمی‌ماند.

interface SiteSettingsValue {
  logoUrl: string | null;
  storeImageDayUrl: string | null;
  storeImageNightUrl: string | null;
  heroImageUrl: string | null;
  loading: boolean;
  refresh: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsValue | null>(null);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [storeImageDayUrl, setStoreImageDayUrl] = useState<string | null>(null);
  const [storeImageNightUrl, setStoreImageNightUrl] = useState<string | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const { data } = await supabase
      .from("site_settings")
      .select("logo_url, store_image_day_url, store_image_night_url, hero_image_url")
      .eq("id", 1)
      .single();

    setLogoUrl(data?.logo_url || null);
    setStoreImageDayUrl(data?.store_image_day_url || null);
    setStoreImageNightUrl(data?.store_image_night_url || null);
    setHeroImageUrl(data?.hero_image_url || null);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{ logoUrl, storeImageDayUrl, storeImageNightUrl, heroImageUrl, loading, refresh: load }}
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

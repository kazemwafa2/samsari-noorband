"use client";

import { useEffect } from "react";
import { useSiteSettings } from "@/lib/site-settings";

// این کامپوننت پاسخ به درخواست «از پنل تنظیمات سایت باید همه سایت را
// ویرایش کند: رنگ‌ها، گلاس شیشه‌ای، رنگ دکمه‌ها، پس‌زمینه دکمه‌ها،
// پس‌زمینه سایت، نوشته‌ها» است.
//
// globals.css از قبل تقریبا همه‌ی رنگ‌های سایت را با CSS custom
// properties تعریف کرده بود (--primary، --secondary، --background،
// --card، --dark، --btn-gradient-start/end، --btn-text، --glass-bg)
// ولی این متغیرها فقط در globals.css ثابت بودند — هیچ راهی برای
// تغییرشان از پنل مدیریت وجود نداشت. این کامپوننت مقادیر ذخیره‌شده در
// site_settings.theme (که از /dashboard/settings/appearance می‌آید) را
// در زمان اجرا با document.documentElement.style.setProperty روی همان
// متغیرها می‌نویسد — یعنی تغییر رنگ از پنل واقعا کل سایت (دکمه‌ها،
// کارت‌ها، پس‌زمینه، گلاس) را به‌روز می‌کند، بدون نیاز به build دوباره.
// اگر ادمین چیزی تنظیم نکرده باشد، theme خالی است و رنگ پیش‌فرض
// globals.css دست‌نخورده باقی می‌ماند.

export default function ThemeInjector() {
  const { theme, loading } = useSiteSettings();

  useEffect(() => {
    if (loading) return;

    const root = document.documentElement;
    const map: Record<string, string | undefined> = {
      "--primary": theme.primary,
      "--secondary": theme.secondary,
      "--background": theme.background,
      "--card": theme.cardBg,
      "--dark": theme.darkText,
      "--btn-gradient-start": theme.btnGradientStart,
      "--btn-gradient-end": theme.btnGradientEnd,
      "--btn-text": theme.btnText,
      "--hero-min-height": theme.heroMinHeight,
    };

    Object.entries(map).forEach(([cssVar, value]) => {
      if (value) {
        root.style.setProperty(cssVar, value);
      } else {
        root.style.removeProperty(cssVar);
      }
    });

    // شفافیت گلاس شیشه‌ای: globals.css از --glass-bg به‌صورت rgba ثابت
    // استفاده می‌کند؛ اینجا فقط عدد شفافیت (آلفا) آن جایگزین می‌شود.
    // نکته: اگر theme.glassBg مقدار کامل rgba داشته باشد (مثلا از یک
    // پیش‌فرض «شیشه یخی»)، همان اولویت دارد و جایگزین این محاسبه ساده
    // می‌شود — چون رنگ گلاس یخی آبی‌روشن است، نه سفید خالص.
    if (theme.glassBg) {
      root.style.setProperty("--glass-bg", theme.glassBg);
    } else if (theme.glassOpacity) {
      root.style.setProperty("--glass-bg", `rgba(255,255,255,${theme.glassOpacity})`);
    } else {
      root.style.removeProperty("--glass-bg");
    }

    if (theme.glassBorder) {
      root.style.setProperty("--glass-border", theme.glassBorder);
    } else {
      root.style.removeProperty("--glass-border");
    }

    if (theme.glassBlur) {
      root.style.setProperty("--glass-blur", theme.glassBlur);
    } else {
      root.style.removeProperty("--glass-blur");
    }
  }, [theme, loading]);

  return null;
}

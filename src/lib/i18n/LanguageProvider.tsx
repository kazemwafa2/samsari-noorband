"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LANGUAGE_DIRECTION,
  stripLocaleFromPath,
  getLocalizedPath,
  type Language,
} from "./dictionaries";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "noorband-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [language, setLanguageState] = useState<Language>("prs");

  useEffect(() => {
    // اولویت ۱: خود URL — چون middleware.ts آدرس‌های /fr/... و مشابه
    // را به همان صفحه‌ی بدون‌پیشوند rewrite می‌کند (نامرئی)، ولی آدرس
    // واقعی که کاربر می‌بیند/کلیک کرده همان با پیشوند می‌ماند؛ یعنی
    // window.location.pathname دقیقا نشان می‌دهد کاربر آگاهانه کدام
    // نسخه‌ی زبانی را باز کرده — این باید روی هر localStorage قدیمی
    // اولویت داشته باشد (مثل هر سایت چندزبانه واقعی).
    const { locale: urlLocale } = stripLocaleFromPath(window.location.pathname);

    if (urlLocale) {
      applyLanguage(urlLocale);
      localStorage.setItem(STORAGE_KEY, urlLocale);
      return;
    }

    // اولویت ۲: انتخاب قبلی کاربر (localStorage)
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved) {
      applyLanguage(saved);
      return;
    }

    // اولویت ۳: تشخیص جغرافیایی (کوکی noorband-geo-lang که middleware.ts
    // از روی کشور واقعی بازدیدکننده — نه مرورگرش — ست می‌کند: ایران →
    // فارسی، در غیر این‌صورت دری). این خیلی دقیق‌تر از حدس زبان مرورگر
    // است چون کاربران زیادی مرورگرشان را تنظیم نکرده‌اند.
    const geoMatch = document.cookie.match(/(?:^|; )noorband-geo-lang=([^;]+)/);
    if (geoMatch) {
      const geoLang = decodeURIComponent(geoMatch[1]) as Language;
      if (geoLang === "fa" || geoLang === "prs") {
        applyLanguage(geoLang);
        return;
      }
    }

    // اولویت ۴ (پیش‌فرض نهایی): اگر هیچ‌کدام از موارد بالا در دسترس
    // نبود (مثلا کوکی هنوز ست نشده)، دری — زبان کامل و پیش‌فرض سایت.
    applyLanguage("prs");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyLanguage(lang: Language) {
    setLanguageState(lang);
    document.documentElement.dir = LANGUAGE_DIRECTION[lang];
    document.documentElement.lang = lang;
  }

  function setLanguage(lang: Language) {
    applyLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);

    // آدرس هم همراه زبان عوض می‌شود (مثلا /products/5 → /fr/products/5)
    // تا URL و زبان نمایش‌داده‌شده همیشه هماهنگ بمانند — این همان چیزی
    // است که hreflang واقعی و قابل‌اشتراک‌گذاری بودن لینک را ممکن می‌کند.
    const newPath = getLocalizedPath(window.location.pathname, lang);
    if (newPath !== window.location.pathname) {
      router.push(newPath + window.location.search);
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage باید داخل LanguageProvider استفاده شود.");
  return ctx;
}

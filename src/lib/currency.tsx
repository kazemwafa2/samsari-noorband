"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const CURRENCY_LABELS: Record<string, string> = {
  AFN: "؋ افغانی",
  IRT: "تومان",
  USD: "$ دلار",
  EUR: "€ یورو",
  CHF: "CHF فرانک سوئیس",
};

interface CurrencyContextValue {
  currency: string;
  setCurrency: (c: string) => void;
  rates: Record<string, number>;
  format: (priceInBaseCurrency: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

// نرخ‌ها به‌صورت دستی در جدول site_settings.currency_rates ذخیره می‌شوند
// (پایه محاسبه: افغانی = ۱). برای نرخ زنده و لحظه‌ای باید به یک API
// نرخ ارز خارجی وصل شوی که نیاز به کلید API جداگانه دارد.

// نرخ‌های دستی از site_settings.currency_rates یک fallback هستند. اگر
// اتصال به اینترنت برقرار باشد، نرخ زنده از یک API رایگان و بدون نیاز
// به کلید (ExchangeRate-API Open Access) گرفته می‌شود. این سرویس رایگان
// است ولی بر اساس شرایط استفاده‌شان باید attribution نگه داشته شود —
// لینک exchangerate-api.com را در فوتر یا صفحه تنظیمات نگه دار.

async function fetchLiveRates(): Promise<Record<string, number> | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      cache: "no-store",
    });
    const json = await res.json();

    if (json.result !== "success") return null;

    const usdRates = json.rates;
    // پایه محاسبه ما افغانی است، پس همه نرخ‌ها را نسبت به AFN می‌سازیم
    const afnPerUsd = usdRates.AFN;
    if (!afnPerUsd) return null;

    return {
      AFN: 1,
      USD: 1 / afnPerUsd,
      EUR: (usdRates.EUR || 0) / afnPerUsd,
      CHF: (usdRates.CHF || 0) / afnPerUsd,
      IRT: ((usdRates.IRR || 0) / 10) / afnPerUsd,
    };
  } catch {
    return null;
  }
}

// اعداد باید متناسب با زبان انتخابی نمایش داده شوند — قبلا همیشه از
// ارقام فارسی (۱۲۳...) استفاده می‌شد، حتی وقتی کاربر انگلیسی/فرانسوی/
// آلمانی را انتخاب کرده بود که برایش گیج‌کننده بود.
const NUMERAL_LOCALE: Record<string, string> = {
  fa: "fa-IR",
  prs: "fa-AF",
  ps: "ps-AF",
  en: "en-US",
  ar: "ar-EG",
  fr: "fr-FR",
  de: "de-DE",
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { language } = useLanguage();
  const [currency, setCurrency] = useState("AFN");
  const [rates, setRates] = useState<Record<string, number>>({ AFN: 1 });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("site_settings")
      .select("default_currency, currency_rates")
      .eq("id", 1)
      .single();

    if (data) {
      setCurrency(data.default_currency || "AFN");
      setRates(data.currency_rates || { AFN: 1 });
    }

    // تلاش برای گرفتن نرخ زنده؛ اگر موفق نشد، همان نرخ دستی بالا می‌ماند
    const live = await fetchLiveRates();
    if (live) setRates((prev) => ({ ...prev, ...live }));

    // تشخیص خودکار ارز بر اساس IP، فقط برای بازدید اول (اگر کاربر قبلا
    // خودش دستی انتخاب کرده، دیگر بازنویسی نمی‌شود)
    const manuallyChosen = localStorage.getItem("noorband-currency-manual");
    if (!manuallyChosen) {
      try {
        const geoRes = await fetch("/api/geo");
        const geo = await geoRes.json();
        if (geo?.currency) setCurrency(geo.currency);
      } catch {
        // اگر تشخیص IP شکست خورد، همان ارز پیش‌فرض تنظیمات سایت می‌ماند
      }
    }
  }

  function format(priceInBaseCurrency: number) {
    const rate = rates[currency] ?? 1;
    const converted = priceInBaseCurrency * rate;
    const label = CURRENCY_LABELS[currency] || currency;
    const locale = NUMERAL_LOCALE[language] || "fa-IR";
    return `${converted.toLocaleString(locale, { maximumFractionDigits: 0 })} ${label}`;
  }

  function setCurrencyManually(c: string) {
    localStorage.setItem("noorband-currency-manual", "true");
    setCurrency(c);
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: setCurrencyManually, rates, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency باید داخل CurrencyProvider استفاده شود.");
  return ctx;
}

export const CURRENCY_OPTIONS = Object.keys(CURRENCY_LABELS);
export { CURRENCY_LABELS };

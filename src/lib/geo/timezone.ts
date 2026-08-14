import type { Language } from "@/lib/i18n/dictionaries";

// منطقه زمانی واقعی کاربر را از خود مرورگر می‌گیرد (بدون نیاز به هیچ
// اجازه یا تماس شبکه‌ای) — این دقیق‌تر از حدس‌زدن بر اساس IP است، چون
// IP کاربرانی که از VPN استفاده می‌کنند را گمراه می‌کند، در حالی که
// این مقدار مستقیما از تنظیمات سیستم/مرورگر خود کاربر می‌آید.
export function getUserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kabul";
  } catch {
    return "Asia/Kabul";
  }
}

const DATE_LOCALE: Record<Language, string> = {
  fa: "fa-IR",
  prs: "fa-AF",
  ps: "ps-AF",
  en: "en-US",
  ar: "ar-EG",
  fr: "fr-FR",
  de: "de-DE",
  tr: "tr-TR",
  es: "es-ES",
};

// تاریخ را متناسب با زبان انتخابی و منطقه زمانی واقعی کاربر نشان
// می‌دهد — قبلا همه‌جا با toLocaleDateString("fa-IR") و بدون در نظر
// گرفتن timezone کاربر نوشته شده بود.
export function formatLocalDate(dateString: string, language: Language): string {
  try {
    return new Date(dateString).toLocaleDateString(DATE_LOCALE[language] || "fa-IR", {
      timeZone: getUserTimeZone(),
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

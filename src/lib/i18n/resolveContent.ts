import type { Language } from "./dictionaries";

// این تابع برای هر رکوردی که یک ستون اصلی (مثلا title، به فارسی) و
// یک ستون jsonb ترجمه (مثلا title_translations: {en: "...", ar: "..."})
// دارد استفاده می‌شود. اگر ترجمه‌ی زبان فعلی موجود بود همان برگردانده
// می‌شود، وگرنه مقدار اصلی (fallback) — یعنی دسته‌بندی‌ای که ادمین
// هنوز ترجمه‌اش نکرده، هیچ‌وقت خالی نمایش داده نمی‌شود.
export function resolveTranslated(
  base: string,
  translations: Record<string, string> | null | undefined,
  language: Language
): string {
  if (translations && translations[language]) {
    return translations[language];
  }
  return base;
}

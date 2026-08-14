import { MetadataRoute } from "next";
import { LOCALE_URL_PREFIXES } from "@/lib/i18n/dictionaries";

// نکته مهم: نسخه قبلی این فایل GPTBot (خزنده OpenAI/ChatGPT) را با
// disallow:"/" کاملا از کل سایت بلاک کرده بود — درست برخلاف هدف GEO
// (دیده‌شدن در پاسخ‌های هوش مصنوعی) که بقیه پروژه رویش کار شده. این
// نسخه GPTBot و بقیه خزنده‌های معتبر AI را مثل Googlebot اجازه می‌دهد
// و فقط مسیرهای خصوصی/حساس را برای همه مسدود می‌کند.
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samsari-noorband.com";

  const privatePathsBase = [
    "/dashboard/",
    "/admin/",
    "/api/",
    "/auth/",
    "/site/checkout/",
    "/site/cart/",
    "/site/orders/",
    "/site/profile/",
    "/notifications/",
    "/login/",
    "/register/",
    "/forgot-password/",
    "/reset-password/",
    "/_next/",
  ];

  // از وقتی middleware.ts پیشوندهای زبان (/en، /fr، /de، /ps، /ar،
  // /prs) را rewrite می‌کند، مسیر خصوصی هم زیر هر پیشوند در دسترس است
  // (مثلا /fr/dashboard/ دقیقا مثل /dashboard/ محافظت می‌شود — چون
  // middleware همان چک را روی نسخه‌ی بدون‌پیشوند انجام می‌دهد). قبلا
  // این فایل فقط نسخه‌ی بدون‌پیشوند را در robots.txt disallow می‌کرد؛
  // یعنی اگر خزنده‌ای مسیر /en/dashboard/... را جایی پیدا می‌کرد،
  // robots.txt چیزی دراین‌باره نمی‌گفت (محافظت واقعی همچنان از
  // middleware می‌آمد، این فقط برای تمیزی/وضوح در robots.txt است).
  const privatePaths = [
    ...privatePathsBase,
    ...LOCALE_URL_PREFIXES.flatMap((locale) => privatePathsBase.map((p) => `/${locale}${p}`)),
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/products/",
          "/categories/",
          "/blog/",
          "/faq/",
          "/shipping/",
          "/terms/",
          "/privacy/",
          "/about/",
          "/contact/",
          "/manifest.webmanifest",
          "/sw.js",
        ],
        disallow: privatePaths,
      },
      // خزنده‌های معتبر موتورهای پاسخ‌گوی هوش مصنوعی — همان دسترسی
      // Googlebot را دارند، نه بلاک کامل. اسم درست خزنده‌ها را
      // پیش از انتشار نهایی از مستندات خودشان بازبینی کن، چون این
      // اسم‌ها گاهی عوض می‌شوند:
      // GPTBot (OpenAI), Google-Extended (Gemini/Bard), PerplexityBot,
      // ClaudeBot (Anthropic), CCBot (Common Crawl / بسیاری از مدل‌ها)
      {
        userAgent: ["Googlebot", "GPTBot", "Google-Extended", "PerplexityBot", "ClaudeBot", "CCBot"],
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

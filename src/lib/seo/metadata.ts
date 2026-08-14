import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE_CONFIG } from "@/constants/site";

// نکته مهم: این تابع در هیچ‌جای اپ فراخوانی نمی‌شود (نه در layout.tsx،
// نه در هیچ page.tsx‌ای) — چون تمام صفحات اصلی این پروژه کامپوننت
// کلاینت («use client») هستند و Next.js فقط به Server Component/
// generateMetadata اجازه‌ی خروجی Metadata واقعی می‌دهد. متادیتای واقعی
// و فعال سایت همان export const metadata در src/app/layout.tsx است.
// این فایل برای زمانی نگه داشته شده که یک مسیر را به Server Component
// تبدیل کردی و خواستی از همینجا generateMetadata بسازی.
//
// همچنین قبلا:
// - ستون‌هایی از site_settings می‌خواند که در db/schema.sql وجود
//   ندارند (site_description, site_keywords, og_image_url,
//   google_verification_code, favicon_url) — همیشه undefined می‌شدند.
// - یک آدرس توییتر جعلی (@samsari_noorband) داشت که وجود ندارد.
// - hreflang با آدرس‌های /fa /en /ps /ar می‌ساخت که در این پروژه اصلا
//   چنین مسیرهایی وجود ندارد (سایت زبان را سمت کلاینت عوض می‌کند، نه
//   با URL جدا) — بازدیدکننده با کلیک روی آن‌ها ۴۰۴ می‌گرفت.
// این نسخه این موارد را اصلاح کرده؛ اگر بعدا مسیرهای زبان جدا
// (/en/... و ...) ساختی، alternates.languages پایین را برگردان.
export async function generateSiteMetadata(): Promise<Metadata> {
  // نکته: src/lib/supabase/server.ts فقط createClient (تابع async)
  // export می‌کند، نه یک supabase آماده — نسخه قبلی این فایل
  // `import { supabase }` می‌نوشت که اصلا وجود نداشت و هنگام اجرا
  // خطای "supabase is undefined" می‌داد.
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("site_name").single();

  const siteName = settings?.site_name || SITE_CONFIG.name;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samsari-noorband.com";

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description:
      "خرید و فروش امن لوازم آرایشی و بهداشتی، زیورآلات و پوشاک محلی هزارگی — نو یا دست‌دوم، با ضمانت اصالت.",
    keywords: ["سمساری", "نوربند", "جاغوری", "خرید", "فروش", "کالای دست دوم", "افغانستان"],

    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,

    openGraph: {
      type: "website",
      locale: "fa_AF",
      siteName,
      title: siteName,
      url: siteUrl,
      images: [{ url: "/icon-512.png", width: 512, height: 512, alt: siteName }],
    },

    twitter: {
      card: "summary_large_image",
      title: siteName,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    manifest: "/manifest.webmanifest",

    // فقط وقتی واقعا یک کد تایید گوگل در env گذاشته شده باشد اضافه
    // می‌شود — قبلا همیشه یک فیلد verification خالی/undefined می‌ساخت.
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
    }),

    alternates: {
      canonical: siteUrl,
      // languages: { fa: `${siteUrl}/fa`, en: `${siteUrl}/en` } — فقط
      // وقتی این مسیرها واقعا در پروژه ساخته شدند اضافه کن.
    },
  };
}

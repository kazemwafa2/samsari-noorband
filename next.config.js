/** @type {import('next').NextConfig} */

const nextConfig = {

  images: {
    // اصلاح شد: قبلا اینجا دامنه Supabase یک پروژه مشخص (مال توسعه‌دهنده
    // قبلی) هاردکد شده بود. چون تو پروژه Supabase خودت را می‌سازی و
    // آدرسش فرق دارد، آن دامنه هیچ‌وقت با پروژه واقعی تو یکی نمی‌شد و
    // next/image برای تمام تصاویر محصول خطای "hostname not configured"
    // می‌داد. الان با یک الگوی عمومی (wildcard) هر پروژه Supabase را
    // قبول می‌کند.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },

  compress: true,

  poweredByHeader: false,

  reactStrictMode: true,

  // اصلاح امنیتی: قبلا هیچ هدر امنیتی‌ای (CSP, X-Frame-Options, ...)
  // ست نمی‌شد. این‌ها لایه دفاعی اضافه‌ای هستند، مخصوصا برای کاهش اثر
  // احتمالی XSS و کلیک‌جکینگ.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js به inline script (برای hydration/JSON-LD) و eval در dev نیاز دارد
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.clarity.ms",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://via.placeholder.com",
              "font-src 'self' data:",
              // نکته اصلاح‌شده: قبلا هیچ media-src تعریف نشده بود، یعنی
              // به‌طور پیش‌فرض روی default-src 'self' می‌افتاد — مرورگر
              // اجازه پخش فایل ویدیوی آپلودشده در Supabase Storage
              // (دامنه‌ی خارجی) را نمی‌داد، حتی با اینکه خود فایل و
              // لینک عمومی‌اش کاملا سالم بودند. همین باعث می‌شد ویدیوی
              // تبلیغاتی همیشه با پلیر سیاه/۰:۰۰ نمایش داده شود.
              "media-src 'self' https://*.supabase.co blob:",
              // نکته: iframe یوتیوب/آپارات برای ویدیوی تبلیغاتی هم به
              // frame-src نیاز دارد؛ بدون این خط همان مشکل CSP بالا
              // برای این دو منبع هم پیش می‌آمد.
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.aparat.com",
              "connect-src 'self' https://*.supabase.co https://api.groq.com https://payment.zarinpal.com https://ipapi.co https://www.google-analytics.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },

};

module.exports = nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());

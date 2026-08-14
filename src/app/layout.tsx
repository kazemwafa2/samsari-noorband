import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import RegisterSW from "@/components/RegisterSW";
import Analytics from "@/components/Analytics";
import { SplashScreen } from "@/components/pwa/SplashScreen";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import ChatBotLauncher from "@/components/ChatBotLauncher";
import FloatingActions from "@/components/FloatingActions";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import TopAnnouncementBar from "@/components/TopAnnouncementBar";
import WelcomeSystem from "@/components/WelcomeSystem";
import PageViewTracker from "@/components/PageViewTracker";
import OfflineBanner from "@/components/OfflineBanner";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { CurrencyProvider } from "@/lib/currency";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { SiteSettingsProvider } from "@/lib/site-settings";
import { generateOrganizationSchema, safeJsonLdString } from "@/lib/seo/schema";

// قبلا هیچ‌جای اپ <Toaster/> رندر نمی‌شد، در حالی که چند صفحه (مثل
// site/checkout) از toast() ساننر استفاده می‌کردند — یعنی آن toast ها
// عملا هیچ‌وقت روی صفحه نمایش داده نمی‌شدند. حالا یک‌بار در ریشه اپ
// mount می‌شود تا همه‌جا کار کند.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://samsari-noorband.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: "سیمساری نوربند جاغوری",

  description:
    "سیمساری نوربند جاغوری، فروشگاه آنلاین خرید و فروش انواع محصولات نو و دست دوم با پشتیبانی هوشمند NOORBAND AI.",

  keywords: [
    "سیمساری",
    "نوربند جاغوری",
    "جاغوری",
    "فروشگاه",
    "خرید و فروش",
    "محصولات نو",
    "محصولات دست دوم",
    "NOORBAND Jaghori",
    "NOORBAND AI",
  ],

  authors: [{ name: "NOORBAND Jaghori" }],

  creator: "NOORBAND Jaghori",
  publisher: "NOORBAND Jaghori",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    title: "سیمساری نوربند جاغوری",
    description: "NOORBAND AI • Next.js 15 • PWA • Mobile First",
    type: "website",
    // قبلا fa_IR (ایران) بود؛ این یک فروشگاه افغانستانی است (جاغوری،
    // غزنی) و زبان پیش‌فرض سایت دری است، پس prs_AF درست‌تر است.
    locale: "prs_AF",
    alternateLocale: ["fa_AF", "ps_AF", "en_US", "ar", "fr_FR", "de_DE"],
    siteName: "NOORBAND Jaghori",
  },

  twitter: {
    card: "summary_large_image",
    title: "سیمساری نوربند جاغوری",
    description: "NOORBAND AI • Premium Online Shop",
  },

  themeColor: "#6D28D9",

  manifest: "/manifest.webmanifest",

  // hreflang واقعی: چون middleware.ts حالا واقعا /fa /ps /en /ar /fr
  // /de را rewrite می‌کند (نه ۴۰۴)، این آدرس‌ها دیگر جعلی نیستند.
  // دری (prs) پیش‌فرض و بدون پیشوند است، هم برای x-default و هم prs.
  // نکته: چون همه صفحات این پروژه کامپوننت کلاینت‌اند (نه Server
  // Component)، این متادیتا فقط برای صفحه اصلی (root layout) دقیق
  // است؛ صفحه محصول/وبلاگ به‌صورت جداگانه schema خودشان را دارند
  // (src/lib/seo/schema.ts) ولی هنوز generateMetadata مجزا ندارند.
  alternates: {
  canonical: SITE_URL,
  languages: {
    "fa-AF": SITE_URL,
    ps: `${SITE_URL}/ps`,
    en: `${SITE_URL}/en`,
    ar: `${SITE_URL}/ar`,
    fr: `${SITE_URL}/fr`,
    de: `${SITE_URL}/de`,
    "x-default": SITE_URL,
  },
},  


  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="prs" dir="rtl">
      <body>
        <LanguageProvider>
        <RegisterSW />
        <Analytics />
        <OfflineBanner />

        {/* SplashScreen و PWAInstallPrompt قبلا در پروژه کامل ساخته شده
            بودند (src/components/pwa/) ولی هیچ‌جای اپ import نشده بودند
            — یعنی PWA هیچ‌وقت صفحه لودینگ خودش را نشان نمی‌داد و کاربر
            هیچ پیشنهاد نصبی نمی‌دید، با اینکه manifest.webmanifest و
            RegisterSW از قبل واقعی و فعال بودند. */}
        <SplashScreen />
        <PWAInstallPrompt />

        {/* دکمه‌های شناور سراسری — چک‌لیست بخش ۱۰: چت‌بات AI، واتساپ،
            تماس، بازگشت به بالا. قبلا چت‌بات فقط در صفحه اصلی و به‌شکل
            خراب (داخل یک دایره ۷۰ پیکسلی) render می‌شد و واتساپ هم فقط
            در صفحه اصلی بود؛ حالا هر دو در همه صفحات‌اند. */}
        <ChatBotLauncher />
        <FloatingActions />

        {/* Organization/LocalBusiness Schema.org — برای سئو و موتورهای
            پاسخ‌گوی AI (GEO/AEO)؛ قبلا فقط صفحه محصول Schema داشت،
            هیچ داده ساختاریافته‌ای درباره خود فروشگاه وجود نداشت.
            حالا از src/lib/seo/schema.ts (داده واقعی SITE_CONFIG،
            بدون شماره تلفن/تلگرام جعلی) استفاده می‌شود. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString(generateOrganizationSchema()) }}
        />
        {/* LanguageProvider و CurrencyProvider قبلا وجود داشتند ولی به
            هیچ‌جای اپلیکیشن وصل نبودند (هیچ صفحه‌ای نمی‌توانست از
            useLanguage/useCurrency استفاده کند چون Provider والدشان
            نبود). حالا کل اپ در این دو Provider پیچیده شده است. */}
          <ThemeProvider>
            <CurrencyProvider>
              <SiteSettingsProvider>
                <TopAnnouncementBar />
                <Navbar />
                <WelcomeSystem />
                <PageViewTracker />
                {children}
                <Footer />
                {/* نوار پایین موبایل — چک‌لیست: طرح مرجع (نسخه موبایل)
                    یک نوار ثابت پایین با ۴ آیتم دارد؛ در دسکتاپ با
                    CSS مخفی است (globals.css) پس نیازی به شرط جدا نیست. */}
                <MobileBottomNav />
                <Toaster position="top-center" richColors closeButton dir="rtl" />
              </SiteSettingsProvider>
            </CurrencyProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

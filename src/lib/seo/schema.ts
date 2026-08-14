import { SITE_CONFIG } from "@/constants/site";
import type { Product } from "@/types/product";

// نسخه قبلی این فایل هیچ‌جای پروژه import/استفاده نمی‌شد (کاملا مرده
// بود) و علاوه‌براین: شماره تلفن جعلی «+93-78xxxxxxx»، لینک تلگرام
// جعلی (این فروشگاه تلگرام ندارد)، ساعت کاری اشتباه (۹-۱۷ به‌جای ۸-۱۸
// واقعی)، و شکل داده‌ی Product کاملا متفاوت از نوع واقعی Product در
// src/types/product.ts (فیلدهایی مثل images[].url، sku، brand.name،
// product_status.name که اصلا در دیتابیس وجود ندارند) داشت. این نسخه
// با SITE_CONFIG و نوع واقعی Product هماهنگ شده.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://noorband.example.com";

// اصلاح امنیتی: این schema object‌ها آخرش با JSON.stringify داخل
// dangerouslySetInnerHTML="<script type=application/ld+json>" قرار
// می‌گیرند. مشکل این است که JSON.stringify کاراکتر "<" را escape
// نمی‌کند؛ پس اگر عنوان/توضیح یک محصول (که هر seller می‌تواند بسازد)
// یا یک پست وبلاگ شامل چیزی مثل "</script><script>...</script>" باشد،
// تگ اسکریپت زودتر از موعد بسته می‌شود و کد دلخواه در صفحه هر
// بازدیدکننده اجرا می‌شود (Stored XSS). این تابع را باید همه‌جا به‌جای
// JSON.stringify مستقیم، برای پر کردن این نوع script tag استفاده کرد.
export function safeJsonLdString(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE_CONFIG.name,
    // طبق چک‌لیست پروژه: نام رسمی همیشه «سیمساری…» می‌ماند، ولی شکل‌های
    // رایج جستجو («سمساری» به‌جای «سیمساری» + معادل لاتین) باید برای
    // Google/AI Search قابل تشخیص باشند — بدون Keyword Stuffing در متن
    // قابل‌مشاهده صفحه، این‌جا (alternateName) دقیقا همان‌جایی است که
    // schema.org برای این کار در نظر گرفته.
    alternateName: [
      "سمساری نوربند جاغوری",
      "Simsari Noorband Jaghori",
      "Samsari Noorband Jaghori",
    ],
    description: "خرید و فروش امن لوازم آرایشی و بهداشتی، زیورآلات و پوشاک محلی هزارگی — نو یا دست‌دوم، با ضمانت اصالت.",
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,

    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address,
      addressLocality: "جاغوری",
      addressRegion: "غزنی",
      addressCountry: "AF",
    },

    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_CONFIG.phones[0],
      contactType: "customer service",
      availableLanguage: ["Persian", "Dari", "Pashto", "English", "Arabic", "French", "German", "Turkish", "Spanish"],
    },

    sameAs: [SITE_CONFIG.social.facebook, SITE_CONFIG.social.instagram].filter(Boolean),

    // ساعات کاری واقعی از SITE_CONFIG (قبلا 09:00-17:00 اشتباه بود؛
    // ساعات واقعی طبق تماس با ما ۸ صبح الی ۶ عصر است)
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],

    priceRange: "$$",
    currenciesAccepted: "AFN, USD, EUR, CHF",
    paymentAccepted: "Cash, WhatsApp order",
  };
}

interface ProductRating {
  avg: number;
  count: number;
}

// این تابع دقیقا با فیلدهای واقعی Product (src/types/product.ts) کار
// می‌کند، نه یک شکل داده‌ی فرضی.
export function generateProductSchema(product: Product, rating?: ProductRating) {
  const finalPrice =
    product.discount > 0 ? product.price - (product.price * product.discount) / 100 : product.price;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.title,
    image: product.image ? [product.image] : [],
    category: product.category,

    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.id}`,
      priceCurrency: "AFN",
      price: finalPrice.toFixed(0),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
      },
    },

    // فقط وقتی امتیاز واقعی از نظرات تاییدشده داریم اضافه می‌شود — هیچ
    // عدد ساختگی گذاشته نمی‌شود.
    ...(rating && rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.avg.toFixed(1),
            reviewCount: rating.count,
          },
        }
      : {}),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface BlogPostForSchema {
  title: string;
  excerpt?: string | null;
  content?: string | null;
  slug: string;
  cover_image?: string | null;
  author_name?: string | null;
  created_at: string;
  updated_at?: string | null;
}

// برای GEO (Generative Engine Optimization): نویسنده و تاریخ
// بروزرسانی مشخص، تا موتورهای پاسخ‌گوی هوش مصنوعی بتوانند منبع و
// تازگی محتوا را تشخیص دهند.
export function generateArticleSchema(post: BlogPostForSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.cover_image ? [post.cover_image] : undefined,
    author: {
      "@type": post.author_name ? "Person" : "Organization",
      name: post.author_name || SITE_CONFIG.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
    },
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };
}

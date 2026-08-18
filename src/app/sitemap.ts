import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { LOCALE_URL_PREFIXES } from "@/lib/i18n/dictionaries";

// قبلا sitemap فقط صفحات ثابت (/, /products, /about ...) داشت و
// محصولات واقعی داخلش نبودند. این نسخه اضافه می‌کند:
// - صفحات هر دسته‌بندی (/categories/[slug])
// - صفحات وبلاگ منتشرشده (/blog/[slug])
// - image sitemap برای هر محصول (فیلد images — گوگل از همین طریق
//   تصاویر محصول را در جستجوی تصویر ایندکس می‌کند)
// - نسخه‌ی هر زبان از صفحه اصلی (/en، /fr، /de، /ps، /ar، /prs) — حالا
//   که middleware.ts این مسیرها را واقعا rewrite می‌کند، جای معناداری
//   در sitemap دارند.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samsari-noorband.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/site/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/site/auctions`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/shipping`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  // نسخه‌های زبانی صفحه اصلی — فقط صفحه اصلی، نه ضرب‌کردن تمام محصولات
  // در ۶ زبان (که سایت‌مپ را غیرضروری بزرگ می‌کرد بدون محتوای واقعا
  // جداگانه، چون محتوای محصول هنوز ترجمه ندارد — فقط چیدمان/ناوبار).
  const localeHomePages: MetadataRoute.Sitemap = LOCALE_URL_PREFIXES.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.5,
  }));

  const [{ data: products }, { data: categories }, { data: posts }] = await Promise.all([
    supabase.from("products").select("id, updated_at, image").eq("is_available", true).limit(1000),
    supabase.from("categories").select("slug, created_at").limit(200),
    supabase.from("blog_posts").select("slug, updated_at, created_at").eq("is_published", true).limit(500),
  ]);

  const productPages: MetadataRoute.Sitemap = (products || []).map((p: any) => ({
    url: `${baseUrl}/products/${p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
    // Image Sitemap extension — هر محصول با عکس واقعی‌اش در سایت‌مپ
    ...(p.image ? { images: [p.image] } : {}),
  }));

  const categoryPages: MetadataRoute.Sitemap = (categories || [])
    .filter((c: any) => c.slug)
    .map((c: any) => ({
      url: `${baseUrl}/categories/${c.slug}`,
      lastModified: c.created_at ? new Date(c.created_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const blogPages: MetadataRoute.Sitemap = (posts || []).map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.created_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...localeHomePages, ...categoryPages, ...productPages, ...blogPages];
}

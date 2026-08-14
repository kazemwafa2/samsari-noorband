"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateArticleSchema, generateBreadcrumbSchema, safeJsonLdString } from "@/lib/seo/schema";
import { SEOHead } from "@/components/seo/SEOHead";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { formatLocalDate } from "@/lib/geo/timezone";
import { t } from "@/lib/i18n/dictionaries";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  author_name: string | null;
  created_at: string;
  updated_at: string | null;
}

export default function BlogDetailPage() {
  const supabase = createClient();
  const params = useParams();
  const slug = params.slug as string;
  const { language } = useLanguage();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) loadPost();
  }, [slug]);

  async function loadPost() {
    setLoading(true);

    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, cover_image, author_name, created_at, updated_at")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error || !data) {
      console.log("BLOG DETAIL ERROR:", error?.message);
      setNotFound(true);
      setLoading(false);
      return;
    }

    setPost(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="container home-page">
        <p>{t("loadingText", language)}</p>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="container home-page">
        <h1 className="section-title">{t("postNotFoundTitle", language)}</h1>
        <Link href="/blog" className="outline-btn">{t("backToBlogLink", language)}</Link>
      </main>
    );
  }

  // برای GEO: نویسنده و تاریخ آخرین بروزرسانی مشخص، تا موتورهای پاسخ‌گو
  // (هوش مصنوعی) بتوانند منبع و تازگی محتوا را تشخیص دهند.
  const articleSchema = generateArticleSchema(post);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "خانه", url: "/" },
    { name: "وبلاگ", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  return (
    <main className="container home-page fade" style={{ maxWidth: 760 }}>
      {/* همانند صفحه محصول: این صفحه هم کامپوننت کلاینت است، پس
          title/description/og:image واقعیِ هر پست تا امروز اعمال
          نمی‌شد — فقط JSON-LD مقاله داشت، نه متادیتای واقعی صفحه. */}
      <SEOHead
        title={`${post.title} | وبلاگ نوربند`}
        description={post.excerpt?.slice(0, 160) || post.title}
        image={post.cover_image}
        type="article"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdString(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdString(breadcrumbSchema) }}
      />

      <Link href="/blog" className="section-view-all" style={{ marginBottom: 20, display: "inline-flex" }}>
        {t("backToBlogLink", language)}
      </Link>

      <h1 className="section-title2" style={{ marginBottom: 10 }}>{post.title}</h1>

      <p style={{ opacity: 0.6, fontSize: 13, marginBottom: 20 }}>
        {post.author_name ? `${post.author_name} • ` : ""}
        {formatLocalDate(post.created_at, language)}
        {post.updated_at && post.updated_at !== post.created_at && (
          <> · {t("updatedLabel", language)}: {formatLocalDate(post.updated_at, language)}</>
        )}
      </p>

      {post.cover_image && (
        <div className="blog-card-media" style={{ borderRadius: 22, marginBottom: 24 }}>
          <Image src={post.cover_image} alt={post.title} width={760} height={420} />
        </div>
      )}

      <div style={{ fontSize: 15, lineHeight: 2.1, whiteSpace: "pre-line" }}>
        {post.content}
      </div>
    </main>
  );
}

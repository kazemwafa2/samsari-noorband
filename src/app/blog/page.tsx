"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { formatLocalDate } from "@/lib/geo/timezone";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string;
}

// این صفحه به جدول واقعی blog_posts وصل است (بخش ۱۲ در db/schema.sql).
// چون هنوز پنل مدیریتی برای نوشتن مطلب ساخته نشده، مطلب را فعلا باید
// مستقیم از Supabase → Table Editor → blog_posts اضافه کرد.
export default function BlogListPage() {
  const supabase = createClient();
  const { language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("BLOG LIST ERROR:", error.message);
      setPosts([]);
      setLoading(false);
      return;
    }

    setPosts(data || []);
    setLoading(false);
  }

  return (
    <main className="container home-page fade">
      <h1 className="section-title2" style={{ marginBottom: 24 }}>
        {t("blogTitle", language)}
      </h1>

      {loading && <p>{t("loadingPostsText", language)}</p>}

      {!loading && posts.length === 0 && (
        <p className="empty-state">{t("blogEmptyText", language)}</p>
      )}

      {posts.length > 0 && (
        <div className="blog-grid">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
              <div className="blog-card-media">
                {post.cover_image ? (
                  <Image src={post.cover_image} alt={post.title} width={400} height={225} />
                ) : (
                  <span>نوربند</span>
                )}
              </div>
              <div className="blog-card-body">
                <h3>{post.title}</h3>
                {post.excerpt && <p>{post.excerpt}</p>}
                <span className="blog-card-date">
                  {formatLocalDate(post.created_at, language)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

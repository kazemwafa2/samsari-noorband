"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";

// نسخه قبلی این صفحه ۹ دسته‌بندی کاملا ساختگی (با تعداد محصول فیک مثل
// ۱۲۰، ۹۵، ۲۱۰) داشت که هیچ ربطی به دیتابیس نداشت.

export default function CategoriesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("categories")
      .select("*, products(count)")
      .order("title");

    if (error) console.log("CATEGORIES ERROR:", error);
    setCategories(data || []);
    setLoading(false);
  }

  return (
    <div className="container home-page fade">
      <h1 className="section-title">{t("categoriesTitle", language)}</h1>

      {loading && <p>{t("loadingText", language)}</p>}
      {!loading && categories.length === 0 && <p>{t("categoriesEmpty", language)}</p>}

      <div className="products-grid">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <div className="card premium-shadow">
              <h2 style={{ textAlign: "center", marginTop: "15px" }}>{category.title}</h2>

              <p style={{ textAlign: "center", marginTop: "10px", color: "#6B7280" }}>
                {category.products?.[0]?.count ?? 0} {t("productCountSuffix", language)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

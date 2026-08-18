"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { useCurrency } from "@/lib/currency";

export default function Collections() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { format } = useCurrency();

  const FILTERS: Record<string, { label: string; column: string }> = {
    featured: { label: t("featuredCollectionLabel", language), column: "is_featured" },
    urgent: { label: t("urgentCollectionLabel", language), column: "is_urgent" },
    archived: { label: t("archivedCollectionLabel", language), column: "is_archived" },
  };

  const type = searchParams.get("type") || "featured";
  const config = FILTERS[type] || FILTERS.featured;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [type]);

  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq(config.column, true)
      .order("created_at", { ascending: false });

    if (error) console.log("COLLECTIONS ERROR:", error);
    setProducts(data || []);
    setLoading(false);
  }

  return (
    <main className="container home-page space-y-6">
      <h1 className="section-title">{config.label}</h1>

      <div className="flex">
        {Object.entries(FILTERS).map(([key, f]) => (
          <Link key={key} href={`/site/collections?type=${key}`}>
            {f.label}
          </Link>
        ))}
      </div>

      {loading && <p>{t("loadingText", language)}</p>}
      {!loading && products.length === 0 && <p>{t("noItemsToShowText", language)}</p>}

      <div className="product-grid">
        {products.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="product-card">
            <h3>{p.title}</h3>
            <p>{format(Number(p.price))}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

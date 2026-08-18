"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { useCurrency } from "@/lib/currency";

// قبلا این صفحه روی یک آرایه‌ی هاردکد از ۱۰ اسم محصول فیک فیلتر می‌کرد
// و هیچ ارتباطی با دیتابیس واقعی نداشت. بعدا به دیتابیس واقعی وصل شد،
// ولی فیلترهای دسته‌بندی/قیمت/برند (چک‌لیست بخش ۱۳) هنوز اضافه نشده
// بودند — این نسخه آن‌ها را هم اضافه می‌کند.

interface Category {
  id: number;
  title: string;
  slug: string;
}

interface Brand {
  id: number;
  title: string;
}

export default function SearchPage() {
  const supabase = createClient();
  const { language } = useLanguage();
  const { format } = useCurrency();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [smartMode, setSmartMode] = useState(false);
  const [interpreted, setInterpreted] = useState<string>("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  useEffect(() => {
    async function loadFilters() {
      const [{ data: cats }, { data: brandsData }] = await Promise.all([
        supabase.from("categories").select("id, title, slug").order("title"),
        supabase.from("brands").select("id, title").order("title"),
      ]);

      setCategories(cats || []);
      setBrands(brandsData || []);
    }

    loadFilters();
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setSearched(true);
    setInterpreted("");

    if (smartMode) {
      if (!query.trim()) {
        setLoading(false);
        return;
      }

      // جستجوی هوشمند: جمله طبیعی از طریق /api/search به AI فرستاده می‌شود.
      // فیلترهای دستی (دسته/برند/قیمت) روی نتیجه‌ی AI هم اعمال می‌شوند.
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      let products: Product[] = result.success ? result.products || [] : [];
      products = applyFilters(products);

      setResults(products);
      if (result.interpreted?.keywords) {
        setInterpreted(t("searchInterpretedPrefix", language).replace("{keywords}", result.interpreted.keywords));
      }

      setLoading(false);
      return;
    }

    let dbQuery = supabase.from("products").select("*").eq("is_available", true);

    if (query.trim()) {
      dbQuery = dbQuery.ilike("title", `%${query.trim()}%`);
    }
    if (categoryId) {
      dbQuery = dbQuery.eq("category_id", categoryId);
    }
    if (brandId) {
      dbQuery = dbQuery.eq("brand_id", brandId);
    }
    if (minPrice) {
      dbQuery = dbQuery.gte("price", Number(minPrice));
    }
    if (maxPrice) {
      dbQuery = dbQuery.lte("price", Number(maxPrice));
    }

    const { data, error } = await dbQuery.limit(60);

    if (error) {
      console.log("SEARCH ERROR:", error);
      setResults([]);
    } else {
      setResults(data || []);
    }

    setLoading(false);
  }

  // برای حالت هوشمند، چون /api/search خودش فیلتر دیتابیسی نمی‌گیرد،
  // فیلترهای دسته/برند/قیمت را روی نتیجه سمت کلاینت اعمال می‌کنیم.
  function applyFilters(products: Product[]): Product[] {
    return products.filter((p: any) => {
      if (categoryId && String(p.category_id) !== categoryId) return false;
      if (brandId && String(p.brand_id) !== brandId) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      return true;
    });
  }

  function resetFilters() {
    setCategoryId("");
    setBrandId("");
    setMinPrice("");
    setMaxPrice("");
  }

  return (
    <div className="container home-page">
      <h1 className="section-title">{t("searchPageTitle", language)}</h1>

      <label className="flex">
        <input type="checkbox" checked={smartMode} onChange={(e) => setSmartMode(e.target.checked)} />
        {t("smartSearchLabel", language)}
      </label>

      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          value={query}
          placeholder={smartMode ? t("smartSearchPlaceholder", language) : t("searchProductPlaceholder", language)}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="primary-btn">
          {t("searchButton", language)}
        </button>
      </form>

      {/* فیلترها — چک‌لیست بخش ۱۳: دسته‌بندی، قیمت، برند */}
      <div className="flex" style={{ flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">{t("allCategoriesOption", language)}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
          <option value="">{t("allBrandsOption", language)}</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder={t("minPricePlaceholder", language)}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ width: 120 }}
        />

        <input
          type="number"
          placeholder={t("maxPricePlaceholder", language)}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ width: 120 }}
        />

        {(categoryId || brandId || minPrice || maxPrice) && (
          <button type="button" className="primary-btn" onClick={resetFilters}>
            {t("clearFiltersButton", language)}
          </button>
        )}
      </div>

      {loading && <p>{t("searchingText", language)}</p>}
      {interpreted && <p>{interpreted}</p>}

      {!loading && searched && results.length === 0 && (
        <p>{t("noProductsFoundText", language)}</p>
      )}

      <div className="product-grid">
        {results.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="product-card"
          >
            <h3>{product.title}</h3>
            <p>{format(Number(product.price))}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

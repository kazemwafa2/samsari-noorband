"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCompareStore } from "@/store/compare";
import type { Product } from "@/types/product";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { useCurrency } from "@/lib/currency";

export default function ComparePage() {
  const supabase = createClient();
  const { productIds, remove, clear } = useCompareStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { format } = useCurrency();

  useEffect(() => {
    load();
  }, [productIds]);

  async function load() {
    if (productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data } = await supabase.from("products").select("*").in("id", productIds);

    setProducts(data || []);
    setLoading(false);
  }

  return (
    <main className="container home-page space-y-6">
      <h1 className="section-title">{t("comparePageTitle", language)}</h1>

      {productIds.length === 0 && (
        <p>{t("compareEmptyText", language)}</p>
      )}

      {loading && <p>{t("loadingText", language)}</p>}

      {!loading && products.length > 0 && (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t("featureColumnLabel", language)}</th>
                {products.map((p) => (
                  <th key={p.id}>{p.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t("priceLabel", language)}</td>
                {products.map((p) => (
                  <td key={p.id}>{format(Number(p.price))}</td>
                ))}
              </tr>
              <tr>
                <td>{t("stockColumnLabel", language)}</td>
                {products.map((p) => (
                  <td key={p.id}>{p.stock}</td>
                ))}
              </tr>
              <tr>
                <td>{t("categoryColumnLabel", language)}</td>
                {products.map((p) => (
                  <td key={p.id}>{p.category || "—"}</td>
                ))}
              </tr>
              <tr>
                <td>{t("discountLabel", language)}</td>
                {products.map((p) => (
                  <td key={p.id}>{p.discount}%</td>
                ))}
              </tr>
              <tr>
                <td>{t("actionsColumnLabel", language)}</td>
                {products.map((p) => (
                  <td key={p.id}>
                    <button className="danger-btn" onClick={() => remove(p.id)}>{t("removeFromCompareButton", language)}</button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          <button className="outline-btn" onClick={clear}>{t("clearAllButton", language)}</button>
        </>
      )}
    </main>
  );
}

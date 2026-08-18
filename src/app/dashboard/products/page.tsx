"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { logAction } from "@/lib/audit";
import type { Product } from "@/types/product";

export default function Products() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts();
    loadThreshold();
  }, []);

  async function loadThreshold() {
    const { data } = await supabase.from("site_settings").select("low_stock_threshold").eq("id", 1).single();
    if (data?.low_stock_threshold) setLowStockThreshold(data.low_stock_threshold);
  }

  async function loadProducts() {
    setLoading(true);

    // seller باید فقط محصولات خودش را اینجا ببیند — هم چون Policy
    // دیتابیس دیگر اجازه ویرایش/حذف محصول فروشنده‌های دیگر را نمی‌دهد
    // (نمایش دکمه ویرایش/حذف روی محصولی که قرار نیست بتواند لمسش کند
    // فقط باعث خطای گیج‌کننده می‌شود)، هم برای اینکه کاتالوگ فروشنده‌ی
    // دیگر را نبیند. ادمین/سوپرادمین همه‌چیز را می‌بینند.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let role: string | null = null;
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      role = profile?.role ?? null;
    }

    let query = supabase.from("products").select("*").order("created_at", { ascending: false });

    if (role === "seller" && user) {
      query = query.eq("seller_id", user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.log("DASHBOARD PRODUCTS ERROR:", error);
    }

    setProducts(data || []);
    setLoading(false);
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("از حذف این محصول مطمئن هستید؟");
    if (!confirmed) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      alert("حذف محصول با خطا مواجه شد.");
      console.log(error);
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    logAction("delete", "product", id);
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">🛍 مدیریت محصولات</h1>

      <div className="flex" style={{ justifyContent: "space-between" }}>
        <input
          placeholder="🔍 جستجو..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />

        <Link href="/dashboard/products/create" className="primary-btn">
          <Plus size={18} /> افزودن محصول
        </Link>
      </div>

      {!loading && products.filter((p) => p.stock <= lowStockThreshold).length > 0 && (
        <div className="glass-card" style={{ borderColor: "orange" }}>
          ⚠️ {products.filter((p) => p.stock <= lowStockThreshold).length} محصول موجودی کم دارند (آستانه: {lowStockThreshold}):{" "}
          {products
            .filter((p) => p.stock <= lowStockThreshold)
            .map((p) => p.title)
            .join("، ")}
        </div>
      )}

      {loading && <p>در حال بارگذاری...</p>}

      {!loading && products.length === 0 && <p>هنوز محصولی ثبت نشده است.</p>}

      {!loading && products.length > 0 && (() => {
        const filtered = products.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

        if (filtered.length === 0) {
          return <p>محصولی با این عنوان پیدا نشد.</p>;
        }

        return (
        <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>تصویر</th>
              <th>عنوان</th>
              <th>قیمت</th>
              <th>موجودی</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image} alt={product.title} className="admin-table-thumb" />
                  ) : (
                    <span className="admin-table-thumb admin-table-thumb-empty" />
                  )}
                </td>
                <td>{product.title}</td>
                <td>{product.price.toLocaleString("fa-AF")} افغانی</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status-badge ${product.is_available ? "status-active" : "status-inactive"}`}>
                    {product.is_available ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="admin-table-actions">
                  <Link href={`/dashboard/products/edit/${product.id}`} className="icon-btn">
                    <Pencil size={18} />
                  </Link>

                  <Link href={`/dashboard/products/label/${product.id}`} className="icon-btn" title="برچسب محصول">
                    🏷
                  </Link>

                  <button className="icon-btn" onClick={() => handleDelete(product.id)} title="حذف محصول">
                    <Trash2 size={18} color="#EF4444" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        );
      })()}
    </main>
  );
}

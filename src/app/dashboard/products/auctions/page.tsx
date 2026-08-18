"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ManageAuctions() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [productId, setProductId] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [minIncrement, setMinIncrement] = useState("1000");
  const [endsAt, setEndsAt] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const [{ data: productsData }, { data: auctionsData }] = await Promise.all([
      supabase.from("products").select("id, title").eq("is_available", true),
      supabase.from("auctions").select("*, products(title)").order("created_at", { ascending: false }),
    ]);

    setProducts(productsData || []);
    setAuctions(auctionsData || []);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!productId || !startPrice || !endsAt) return;

    setSaving(true);

    const { error } = await supabase.from("auctions").insert({
      product_id: Number(productId),
      start_price: Number(startPrice),
      current_price: Number(startPrice),
      min_increment: Number(minIncrement) || 1000,
      starts_at: new Date().toISOString(),
      ends_at: new Date(endsAt).toISOString(),
      status: "open",
    });

    setSaving(false);

    if (error) {
      alert("ساخت مزایده با خطا مواجه شد: " + error.message);
      return;
    }

    setProductId("");
    setStartPrice("");
    setEndsAt("");
    load();
  }

  async function closeAuction(id: number) {
    const { error } = await supabase.from("auctions").update({ status: "closed" }).eq("id", id);
    if (!error) load();
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">🔨 مدیریت مزایده‌ها</h1>

      <form onSubmit={handleCreate} className="space-y-6">
        <div>
          <label>محصول</label>
          <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
            <option value="">انتخاب کنید</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label>قیمت شروع</label>
          <input type="number" value={startPrice} onChange={(e) => setStartPrice(e.target.value)} required />
        </div>

        <div>
          <label>حداقل افزایش هر پیشنهاد</label>
          <input type="number" value={minIncrement} onChange={(e) => setMinIncrement(e.target.value)} />
        </div>

        <div>
          <label>زمان پایان مزایده</label>
          <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} required />
        </div>

        <button className="primary-btn" type="submit" disabled={saving}>
          {saving ? "در حال ساخت..." : "شروع مزایده"}
        </button>
      </form>

      <h2>مزایده‌های موجود</h2>

      {loading && <p>در حال بارگذاری...</p>}

      {!loading && auctions.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>محصول</th>
              <th>قیمت فعلی</th>
              <th>وضعیت</th>
              <th>پایان</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {auctions.map((a) => (
              <tr key={a.id}>
                <td>{a.products?.title}</td>
                <td>{Number(a.current_price).toLocaleString("fa-AF")} افغانی</td>
                <td>{a.status}</td>
                <td>{new Date(a.ends_at).toLocaleDateString("fa-AF")}</td>
                <td>
                  {a.status === "open" && (
                    <button className="danger-btn" onClick={() => closeAuction(a.id)}>بستن مزایده</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

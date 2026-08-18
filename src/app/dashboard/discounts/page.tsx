"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { logAction } from "@/lib/audit";
import type { Discount } from "@/types/discount";

export default function Discounts() {
  const supabase = createClient();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [percent, setPercent] = useState("");
  const [expire, setExpire] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDiscounts();
  }, []);

  async function loadDiscounts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("discounts")
      .select("*")
      .order("id", { ascending: false });

    if (error) console.log("DISCOUNTS ERROR:", error);
    setDiscounts(data || []);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !percent) return;

    setSaving(true);

    const { error } = await supabase.from("discounts").insert({
      title,
      percent: Number(percent),
      status: true,
      expire: expire || null,
    });

    setSaving(false);

    if (error) {
      alert("ثبت تخفیف با خطا مواجه شد: " + error.message);
      return;
    }

    setTitle("");
    setPercent("");
    setExpire("");
    loadDiscounts();
  }

  async function toggleStatus(id: number, current: boolean) {
    const { error } = await supabase
      .from("discounts")
      .update({ status: !current })
      .eq("id", id);

    if (!error) {
      setDiscounts((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: !current } : d))
      );
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("این تخفیف حذف شود؟")) return;

    const { error } = await supabase.from("discounts").delete().eq("id", id);

    if (!error) {
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
      logAction("delete", "discount", id);
    }
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">🎁 مدیریت تخفیف‌ها</h1>

      <form onSubmit={handleAdd} className="flex">
        <input
          placeholder="عنوان تخفیف"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="درصد"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          required
        />
        <input
          type="date"
          value={expire}
          onChange={(e) => setExpire(e.target.value)}
        />
        <button className="primary-btn" type="submit" disabled={saving}>
          <Plus size={18} /> افزودن
        </button>
      </form>

      {loading && <p>در حال بارگذاری...</p>}
      {!loading && discounts.length === 0 && <p>هیچ تخفیفی ثبت نشده است.</p>}

      {!loading && discounts.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>عنوان</th>
              <th>درصد</th>
              <th>انقضا</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id}>
                <td>{d.title}</td>
                <td>{d.percent}%</td>
                <td>{d.expire ? new Date(d.expire).toLocaleDateString("fa-IR") : "—"}</td>
                <td>
                  <button className={d.status ? "success-btn" : "outline-btn"} onClick={() => toggleStatus(d.id, d.status)}>
                    {d.status ? "فعال" : "غیرفعال"}
                  </button>
                </td>
                <td>
                  <button className="icon-btn" onClick={() => handleDelete(d.id)} title="حذف">
                    <Trash2 size={18} color="#EF4444" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

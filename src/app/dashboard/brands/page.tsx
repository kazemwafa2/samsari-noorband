"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUserRole } from "@/hooks/use-user-role";

export default function Brands() {
  const supabase = createClient();
  const { role } = useUserRole();
  const isAdmin = role === "admin" || role === "super_admin";
  const [brands, setBrands] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("brands").select("*, products(count)").order("title");
    setBrands(data || []);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    const { error } = await supabase.from("brands").insert({ title });
    setSaving(false);

    if (error) {
      alert("ثبت برند با خطا مواجه شد: " + error.message);
      return;
    }

    setTitle("");
    load();
  }

  async function handleDelete(id: number) {
    if (!window.confirm("این برند حذف شود؟")) return;
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (!error) load();
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">🏷 مدیریت برندها</h1>

      <form onSubmit={handleAdd} className="flex">
        <input
          placeholder="نام برند"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button className="primary-btn" type="submit" disabled={saving}>
          <Plus size={18} /> افزودن
        </button>
      </form>

      {loading && <p>در حال بارگذاری...</p>}
      {!loading && brands.length === 0 && <p>هنوز برندی ثبت نشده.</p>}

      {!loading && brands.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>نام برند</th>
              <th>تعداد محصول</th>
              {isAdmin && <th>عملیات</th>}
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.products?.[0]?.count ?? 0}</td>
                {isAdmin && (
                  <td>
                    <button className="icon-btn" onClick={() => handleDelete(b.id)} title="حذف">
                      <Trash2 size={18} color="#EF4444" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

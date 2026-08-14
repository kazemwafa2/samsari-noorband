"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useUserRole } from "@/hooks/use-user-role";

function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF-]/g, "");
}

export default function Categories() {
  const supabase = createClient();
  const { role } = useUserRole();
  const isAdmin = role === "admin" || role === "super_admin";
  const [categories, setCategories] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [parentId, setParentId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*, products(count)").order("title");
    setCategories(data || []);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);

    const { error } = await supabase.from("categories").insert({
      title,
      slug: slugify(title),
      parent_id: parentId ? Number(parentId) : null,
      image_url: imageUrl || null,
    });

    setSaving(false);

    if (error) {
      alert("ثبت دسته‌بندی با خطا مواجه شد: " + error.message);
      return;
    }

    setTitle("");
    setParentId("");
    setImageUrl("");
    load();
  }

  async function handleDelete(id: number) {
    if (!window.confirm("این دسته‌بندی حذف شود؟")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) load();
  }

  // عکس دسته‌بندی از داخل جدول هم قابل تغییر است — چون خیلی از
  // دسته‌بندی‌های موجود قبل از اضافه‌شدن این قابلیت ساخته شده بودند.
  async function handleUpdateImage(id: number, url: string) {
    const { error } = await supabase.from("categories").update({ image_url: url }).eq("id", id);
    if (!error) load();
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">📂 مدیریت دسته‌بندی‌ها</h1>

      <form onSubmit={handleAdd} className="flex flex-col gap-3" style={{ maxWidth: 420 }}>
        <input
          placeholder="نام دسته‌بندی"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={parentId} onChange={(e) => setParentId(e.target.value)}>
          <option value="">بدون دسته والد (اصلی)</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        <div>
          <p style={{ marginBottom: 8 }}>عکس دسته‌بندی (برای نمایش در صفحه اصلی)</p>
          <ImageUploader value={imageUrl} onUploaded={setImageUrl} folder="categories" />
        </div>

        <button className="primary-btn" type="submit" disabled={saving}>
          <Plus size={18} /> افزودن
        </button>
      </form>

      {loading && <p>در حال بارگذاری...</p>}

      {!loading && categories.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>عکس</th>
              <th>نام</th>
              <th>زیرمجموعه‌ی</th>
              <th>تعداد محصول</th>
              {isAdmin && <th>عملیات</th>}
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>
                  {isAdmin ? (
                    <ImageUploader
                      value={c.image_url}
                      onUploaded={(url) => handleUpdateImage(c.id, url)}
                      folder="categories"
                    />
                  ) : (
                    c.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image_url} alt={c.title} width={48} height={48} />
                    ) : (
                      <span>بدون تصویر</span>
                    )
                  )}
                </td>
                <td>{c.title}</td>
                <td>{categories.find((p) => p.id === c.parent_id)?.title || "—"}</td>
                <td>{c.products?.[0]?.count ?? 0}</td>
                {isAdmin && (
                  <td>
                    <button className="icon-btn" onClick={() => handleDelete(c.id)} title="حذف">
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

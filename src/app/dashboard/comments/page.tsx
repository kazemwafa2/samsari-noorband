"use client";

import { useEffect, useState } from "react";
import { Trash2, Check, X } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { logAction } from "@/lib/audit";

// توجه مهم: هیچ جدول comments در پروژه تعریف نشده بود (نه type، نه هیچ
// اشاره‌ای در کد). ساختار زیر یک فرض معقول است:
// comments(id, product_id, user_id, content, rating, is_approved, created_at)
// این جدول را باید در migration (فایل db/schema.sql) بسازی؛ اگر ستون‌های
// دیگری در نظر داری، این select/update را با آن‌ها هماهنگ کن.

export default function Comments() {
  const supabase = createClient();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  useEffect(() => {
    loadComments();
  }, [filter]);

  async function loadComments() {
    setLoading(true);

    let query = supabase
      .from("comments")
      .select("*, products(title), profiles(name)")
      .order("created_at", { ascending: false });

    if (filter === "pending") query = query.eq("is_approved", false);
    if (filter === "approved") query = query.eq("is_approved", true);

    const { data, error } = await query;

    if (error) console.log("COMMENTS ERROR:", error);
    setComments(data || []);
    setLoading(false);
  }

  async function approve(id: number) {
    const { error } = await supabase
      .from("comments")
      .update({ is_approved: true })
      .eq("id", id);

    if (!error) {
      logAction("approve", "comment", id);
      loadComments();
    }
  }

  async function remove(id: number) {
    if (!window.confirm("این نظر حذف شود؟")) return;

    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (!error) {
      logAction("delete", "comment", id);
      loadComments();
    }
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">💬 مدیریت نظرات</h1>

      <div className="flex">
        <button className="outline-btn" onClick={() => setFilter("pending")}>در انتظار تایید</button>
        <button className="outline-btn" onClick={() => setFilter("approved")}>تاییدشده</button>
        <button className="outline-btn" onClick={() => setFilter("all")}>همه</button>
      </div>

      {loading && <p>در حال بارگذاری...</p>}
      {!loading && comments.length === 0 && <p>نظری برای نمایش نیست.</p>}

      {!loading && comments.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>محصول</th>
              <th>کاربر</th>
              <th>متن</th>
              <th>امتیاز</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c.id}>
                <td>{c.products?.title || "—"}</td>
                <td>{c.profiles?.name || "—"}</td>
                <td>{c.content}</td>
                <td>{c.rating ? "⭐".repeat(c.rating) : "—"}</td>
                <td>{c.is_approved ? "تاییدشده" : "در انتظار"}</td>
                <td className="flex">
                  {!c.is_approved && (
                    <button className="icon-btn" onClick={() => approve(c.id)} title="تایید">
                      <Check size={18} color="#22C55E" />
                    </button>
                  )}
                  <button className="icon-btn" onClick={() => remove(c.id)} title="حذف">
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

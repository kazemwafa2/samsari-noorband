"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/types/notification";

export default function Notifications() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) console.log("NOTIFICATIONS ERROR:", error);
    setNotifications(data || []);
    setLoading(false);
  }

  async function handleBroadcast(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !messageText) return;

    setSending(true);

    // اطلاع‌رسانی عمومی: به تمام کاربران از جدول profiles ارسال می‌شود
    const { data: users } = await supabase.from("profiles").select("id");

    if (users && users.length > 0) {
      const rows = users.map((u: any) => ({
        user_id: u.id,
        title,
        message: messageText,
        type: "system" as const,
        is_read: false,
      }));

      const { error } = await supabase.from("notifications").insert(rows);

      if (error) {
        alert("ارسال اعلان با خطا مواجه شد: " + error.message);
      } else {
        setTitle("");
        setMessageText("");
        loadNotifications();
      }
    }

    setSending(false);
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">🔔 مدیریت اعلان‌ها</h1>

      <form onSubmit={handleBroadcast} className="space-y-6">
        <input
          placeholder="عنوان اعلان"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="متن اعلان"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          required
        />
        <button className="primary-btn" type="submit" disabled={sending}>
          {sending ? "در حال ارسال..." : "ارسال به همه کاربران"}
        </button>
      </form>

      <h2>اعلان‌های اخیر</h2>

      {loading && <p>در حال بارگذاری...</p>}
      {!loading && notifications.length === 0 && <p>اعلانی ثبت نشده است.</p>}

      {!loading && notifications.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>عنوان</th>
              <th>پیام</th>
              <th>نوع</th>
              <th>تاریخ</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.id}>
                <td>{n.title}</td>
                <td>{n.message}</td>
                <td>{n.type}</td>
                <td>{new Date(n.created_at).toLocaleDateString("fa-IR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

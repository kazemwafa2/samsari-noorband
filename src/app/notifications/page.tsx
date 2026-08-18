"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";

const TYPE_ICONS: Record<string, string> = {
  order: "🛒",
  payment: "💳",
  discount: "🔥",
  wishlist: "❤️",
  product: "✨",
  delivery: "🚚",
  account: "👤",
  system: "📩",
};

// نسخه قبلی این صفحه یک آرایه کاملا ثابت و فیک بود (سفارش، تخفیف و...
// با متن‌های از پیش نوشته‌شده) که هیچ ارتباطی با دیتابیس نداشت. حالا:
// ۱) داده واقعی از جدول notifications خوانده می‌شود
// ۲) با Supabase Realtime، اعلان جدید بدون رفرش صفحه ظاهر می‌شود

export default function NotificationsPage() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      await load(user.id);

      // اشتراک زنده: هر اعلان جدیدی که برای این کاربر insert شود،
      // بدون رفرش صفحه بالای لیست اضافه می‌شود
      channel = supabase
        .channel("notifications-live")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
          (payload) => {
            setNotifications((prev) => [payload.new, ...prev]);
          }
        )
        .subscribe();
    }

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  async function load(userId: string) {
    setLoading(true);

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) console.log("NOTIFICATIONS ERROR:", error);
    setNotifications(data || []);
    setLoading(false);
  }

  async function markAsRead(id: number) {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  }

  return (
    <div className="container home-page">
      <h1 className="section-title">{t("notifications", language)}</h1>

      {loading && <p>{t("loadingText", language)}</p>}
      {!loading && notifications.length === 0 && <p>{t("notificationsEmpty", language)}</p>}

      <div className="grid">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="card"
            onClick={() => !item.is_read && markAsRead(item.id)}
            style={{ opacity: item.is_read ? 0.6 : 1, cursor: "pointer" }}
          >
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <div style={{ fontSize: "35px" }}>{TYPE_ICONS[item.type] || "📩"}</div>

              <div>
                <h3>{item.title}</h3>
                <p>{item.message}</p>
                <p style={{ color: "#6B7280", marginTop: "5px" }}>
                  {new Date(item.created_at).toLocaleString(language === "en" ? "en-US" : "fa-AF")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// نکته اصلاح‌شده: صفحه /notifications از قبل درست به دیتابیس وصل بود
// و پیام‌های واقعی را نشان می‌داد — اما این فقط وقتی کار می‌کرد که
// کاربر مستقیم وارد همان صفحه شده باشد. دو مشکل اصلی:
// ۱) آیکون زنگ در نوار بالا هیچ‌وقت شمارنده نداشت (برخلاف سبد خرید و
//    علاقه‌مندی‌ها که شمارنده دارند) — کاربر هیچ‌وقت نمی‌فهمید چند
//    اعلان نخوانده دارد بدون اینکه وارد آن صفحه شود.
// ۲) اگر اعلان جدیدی می‌رسید در حالی که کاربر جای دیگری از سایت بود
//    (نه داخل /notifications)، هیچ پیامی به او نشان داده نمی‌شد —
//    اشتراک Realtime فقط داخل همان صفحه فعال بود.
// این هوک در Navbar.tsx (که در همه صفحات مانت است) استفاده می‌شود تا
// هم شمارنده همیشه به‌روز باشد، هم با رسیدن هر اعلان جدید، فورا یک
// toast نشان داده شود — هرجای سایت که کاربر باشد.
export function useUnreadNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      setUnreadCount(count || 0);

      channel = supabase
        .channel("notifications-badge")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
          (payload) => {
            setUnreadCount((prev) => prev + 1);

            const row = payload.new as { title?: string; message?: string };
            toast(row.title || "اعلان جدید", {
              description: row.message,
            });
          }
        )
        .subscribe();
    }

    init();

    // نکته: وقتی کاربر داخل صفحه /notifications یک اعلان را می‌خواند،
    // آن صفحه این رویداد سراسری را می‌فرستد تا شمارنده همین‌جا (که در
    // نمونه‌ی دیگری از این هوک زندگی می‌کند) هم بلافاصله کم شود —
    // چون Navbar بین ناوبری صفحات دوباره mount نمی‌شود.
    function handleRead() {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    window.addEventListener("noorband:notification-read", handleRead);

    return () => {
      if (channel) supabase.removeChannel(channel);
      window.removeEventListener("noorband:notification-read", handleRead);
    };
  }, []);

  return { unreadCount };
}

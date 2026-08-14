"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Announcement {
  id: number;
  title: string;
}

// نوار نازک بالای سایت (بالاتر از ناوبار) — چک‌لیست: طرح مرجع یک نوار
// صورتی با پیام‌های در حال چرخش دارد («ارسال رایگان...»، «تخفیف ویژه
// رمضان ۳۰٪...») که قبلا اصلا در پروژه وجود نداشت. از همان جدول
// banners با zone جدید "announcement" پر می‌شود (از پنل مدیریت →
// بنرها قابل مدیریت است) — اگر هیچ پیامی ثبت نشده باشد، این نوار
// اصلا رندر نمی‌شود.
export default function TopAnnouncementBar() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("banners")
      .select("id, title")
      .eq("zone", "announcement")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => setItems(data || []));
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="top-announcement-bar">
      <span key={items[index].id}>{items[index].title}</span>
    </div>
  );
}

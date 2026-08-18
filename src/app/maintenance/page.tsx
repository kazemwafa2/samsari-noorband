"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Maintenance() {
  const supabase = createClient();
  const [message, setMessage] = useState("");
  const [endsAt, setEndsAt] = useState<string | null>(null);
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!endsAt) return;

    const interval = setInterval(() => {
      const diff = new Date(endsAt).getTime() - Date.now();

      if (diff <= 0) {
        setRemaining("به‌زودی برمی‌گردیم...");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setRemaining(`${hours} ساعت ${minutes} دقیقه ${seconds} ثانیه`);
    }, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  async function load() {
    const { data } = await supabase
      .from("site_settings")
      .select("maintenance_message, maintenance_ends_at")
      .eq("id", 1)
      .single();

    if (data) {
      setMessage(data.maintenance_message || "سایت در حال بروزرسانی است، به‌زودی برمی‌گردیم.");
      setEndsAt(data.maintenance_ends_at);
    }
  }

  return (
    <div className="min-h-screen center">
      <div className="glass-card">
        <h1 className="section-title">🚧 در حال تعمیر و نگهداری</h1>
        <p>{message}</p>

        {endsAt && (
          <p>
            زمان تقریبی بازگشایی: <strong>{remaining}</strong>
          </p>
        )}

        <p>برای اطلاعات بیشتر با ما تماس بگیرید.</p>
      </div>
    </div>
  );
}

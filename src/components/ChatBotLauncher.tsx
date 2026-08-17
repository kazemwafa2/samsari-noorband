"use client";

import { useState } from "react";
import { X } from "lucide-react";
import ChatBot from "./ChatBot";
import ParticleSphere from "./ParticleSphere";

// ChatBot.tsx از قبل کاملا کار می‌کرد (اتصال واقعی به /api/ai) ولی خودِ
// آن هیچ‌جای اپ import نشده بود — یعنی «دکمه شناور چت‌بات هوش مصنوعی»ی
// چک‌لیست هیچ‌وقت روی سایت دیده نمی‌شد. این کامپوننت فقط دکمه شناور باز/
// بسته‌کردن را اضافه می‌کند، بدون دست‌زدن به منطق داخلی ChatBot.
//
// آواتار قبلی یک ماسکوت ربات ثابت (SVG بدون حرکت) بود. حالا با همان
// انیمیشن «کره‌ی ذره‌ای» که کاربر خواسته بود (src/components/
// ParticleSphere.tsx) جایگزین شد — چون این دکمه دقیقا نماد هوش مصنوعی
// سایت است و در همه صفحات دیده می‌شود، جای طبیعی این جلوه همین‌جاست.

export default function ChatBotLauncher() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="floating-ai"
        aria-label="دستیار هوشمند نوربند"
      >
        <ParticleSphere size={40} />
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "calc(90px + env(safe-area-inset-bottom))",
        right: 16,
        zIndex: 9999,
        width: "min(360px, calc(100vw - 32px))",
        maxHeight: "min(560px, calc(100vh - 120px))",
        overflowY: "auto",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="primary-btn"
        style={{ marginBottom: 8, display: "inline-flex", alignItems: "center", gap: 6 }}
        aria-label="بستن چت‌بات"
      >
        <X size={18} /> بستن
      </button>
      <ChatBot />
    </div>
  );
}

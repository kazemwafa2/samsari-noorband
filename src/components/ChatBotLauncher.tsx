"use client";

import { useState } from "react";
import { X } from "lucide-react";
import ChatBot from "./ChatBot";

// ChatBot.tsx از قبل کاملا کار می‌کرد (اتصال واقعی به /api/ai) ولی خودِ
// آن هیچ‌جای اپ import نشده بود — یعنی «دکمه شناور چت‌بات هوش مصنوعی»ی
// چک‌لیست هیچ‌وقت روی سایت دیده نمی‌شد. این کامپوننت فقط دکمه شناور باز/
// بسته‌کردن را اضافه می‌کند، بدون دست‌زدن به منطق داخلی ChatBot.
//
// آیکون ایموجی 🤖 خام با یک ماسکوت رباتِ دوست‌داشتنی و طراحی‌شده (SVG)
// جایگزین شد — با چشم‌های براق و آنتن، هماهنگ با رنگ برند نوربند.
function NoorbandAiAvatar() {
  return (
    <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
      <defs>
        <linearGradient id="noorband-ai-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5F3FF" />
        </linearGradient>
      </defs>

      {/* آنتن */}
      <circle cx="32" cy="7" r="3" fill="#FBBF24" />
      <line x1="32" y1="10" x2="32" y2="16" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />

      {/* سر */}
      <rect x="12" y="16" width="40" height="34" rx="14" fill="url(#noorband-ai-face)" />

      {/* چشم‌ها */}
      <circle cx="24" cy="33" r="5" fill="#8B5CF6" />
      <circle cx="40" cy="33" r="5" fill="#8B5CF6" />
      <circle cx="25.5" cy="31.5" r="1.6" fill="#fff" />
      <circle cx="41.5" cy="31.5" r="1.6" fill="#fff" />

      {/* لبخند */}
      <path d="M23 41c3 4 15 4 18 0" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* گونه‌های صورتی */}
      <circle cx="17" cy="38" r="2.5" fill="#FBBF24" opacity=".55" />
      <circle cx="47" cy="38" r="2.5" fill="#FBBF24" opacity=".55" />
    </svg>
  );
}

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
        <NoorbandAiAvatar />
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 25,
        right: 20,
        zIndex: 999,
        width: "min(360px, calc(100vw - 40px))",
        maxHeight: "min(560px, calc(100vh - 100px))",
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

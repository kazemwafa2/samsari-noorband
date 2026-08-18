"use client";

import ChatBot from "@/components/ChatBot";

export default function NOORBANDAI() {
  return (
    <main className="home-page space-y-6">

      <h1 className="section-title">
        🧠 NOORBAND AI
      </h1>

      <div
        className="
          card
          backdrop-blur-xl
          bg-white/10
          border
          border-white/20
          rounded-3xl
          p-5
        "
      >
        <p>
          دستیار هوشمند فروشگاه نوربند
        </p>

        <p className="mt-2 text-sm opacity-80">
          جستجوی محصولات، پاسخ به سوالات، پردازش تصویر و فایل صوتی
        </p>
      </div>

      <ChatBot />

    </main>
  );
}
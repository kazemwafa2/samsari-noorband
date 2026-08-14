"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Image as ImageIcon, Mic, Trash2, X, User } from "lucide-react";

import { getMessage } from "@/constants/messages";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

import { saveAIMemory, getAIMemory, clearAIMemory } from "@/ai/memory";

type ChatMessage = {
  role: "AI" | "USER";
  text: string;
};

// نام رسمی کسب‌وکار — طبق چک‌لیست باید همه‌جا از جمله ChatBot یکسان باشد.
const BUSINESS_NAME = "سیمساری نوربند جاغوری";

export default function ChatBot() {
  const { language } = useLanguage();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [selectedVoice, setSelectedVoice] = useState<File | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  //========================
  // LOAD MEMORY
  //========================

  useEffect(() => {
    const memory = getAIMemory();

    if (memory.length > 0) {
      setMessages(memory.map((item) => ({ role: item.role, text: item.text })));
      return;
    }

    setMessages([
      {
        role: "AI",
        text: getMessage("VISITOR_MESSAGE", language) || "سلام و خوش آمدید 🌷",
      },
    ]);
  }, []);

  //========================
  // AUTO SCROLL
  //========================

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  //========================
  // SEND MESSAGE
  //========================

  async function sendMessage() {
    if ((!message.trim() && !selectedImage && !selectedVoice) || loading) {
      return;
    }

    const userText = message.trim();

    setMessage("");

    const userMessage = { role: "USER" as const, text: userText };

    setMessages((prev) => [...prev, userMessage]);

    saveAIMemory({ ...userMessage, date: new Date().toISOString() });

    setLoading(true);

    try {
      // نکته: قبلا اینجا مستقیم aiRouter (کد سمت سرور که کلید GROQ_API_KEY
      // را می‌خواند) داخل یک کامپوننت کلاینتی import می‌شد. این باعث می‌شد
      // درخواست AI در مرورگر اجرا شود و به دلیل نبود دسترسی به کلید سرور
      // شکست بخورد. حالا از API route واقعی که از قبل ساخته شده استفاده می‌کنیم.
      //
      // توجه: ارسال فایل صوتی (voice) به این API هنوز پیاده‌سازی نشده،
      // چون نیاز به ارسال multipart/form-data دارد نه JSON ساده.
      // اگر پشتیبانی صوت لازم است، باید /api/ai به فرمت FormData هم مجهز شود.

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          image: selectedImage,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "AI request failed");
      }

      // زبان پاسخ را خودِ aiRouter از روی متن پیام کاربر تشخیص می‌دهد
      // (detectLanguage در src/ai/router.ts) و پاسخ را مستقیما در همان
      // زبان برمی‌گرداند. قبلا اینجا یک لایه «ترجمه» دیگر با یک
      // دیکشنری کوچک و ناقص عبارت‌به‌عبارت (src/utils/translate.ts)
      // روی جواب اجرا می‌شد که هم اضافی بود هم برای اکثر جمله‌ها هیچ
      // تطبیقی پیدا نمی‌کرد و متن را دست‌نخورده (و گاهی مخلوط) رها
      // می‌کرد؛ حذف شد.
      const answer = result.text as string;

      const aiMessage = { role: "AI" as const, text: answer };

      setMessages((prev) => [...prev, aiMessage]);

      saveAIMemory({ ...aiMessage, date: new Date().toISOString() });

      // پاک کردن فایل بعد از ارسال
      setSelectedImage(undefined);
      setSelectedVoice(undefined);
    } catch (error) {
      console.log("NOORBAND AI ERROR:", error);

      setMessages((prev) => [
        ...prev,
        { role: "AI", text: "❌ مشکلی پیش آمد، دوباره تلاش کنید." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  //========================
  // CLEAR CHAT
  //========================

  function clearChat() {
    clearAIMemory();

    setMessages([
      {
        role: "AI",
        text: getMessage("VISITOR_MESSAGE", language),
      },
    ]);
  }

  //========================
  // UI
  //========================

  const imageInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="glass chatbot">
      {/* هدر — نام رسمی کسب‌وکار، طبق چک‌لیست باید در ChatBot هم دیده شود */}
      <div className="chatbot-header">
        <div className="chatbot-header-avatar">
          <Bot size={22} />
        </div>
        <div className="chatbot-header-info">
          <h2>{BUSINESS_NAME}</h2>
          <div className="chatbot-status">
            <span className="chatbot-status-dot" />
            دستیار هوشمند • آنلاین
          </div>
        </div>
        <button
          onClick={clearChat}
          className="chatbot-header-clear"
          title="پاک کردن گفتگو"
          aria-label="پاک کردن گفتگو"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="chatbot-body">
        <div className="chat-box" ref={scrollRef}>
          {messages.map((item, index) => (
            <div key={index} className={`message-row${item.role === "USER" ? " from-user" : ""}`}>
              <div className="message-avatar">
                {item.role === "AI" ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div className={item.role === "AI" ? "ai-message" : "user-message"}>{item.text}</div>
            </div>
          ))}

          {loading && (
            <div className="message-row">
              <div className="message-avatar"><Bot size={14} /></div>
              <div className="ai-message">
                <span className="chatbot-typing"><span /><span /><span /></span>
              </div>
            </div>
          )}
        </div>

        {/* پیوست‌های انتخاب‌شده */}
        {(selectedImage || selectedVoice) && (
          <div className="chatbot-attachments">
            {selectedImage && (
              <span className="chatbot-attachment-chip">
                🖼 تصویر انتخاب شد
                <button onClick={() => setSelectedImage(undefined)} aria-label="حذف تصویر"><X size={12} /></button>
              </span>
            )}
            {selectedVoice && (
              <span className="chatbot-attachment-chip">
                🎤 فایل صوتی (هنوز پشتیبانی نمی‌شود)
                <button onClick={() => setSelectedVoice(undefined)} aria-label="حذف فایل صوتی"><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        {/* آپلود مخفی تصویر و صوت — با دکمه‌های آیکون‌دار زیر باز می‌شوند */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setSelectedImage(String(reader.result));
            reader.readAsDataURL(file);
            e.currentTarget.value = "";
          }}
        />
        <input
          ref={voiceInputRef}
          type="file"
          accept="audio/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setSelectedVoice(file);
            e.currentTarget.value = "";
          }}
        />

        <div className="chatbot-input-row">
          <button
            type="button"
            className="chatbot-icon-btn"
            title="افزودن تصویر"
            aria-label="افزودن تصویر"
            onClick={() => imageInputRef.current?.click()}
          >
            <ImageIcon size={17} />
          </button>
          <button
            type="button"
            className="chatbot-icon-btn"
            title="افزودن فایل صوتی"
            aria-label="افزودن فایل صوتی"
            onClick={() => voiceInputRef.current?.click()}
          >
            <Mic size={17} />
          </button>

          <input
            type="text"
            value={message}
            placeholder="پیام خود را بنویسید..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            className="chatbot-send-btn"
            disabled={loading || (!message.trim() && !selectedImage && !selectedVoice)}
            aria-label="ارسال پیام"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

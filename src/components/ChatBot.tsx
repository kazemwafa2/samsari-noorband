"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  Image as ImageIcon,
  Mic,
  Trash2,
  X,
  User,
} from "lucide-react";

import { getMessage } from "@/constants/messages";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

import {
  saveAIMemory,
  getAIMemory,
  clearAIMemory,
} from "@/ai/memory";

type ChatMessage = {
  role: "AI" | "USER";
  text: string;
};

// نام رسمی کسب‌وکار
const BUSINESS_NAME = "سیمساری نوربند جاغوری";

export default function ChatBot() {
  const { language } = useLanguage();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [selectedVoice, setSelectedVoice] = useState<File | undefined>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);

  //========================
  // LOAD MEMORY
  //========================

  useEffect(() => {
    const memory = getAIMemory();

    if (memory.length > 0) {
      setMessages(
        memory.map((item) => ({
          role: item.role,
          text: item.text,
        }))
      );
      return;
    }

    setMessages([
      {
        role: "AI",
        text:
          getMessage("VISITOR_MESSAGE", language) ||
          "سلام و خوش آمدید 🌷",
      },
    ]);
  }, [language]);

  //========================
  // AUTO SCROLL
  //========================

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  //========================
  // SEND MESSAGE
  //========================

  async function sendMessage() {
    if (
      (!message.trim() && !selectedImage && !selectedVoice) ||
      loading
    ) {
      return;
    }

    const userText = message.trim();

    setMessage("");

    const userMessage = {
      role: "USER" as const,
      text: userText,
    };

    setMessages((prev) => [...prev, userMessage]);

    saveAIMemory({
      ...userMessage,
      date: new Date().toISOString(),
    });

    setLoading(true);

    try {
      /*
       * زمان و منطقه زمانی واقعی دستگاه کاربر.
       *
       * این اطلاعات فقط برای شخصی‌سازی پاسخ AI فرستاده می‌شود.
       * کلید GROQ هرگز به مرورگر ارسال نمی‌شود.
       */

      const now = new Date();

      const timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone;

      const localHour = Number(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          hour12: false,
          timeZone: timezone,
        }).format(now)
      );

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          image: selectedImage,

          // زمان و منطقه زمانی واقعی دستگاه کاربر
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          localHour: new Date().getHours(),

  // زبان رابط کاربر (همان زبانی که سایت از قبل برای این کاربر
  // تشخیص داده — middleware/جغرافیا/انتخاب کاربر)
  interfaceLanguage: language,

  // چند پیام آخر گفتگو، تا پاسخ هوش مصنوعی با ادامه‌ی مکالمه هماهنگ
  // بماند و هر بار مسیر عوض نکند. قبلا این‌جا اصلا فرستاده نمی‌شد.
  history: messages.slice(-10).map((item) => ({
    role: item.role === "AI" ? "assistant" : "user",
    content: item.text,
  })),
}),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "AI request failed"
        );
      }

      const answer =
        typeof result.text === "string" && result.text.trim()
          ? result.text
          : "متأسفانه در حال حاضر نتوانستم پاسخ مناسبی آماده کنم.";

      const aiMessage = {
        role: "AI" as const,
        text: answer,
      };

      setMessages((prev) => [...prev, aiMessage]);

      saveAIMemory({
        ...aiMessage,
        date: new Date().toISOString(),
      });

      setSelectedImage(undefined);
      setSelectedVoice(undefined);
    } catch (error) {
      console.error("NOORBAND AI ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "AI",
          text:
            "متأسفانه در ارتباط با دستیار هوشمند مشکلی پیش آمد. لطفاً دوباره تلاش کنید. 🌷",
        },
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
        text:
          getMessage("VISITOR_MESSAGE", language) ||
          "سلام و خوش آمدید 🌷",
      },
    ]);
  }

  //========================
  // UI
  //========================

  return (
    <div className="glass chatbot">

      {/* HEADER */}

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

      {/* CHAT BODY */}

      <div className="chatbot-body">

        <div
          className="chat-box"
          ref={scrollRef}
        >
          {messages.map((item, index) => (
            <div
              key={`${item.role}-${index}`}
              className={
                item.role === "AI"
                  ? "chat-message ai-message"
                  : "chat-message user-message"
              }
            >
              <div className="chat-message-icon">
                {item.role === "AI" ? (
                  <Bot size={17} />
                ) : (
                  <User size={17} />
                )}
              </div>

              <div className="chat-message-text">
                {item.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message ai-message">
              <div className="chat-message-icon">
                <Bot size={17} />
              </div>

              <div className="chat-message-text">
                در حال پاسخ‌گویی... 🌷
              </div>
            </div>
          )}
        </div>

        {/* IMAGE PREVIEW */}

        {selectedImage && (
          <div className="chatbot-attachment">
            <img
              src={selectedImage}
              alt="تصویر انتخاب‌شده"
            />

            <button
              type="button"
              onClick={() => setSelectedImage(undefined)}
              aria-label="حذف تصویر"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* INPUT */}

        <div className="chatbot-input-area">

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (!file) return;

              const reader = new FileReader();

              reader.onload = () => {
                setSelectedImage(
                  typeof reader.result === "string"
                    ? reader.result
                    : undefined
                );
              };

              reader.readAsDataURL(file);
            }}
          />

          <input
            ref={voiceInputRef}
            type="file"
            accept="audio/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                setSelectedVoice(file);
              }
            }}
          />

          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            title="ارسال تصویر"
            aria-label="ارسال تصویر"
          >
            <ImageIcon size={19} />
          </button>

          <button
            type="button"
            onClick={() => voiceInputRef.current?.click()}
            title="ارسال صدا"
            aria-label="ارسال صدا"
          >
            <Mic size={19} />
          </button>

          <input
            type="text"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();
                sendMessage();
              }
            }}
            placeholder="پیام خود را بنویسید..."
            disabled={loading}
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={
              loading ||
              (!message.trim() &&
                !selectedImage &&
                !selectedVoice)
            }
            title="ارسال پیام"
            aria-label="ارسال پیام"
          >
            <Send size={19} />
          </button>

        </div>
      </div>
    </div>
  );
}

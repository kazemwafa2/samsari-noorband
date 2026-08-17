import { searchProductsAI } from "./search";
import { recommendAI } from "./recommend";
import { imageAI } from "./image";
import { voiceAI } from "./voice";
import { detectLanguage, isSupportedLanguage, type SupportedLanguage } from "./detectLanguage";
import { getPersonality } from "./personality";
import { orderIntentAI } from "./orders";
import { getSystemPrompt } from "./systemPrompt";
import { askGroq, type GroqHistoryTurn } from "@/lib/groq";

 type AIRequest = {
  message?: string;
  image?: string;
  voice?: File;
  userId?: string;
  timezone?: string;
  localHour?: number;
  // زبانی که خود سایت (middleware/جغرافیا/انتخاب صریح کاربر در
  // LanguageProvider) از قبل برای این کاربر تشخیص داده — قبلا این
  // مقدار از فرانت‌اند فرستاده می‌شد ولی اینجا اصلا خوانده نمی‌شد.
  interfaceLanguage?: string;
  // چند پیام آخر مکالمه، برای اینکه Groq جواب مرتبط با ادامه‌ی گفتگو
  // بدهد، نه هر بار از صفر.
  history?: GroqHistoryTurn[];
};

type AIRouterResponse = {
  success: boolean;

  type:
    | "image"
    | "voice"
    | "product"
    | "recommend"
    | "order"
    | "general"
    | "error";

  text: string;
  language: string;
};

export async function aiRouter({
  message = "",
  image,
  voice,
  userId,
  timezone,
  localHour,
  interfaceLanguage,
  history = [],
}: AIRequest): Promise<AIRouterResponse> {
  // قانون زبان: زبان همان پیام فعلی (اگر با اطمینان از روی متن قابل
  // تشخیص باشد) اولویت دارد؛ چون طبق قانون ۳ سیستم‌پرامپت، اگر کاربر
  // وسط گفتگو زبانش را عوض کرد، پاسخ هم باید عوض شود. اما وقتی پیام
  // فاقد نشانه‌ی زبانی مشخص است (سلام‌های کوتاه، پیام خالی، و...)،
  // به‌جای پیش‌فرض کورکورانه‌ی «دری»، همان زبانی که خود سایت از قبل
  // برای این کاربر تشخیص داده (interfaceLanguage) استفاده می‌شود —
  // این همان چیزی است که قبلا اصلا به aiRouter نمی‌رسید.
  const language: SupportedLanguage =
    detectLanguage(message) ??
    (isSupportedLanguage(interfaceLanguage) ? interfaceLanguage : "prs");

  try {
    const lowerMessage = message.toLowerCase();

    //====================
    // IMAGE
    //====================

    if (image) {
      const result = await imageAI(image, language);

      return {
        success: true,
        type: "image",
        text: result,
        language,
      };
    }

    //====================
    // VOICE
    //====================

    if (voice) {
      const result = await voiceAI(voice);

      return {
        success: true,
        type: "voice",
        text: result,
        language,
      };
    }

    //====================
    // ORDER (رهگیری/لغو/لیست سفارش) — قبلا این بخش اصلا وجود نداشت
    //====================

    if (userId && message.trim()) {
      const orderReply = await orderIntentAI(userId, message);

      if (orderReply) {
        return {
          success: true,
          type: "order",
          text: orderReply,
          language,
        };
      }
    }

    //====================
    // احوال‌پرسی/گفتگوی عمومی — قبلا حتی «سلام» هم اول به‌عنوان جستجوی
    // محصول با کلمه «سلام» به دیتابیس فرستاده می‌شد که هم غیرضروری بود
    // هم ریسک تطبیق اشتباه با نام/توضیح یک محصول را داشت. حالا این نوع
    // پیام‌های کوتاه مستقیم به هوش مصنوعی عمومی (Groq) سپرده می‌شوند.
    //====================

    const GREETING_PATTERNS = [
      "سلام", "درود", "احوال", "چطوری", "چطورین", "خوبی", "صبح بخیر", "ظهر بخیر", "عصر بخیر", "شب بخیر",
      "hi", "hello", "hey", "salam", "chetor",
    ];
    const isGreeting = GREETING_PATTERNS.some((p) => lowerMessage.includes(p));

    //====================
    // PRODUCT SEARCH
    //====================

    if (message.trim() && !isGreeting) {
      const products = await searchProductsAI(message);

      if (
        products &&
        !products.includes("پیدا نشد") &&
        !products.includes("لطفاً نام محصول")
      ) {
        return {
          success: true,
          type: "product",
          text: products,
          language,
        };
      }
    }

    //====================
    // RECOMMENDATION
    //====================

    if (
      lowerMessage.includes("پیشنهاد") ||
      lowerMessage.includes("محصول مشابه") ||
      lowerMessage.includes("recommend")
    ) {
      const recommendation = await recommendAI(message);

      return {
        success: true,
        type: "recommend",
        text: recommendation,
        language,
      };
    }

    //====================
    // NOORBAND AI — پاسخ واقعی و مرتبط با پیام کاربر
    // (قبلا اینجا smartAI صدا زده می‌شد که به پیام کاربر اصلا نگاه
    // نمی‌کرد و همیشه یک متن قالبی/عمومی برمی‌گرداند — یعنی اگر کاربر
    // فقط «سلام» می‌گفت، یک انبوه پیام نامرتبط «فصل/آب‌وهوا/VIP...»
    // می‌دید. چون آن تابع هیچ‌وقت شکست نمی‌خورد، Groq (هوش مصنوعی واقعی)
    // هم عملا هیچ‌وقت اجرا نمی‌شد. حالا مستقیما از Groq با system prompt
    // مناسب (شامل دستورالعمل خوش‌آمدگویی، دسته‌بندی‌ها و قوانین پاسخ)
    // استفاده می‌شود تا پاسخ واقعا به پیام کاربر مرتبط باشد.
    //====================

    const groq = await askGroq(
      message,
      getSystemPrompt(language, {
        timezone,
        localHour,
      }),
      history
    );
    const groqText = groq?.choices?.[0]?.message?.content;

    return {
      success: true,
      type: "general",
      text: groqText ?? "متاسفانه در حال حاضر نمی‌توانم پاسخ بدهم، لطفاً دوباره تلاش کنید.",
      language,
    };
  } catch (error) {
    console.log("AI ROUTER ERROR:", error);

    return {
      success: false,
      type: "error",
      text:
        "متأسفانه در پردازش درخواست شما مشکلی رخ داد.",
      language,
    };
  }
}

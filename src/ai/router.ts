import { searchProductsAI } from "./search";
import { recommendAI } from "./recommend";
import { imageAI } from "./image";
import { voiceAI } from "./voice";
import { detectLanguage, isSupportedLanguage, type SupportedLanguage } from "./detectLanguage";
import { getPersonality } from "./personality";
import { orderIntentAI, looksLikeIssueReport, reportIssueToAdmin } from "./orders";
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
    // ORDER (رهگیری/لغو/لیست سفارش) — قبلا این بخش فقط برای کاربر
    // لاگین‌شده اجرا می‌شد. حالا حتی کاربر مهمان هم می‌تواند با کد
    // پیگیری سفارشش را دنبال کند (orderIntentAI خودش تصمیم می‌گیرد چه
    // چیزی بدون ورود مجاز است).
    //====================

    if (message.trim()) {
      const orderReply = await orderIntentAI(userId || "", message);

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
    // نکته مهم: قبلا هر پیام غیر-احوال‌پرسی (حتی سؤال‌های کاملا عمومی
    // مثل «الان ساعت چنده؟» یا «من اهل کجام؟») اول مستقیم به جستجوی
    // محصول در دیتابیس فرستاده می‌شد. یعنی اگر آن جستجو با خطا مواجه
    // می‌شد (مثلا چون پیام کاما داشت و فیلتر .or() را خراب می‌کرد)،
    // متن خطای آن مستقیم به‌جای پاسخ به کاربر نشان داده می‌شد — بدون
    // اینکه اصلا به Groq (هوش مصنوعی واقعی) برسد. حالا فقط وقتی پیام
    // واقعا نشانه‌ی سؤال درباره‌ی محصول/قیمت/موجودی دارد (به چند زبان)
    // جستجوی محصول اجرا می‌شود؛ در غیر این‌صورت مستقیم به Groq می‌رود
    // تا بتواند به هر نوع سؤالی (عمومی، آدرس فروشگاه، ساعت، و...)
    // واقعا پاسخ مرتبط بدهد.
    const PRODUCT_INTENT_PATTERNS = [
      // دری/فارسی — نکته اصلاح‌شده: قبلا فقط شکل رسمی «دارید/دارین»
      // پوشش داده می‌شد. «چی داری؟» (محاوره‌ای، خیلی پرکاربردتر در
      // مکالمه‌ی واقعی) با هیچ‌کدام از این‌ها تطبیق نمی‌کرد و پیام
      // مستقیم به Groq می‌رفت که اطلاعات واقعی محصول را نداشت و مجبور
      // بود بگوید «اطلاعات دقیق ندارم».
      "قیمت", "چنده", "چند است", "دارید", "دارین", "داری", "موجود", "خرید", "فروش", "محصول", "جنس",
      "می‌خواهم", "میخوام", "می‌خوام",
      // پشتو
      "بیه", "لرئ",
      // انگلیسی
      "price", "cost", "buy", "purchase", "product", "available", "stock", "have", "want",
      // عربی
      "سعر", "منتج", "متوفر", "اشتري",
      // فرانسوی
      "prix", "produit", "acheter", "disponible",
      // آلمانی
      "preis", "produkt", "kaufen", "verfügbar",
    ];
    const looksLikeProductQuestion = PRODUCT_INTENT_PATTERNS.some((p) =>
      lowerMessage.includes(p)
    );

    if (message.trim() && !isGreeting && looksLikeProductQuestion) {
      const products = await searchProductsAI(message);

      // چک مثبت: فقط وقتی واقعا نتیجه‌ی معتبر جستجو برگشته (که همیشه با
      // این پیشوند شروع می‌شود) به‌عنوان پاسخ محصول قبول می‌شود. قبلا
      // اینجا فقط دو رشته‌ی خاص («پیدا نشد» و «لطفاً نام محصول») حذف
      // می‌شدند و هر پیام خطای دیگری (مثل «مشکلی پیش آمد») به اشتباه
      // به‌عنوان یک پاسخ معتبر به کاربر نشان داده می‌شد.
      if (products && products.startsWith("🌸 محصولات پیدا شده")) {
        return {
          success: true,
          type: "product",
          text: products,
          language,
        };
      }
      // در غیر این‌صورت (پیدا نشد/خطا/کلیدواژه خالی) از حلقه ادامه
      // می‌دهیم تا Groq با توجه به کل مکالمه پاسخ مناسب بدهد — نه یک
      // پیام خطای خام دیتابیس.
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

    // گزارش مشکل به ادمین — روی محیط Cloudflare Workers که این پروژه
    // دیپلوی می‌شود، یک Promise رهاشده (بدون await) ممکن است قبل از
    // تمام‌شدن، همراه با پایان پاسخ کشته شود؛ برای همین عمدا await
    // می‌شود تا گزارش واقعا گم نشود، نه اینکه فقط ارسال پاسخ به کاربر
    // را کند کند (درج یک ردیف اعلان معمولا خیلی سریع است).
    if (message.trim() && looksLikeIssueReport(message)) {
      await reportIssueToAdmin(userId, message);
    }

    return {
      success: true,
      type: "general",
      text: groqText ?? "متاسفانه در حال حاضر نمی‌توانم پاسخ بدهم، لطفاً دوباره تلاش کنید.",
      language,
    };
  } catch (error) {
    console.error(
      "AI ROUTER ERROR:",
      error instanceof Error ? error.message : error
    );

    return {
      success: false,
      type: "error",
      text:
        "متأسفانه در پردازش درخواست شما مشکلی رخ داد.",
      language,
    };
  }
}

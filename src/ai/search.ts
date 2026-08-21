//==================================
// NOORBAND AI SEARCH SYSTEM
//==================================

import { getMessage } from "@/constants/messages";
import type { Language } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/server";

//==================================
// MAIN SEARCH ROUTER
//==================================

export async function SEARCH_SYSTEM_AI(type: string, message: string = "", language: string = "fa") {
  switch (type) {
    case "WELCOME":
      return {
        success: true,
        message: getMessage("WELCOME_MESSAGE", language as Language),
        searchType: "WELCOME",
        data: null,
      };

    case "PRODUCT": {
      const products = await searchProductAI(message);

      return {
        success: true,
        message: products,
        searchType: "PRODUCT",
        data: products,
      };
    }

    case "SEARCH":
      return {
        success: true,
        message: getMessage("SEARCH_MESSAGE", language as Language),
        searchType: "SEARCH",
        data: null,
      };

    case "ORDER":
      return {
        success: true,
        message: getMessage("ORDER_TRACKING_MESSAGE", language as Language),
        searchType: "ORDER",
        data: null,
      };

    case "PAYMENT":
      return {
        success: true,
        message: getMessage("PAYMENT_SUCCESS", language as Language),
        searchType: "PAYMENT",
        data: null,
      };

    case "DISCOUNT":
      return {
        success: true,
        message: getMessage("DISCOUNT_MESSAGE", language as Language),
        searchType: "DISCOUNT",
        data: null,
      };

    case "VIP":
      return {
        success: true,
        message: getMessage("VIP_MEMBER_MESSAGE", language as Language),
        searchType: "VIP",
        data: null,
      };

    case "PREMIUM":
      return {
        success: true,
        message: getMessage("PREMIUM_MEMBER_MESSAGE", language as Language),
        searchType: "PREMIUM",
        data: null,
      };

    case "SUPPORT":
      return {
        success: true,
        message: getMessage("SUPPORT_MESSAGE", language as Language),
        searchType: "SUPPORT",
        data: null,
      };

    default:
      return {
        success: true,
        message: getMessage("AI_SUGGESTION_MESSAGE", language as Language),
        searchType: "AI",
        data: null,
      };
  }
}

//==================================
// PRODUCT SEARCH AI
//==================================

export async function searchProductAI(message: string): Promise<string> {
  const supabase = await createClient();
  const keyword = extractKeyword(message);

  if (!keyword) {
    return "لطفاً نام محصول مورد نظر را وارد کنید.";
  }

  // نکته اصلاح‌شده: فیلتر .or() ساپابیس/PostgREST از کاما برای جدا کردن
  // چند شرط استفاده می‌کند (title.ilike.%x%,description.ilike.%x%,...).
  // قبلا کلیدواژه بدون هیچ پاک‌سازی‌ای مستقیم داخل این رشته می‌رفت؛ یعنی
  // اگر پیام کاربر خودش کاما، پرانتز یا % داشت (مثلا یک جمله کامل
  // انگلیسی مثل "Where am I from, what language is my phone, and what
  // time is it?")، رشته فیلتر از هم می‌پاشید و PostgREST خطا می‌داد —
  // که همان پیام «در جستجوی محصولات مشکلی پیش آمد» را برمی‌گرداند، حتی
  // برای پیام‌هایی که اصلا ربطی به جستجوی محصول نداشتند.
  const sanitizedKeyword = keyword
    .replace(/[,()%]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);

  if (!sanitizedKeyword) {
    return "لطفاً نام محصول مورد نظر را وارد کنید.";
  }

  // نکته اصلاح‌شده: قبلا این کوئری از ستون‌های name/description/category
  // استفاده می‌کرد که با schema واقعی (title, نه name) هماهنگ نبود —
  // یعنی این جستجو همیشه نتیجه خالی برمی‌گرداند، حتی وقتی محصول موجود بود.
  const { data, error } = await supabase
    .from("products")
    .select("id, title, description, price, category, stock")
    .or(
      `title.ilike.%${sanitizedKeyword}%,description.ilike.%${sanitizedKeyword}%,category.ilike.%${sanitizedKeyword}%`
    )
    .eq("is_available", true)
    .limit(5);

  if (error) {
    console.log("NOORBAND AI SEARCH ERROR:", error);
    return "در جستجوی محصولات مشکلی پیش آمد.";
  }

  if (!data || data.length === 0) {
    return `محصولی با نام "${sanitizedKeyword}" پیدا نشد 🌸`;
  }

  let result = "🌸 محصولات پیدا شده:\n\n";

  data.forEach((item, index) => {
    result += `${index + 1}. ${item.title}\n`;

    if (item.category) {
      result += `دسته: ${item.category}\n`;
    }

    if (item.price) {
      result += `قیمت: ${item.price}\n`;
    }

    if (item.stock !== undefined) {
      result += `موجودی: ${item.stock}\n`;
    }

    result += "\n";
  });

  return result;
}

//==================================
// KEYWORD CLEAN
//==================================

function extractKeyword(message: string) {
  const words = [
    "میخواهم",
    "می‌خواهم",
    "میخوام",
    "می‌خوام",
    "دارید",
    "دارین",
    "داری",
    "قیمت",
    "چنده",
    "لطفا",
    "لطفاً",
    "بگو",
    "نمایش",
    "محصول",
    "محصولات",
    // نکته اصلاح‌شده: «چی» (مثلا در «عطر خوب چی داری») قبلا حذف
    // نمی‌شد — یعنی کلیدواژه‌ی نهایی «عطر خوب چی داری» می‌ماند که با
    // ILIKE هیچ‌وقت با عنوان واقعی محصول (مثلا «عطر آلین») تطبیق
    // نمی‌کرد، چون کل عبارت باید عینا در عنوان محصول وجود داشته باشد.
    "چی",
    "خوب",
    // چند کلمه پرکاربرد انگلیسی هم اضافه شد تا کلیدواژه‌ی استخراج‌شده
    // برای پیام‌های انگلیسی هم تمیزتر باشد (قبلا این تابع فقط کلمات
    // فارسی/دری را حذف می‌کرد و کل جمله انگلیسی دست‌نخورده باقی می‌ماند)
    "do you have",
    "i want",
    "please",
    "price of",
    "show me",
    "product",
    "products",
  ];

  let keyword = message;

  words.forEach((word) => {
    keyword = keyword.replace(new RegExp(word, "gi"), "");
  });

  return keyword.trim();
}

// این export فقط یک‌بار وجود دارد (قبلا دوبار تعریف شده بود که خطای
// "Duplicate identifier" می‌داد و کل build را می‌شکست)
export const searchProductsAI = searchProductAI;

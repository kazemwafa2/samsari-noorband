//==================================
// NOORBAND AI RECOMMEND SYSTEM
//==================================

import { getCache } from "@/ai/cache";
import { getMessage } from "@/constants/messages";
import type { Language } from "@/lib/i18n/dictionaries";

// نکته اصلاح‌شده: قبلا این تابع دوبار تعریف شده بود (یکی بدون پارامتر
// در بالای فایل، یکی دوباره در پایین) که خطای "Duplicate function
// implementation" می‌داد و build را می‌شکست. router.ts هم این تابع را
// با یک آرگومان (message) صدا می‌زد در حالی که تعریف قبلی اصلا
// پارامتر نمی‌گرفت. حالا یک نسخه واحد و سازگار وجود دارد.
export async function recommendAI(_message?: string) {
  const result = await AI_RECOMMEND();
  return result.suggestions.join("\n");
}

export async function AI_RECOMMEND() {
  const user = getCache();
  const suggestions: string[] = [];

  //==================================
  // FIRST VISIT
  //==================================
  if (user.firstVisit) {
    suggestions.push(getMessage("FIRST_VISIT_MESSAGE", user.language as Language));
  }

  //==================================
  // VIP
  //==================================
  if (user.vip) {
    suggestions.push(getMessage("VIP_MEMBER_MESSAGE", user.language as Language));
  }

  //==================================
  // PREMIUM
  //==================================
  if (user.premium) {
    suggestions.push(getMessage("PREMIUM_MEMBER_MESSAGE", user.language as Language));
  }

  //==================================
  // SEASONS
  //==================================
  if (user.season === "spring") {
    suggestions.push(getMessage("SPRING_MESSAGE", user.language as Language));
  }

  if (user.season === "summer") {
    suggestions.push(getMessage("SUMMER_MESSAGE", user.language as Language));
  }

  if (user.season === "autumn") {
    suggestions.push(getMessage("AUTUMN_MESSAGE", user.language as Language));
  }

  if (user.season === "winter") {
    suggestions.push(getMessage("WINTER_MESSAGE", user.language as Language));
  }

  //==================================
  // HOLIDAY
  //==================================
  if (user.holiday) {
    suggestions.push(getMessage("SMART_HOLIDAY_MESSAGE", user.language as Language));
  }

  //==================================
  // WEATHER
  //==================================
  if (user.weather) {
    suggestions.push(getMessage("SMART_WEATHER_MESSAGE", user.language as Language));
  }

  //==================================
  // DEFAULT
  //==================================
  if (suggestions.length === 0) {
    suggestions.push(getMessage("AI_SUGGESTION_MESSAGE", user.language as Language));
  }

  //==================================
  // RETURN
  //==================================
  return {
    success: true,
    suggestions,
    language: user.language,
    country: user.country,
    currency: user.currency,
    season: user.season,
    vip: user.vip,
    premium: user.premium,
  };
}

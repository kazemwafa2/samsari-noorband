"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { getMessage } from "@/constants/messages";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getTodaysSeasonalMessage } from "@/lib/seasonal-messages";

// قبلا این پیام‌ها همیشه با MESSAGES.KEY.fa (فارسی/دری ثابت) نمایش
// داده می‌شدند، حتی اگر کاربر زبان دیگری (مثلا انگلیسی) انتخاب کرده
// بود — یعنی یک کاربر غیرفارسی‌زبان چیزی نمی‌فهمید. حالا با
// getMessage(key, language) پیام دقیقا با زبان فعلی سایت هماهنگ است.
//
// نکته: این افکت باید فقط یک‌بار در طول عمر صفحه اجرا شود (نه هر بار
// که کاربر زبان را عوض می‌کند)، برای همین با shownRef فقط اولین اجرا
// را مجاز می‌کنیم — ولی چون به language وابسته است، همان مقدار
// درست‌شده (نه همیشه دری پیش‌فرض اولیه) استفاده می‌شود.
export default function WelcomeSystem() {
  const { language } = useLanguage();
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current) return;
    shownRef.current = true;

    const firstVisit = localStorage.getItem("noorband-user");

    if (!firstVisit) {
      alert(getMessage("FIRST_VISIT_MESSAGE", language));
      localStorage.setItem("noorband-user", "true");
    } else {
      alert(getMessage("WELCOME_BACK_MESSAGE", language));
    }
  }, [language]);

  // OFFLINE_MESSAGE در messages.ts از قبل تعریف شده بود ولی هیچ‌جای کد
  // به رویداد آفلاین مرورگر گوش نمی‌داد — یعنی کاربر هیچ‌وقت متوجه
  // نمی‌شد که اینترنتش قطع شده، فقط با خطاهای عجیب مواجه می‌شد.
  useEffect(() => {
    function handleOffline() {
      toast.warning(getMessage("OFFLINE_MESSAGE", language));
    }

    window.addEventListener("offline", handleOffline);
    return () => window.removeEventListener("offline", handleOffline);
  }, [language]);

  // پیام‌های فصلی/زمانی (بهار/تابستان/پاییز/زمستان، جمعه، سال نو،
  // ظهر/عصر) — قبلا این‌ها در سه فایل کاملا یتیم و ناهماهنگ با زبان
  // سایت پیاده‌سازی شده بودند (رجوع کنید به src/lib/seasonal-messages.ts)؛
  // اینجا با src/lib/seasonal-messages.ts (بدون داده ساختگی، فقط
  // منطق ساده‌ی تاریخ/ساعت) و زبان واقعی سایت دوباره ساخته شد.
  // با یک کلید تاریخ‌دار در localStorage فقط یک‌بار در روز نشان داده
  // می‌شود، نه با هر بار باز کردن هر صفحه.
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const seenKey = "noorband-seasonal-seen";
    const lastSeen = localStorage.getItem(seenKey);

    if (lastSeen === today) return;

    const message = getTodaysSeasonalMessage(language);
    if (message?.text) {
      toast(message.text);
      localStorage.setItem(seenKey, today);
    }
  }, [language]);

  return null;
}

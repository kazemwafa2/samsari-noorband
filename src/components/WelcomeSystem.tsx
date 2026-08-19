"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { getMessage } from "@/constants/messages";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { getTodaysSeasonalMessage } from "@/lib/seasonal-messages";

// نکته اصلاح‌شده: قبلا این پیام‌ها با alert() خام مرورگر نمایش داده
// می‌شدند. alert() یک دیالوگ سطح مرورگر است، نه بخشی از ظاهر سایت —
// برای همین همیشه یک خط «آدرس‌سایت says» بالای پیام نشان می‌دهد که
// هیچ راهی برای حذفش از کد سایت وجود ندارد (این رفتار خودِ مرورگر
// است، نه چیزی که ما ساخته باشیم). خود متن پیام هم از قبل با
// getMessage(key, language) به‌درستی چندزبانه بود، اما چون از طریق
// alert() نمایش داده می‌شد، تجربه‌اش شکسته و غیرحرفه‌ای به نظر می‌رسید.
// حالا با یک کارت خوش‌آمدگویی سفارشی (هماهنگ با ظاهر بقیه سایت)
// جایگزین شد — بدون هیچ خط آدرس سایتی.
export default function WelcomeSystem() {
  const { language } = useLanguage();
  const shownRef = useRef(false);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

  useEffect(() => {
    if (shownRef.current) return;
    shownRef.current = true;

    const firstVisit = localStorage.getItem("noorband-user");

    if (!firstVisit) {
      setWelcomeMessage(getMessage("FIRST_VISIT_MESSAGE", language));
      localStorage.setItem("noorband-user", "true");
    } else {
      setWelcomeMessage(getMessage("WELCOME_BACK_MESSAGE", language));
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

  if (!welcomeMessage) return null;

  return (
    <div className="quick-view-overlay" onClick={() => setWelcomeMessage(null)}>
      <div
        className="welcome-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="welcome-modal-text">{welcomeMessage}</p>
        <button className="primary-btn" onClick={() => setWelcomeMessage(null)}>
          {t("okButtonLabel", language)}
        </button>
      </div>
    </div>
  );
}

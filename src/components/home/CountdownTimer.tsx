"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";

function getRemaining() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const diff = Math.max(0, end.getTime() - now.getTime());

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { hours, minutes, seconds };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

// شمارش معکوس واقعی تا پایان روز جاری (نه یک عدد ساختگی)؛ برای
// نشان‌دادن اینکه تخفیف‌های امروز محدود به همین امروز هستند.
export default function CountdownTimer() {
  const { language } = useLanguage();
  const [time, setTime] = useState(getRemaining());

  useEffect(() => {
    const timer = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown">
      <div className="countdown-box">
        <span>{pad(time.hours)}</span>
        <small>{t("countdownHours", language)}</small>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-box">
        <span>{pad(time.minutes)}</span>
        <small>{t("countdownMinutes", language)}</small>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-box">
        <span>{pad(time.seconds)}</span>
        <small>{t("countdownSeconds", language)}</small>
      </div>
    </div>
  );
}

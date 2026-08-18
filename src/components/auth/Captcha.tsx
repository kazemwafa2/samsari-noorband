"use client";

import { useEffect, useState } from "react";

interface CaptchaProps {
  onValidChange: (valid: boolean) => void;
}

// یک CAPTCHA ساده ریاضی بدون نیاز به سرویس خارجی (hCaptcha/reCAPTCHA
// نیاز به site key دارند که من ندارم). این مانع رباط‌های ساده می‌شود؛
// اگر می‌خواهی محافظت قوی‌تر، بعدا می‌شود همین کامپوننت را با
// Cloudflare Turnstile جایگزین کرد بدون تغییر در بقیه فرم.

export function Captcha({ onValidChange }: CaptchaProps) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    generate();
  }, []);

  function generate() {
    setA(Math.floor(Math.random() * 10) + 1);
    setB(Math.floor(Math.random() * 10) + 1);
    setAnswer("");
    onValidChange(false);
  }

  function handleChange(value: string) {
    setAnswer(value);
    onValidChange(Number(value) === a + b);
  }

  return (
    <div>
      <label>
        برای تایید اینکه ربات نیستید، حاصل جمع را وارد کنید: {a} + {b} = ؟
      </label>
      <input
        type="number"
        value={answer}
        onChange={(e) => handleChange(e.target.value)}
        required
      />
    </div>
  );
}

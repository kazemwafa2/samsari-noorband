"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Eye, EyeOff, Mail, Lock, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/translate-auth-error";
import LoginLockMessage from "@/components/auth/login-lock-message";
import RememberMeCheckbox from "@/components/auth/remember-me-checkbox";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { getMessage } from "@/constants/messages";
import { useGuestOnly } from "@/hooks/use-guest-only";

const REMEMBER_ME_KEY = "noorband-remember-me";
const LOCKOUT_WINDOW_SECONDS = 15 * 60; // باید با WINDOW_MINUTES در src/app/api/login/route.ts یکی باشد

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  // اصلاح: قبلا اگر کاربری از قبل لاگین بود و دستی وارد /login می‌شد،
  // فرم لاگین دوباره نمایش داده می‌شد. useGuestOnly (که در پروژه ساخته
  // شده بود ولی هیچ‌جا وصل نبود) این حالت را می‌گیرد و به «/» می‌فرستد.
  useGuestOnly();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // «مرا به خاطر بسپار»: قبلا این چک‌باکس در پروژه ساخته شده بود ولی
  // هیچ‌جا استفاده نمی‌شد. چون نشست واقعی توسط کوکی @supabase/ssr مدیریت
  // می‌شود (نه localStorage)، معنی واقعی «به خاطر نسپار» این است که
  // کوکی نشست فقط تا بسته‌شدن مرورگر بماند، نه ۳۰ روز. این ترجیح را
  // اینجا ذخیره می‌کنیم و createClient (lib/supabase/client.ts) هنگام
  // ساخت کلاینت آن را می‌خواند.
  const [rememberMe, setRememberMe] = useState(true);

  // قفل موقت بعد از تلاش‌های ناموفق: /api/login از قبل واقعا این
  // محدودیت را در جدول login_attempts اعمال می‌کرد (429 برمی‌گرداند)،
  // ولی صفحه فقط متن خطا را نشان می‌داد، بدون شمارش معکوس واقعی. حالا
  // از LoginLockMessage (که در پروژه ساخته شده بود ولی هیچ‌جا استفاده
  // نمی‌شد) برای نمایش شمارش معکوس واقعی استفاده می‌کنیم.
  const [lockRemaining, setLockRemaining] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_ME_KEY);
    if (saved !== null) setRememberMe(saved === "true");
  }, []);

  useEffect(() => {
    if (lockRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockRemaining((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockRemaining]);

  async function loginUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("fillAllFieldsError", language));
      return;
    }

    setLoading(true);
    localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe));

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    setLoading(false);

    if (!result.success) {
      if (response.status === 429) {
        setLockRemaining(LOCKOUT_WINDOW_SECONDS);
      }
      setError(
        result.error?.includes("تلاش") ? result.error : translateAuthError(result.error)
      );
      return;
    }

    // قبلا همه کاربران بعد از ورود، صرف‌نظر از نقش، به همان صفحه قبلی یا
    // «/» می‌رفتند — یعنی ادمین/مدیرکل هم باید دستی به /dashboard می‌رفت.
    // حالا اگر نقش کاربر admin/super_admin باشد و آدرس redirect خاصی هم
    // در URL خواسته نشده باشد، مستقیم به پنل مدیریت هدایت می‌شود.
    const isAdmin = result.role === "admin" || result.role === "super_admin";
    const target = isAdmin && !searchParams.get("redirect") ? "/dashboard" : redirectTo;

    // LOGIN_MESSAGE در messages.ts از قبل تعریف شده بود ولی هیچ‌جای کد
    // صدایش نمی‌زد — یعنی بعد از ورود موفق هیچ پیام خوش‌آمدی دیده
    // نمی‌شد. حالا همین لحظه نشان داده می‌شود.
    toast.success(getMessage("LOGIN_MESSAGE", language));

    router.push(target);
    router.refresh();
  }

  // ورود با گوگل/گیت‌هاب — واقعا کار می‌کند به شرطی که در Supabase Dashboard
  // → Authentication → Providers، این پروایدرها را فعال و Client ID/Secret
  // را وارد کرده باشی. کد اینجا نیازی به کلید محرمانه ندارد چون همه‌چیز
  // سمت Supabase انجام می‌شود.
  async function loginWithOAuth(provider: "google" | "github" | "facebook" | "apple") {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    });
  }

  return (
    <div className="min-h-screen center relative overflow-hidden">
      <div className="auth-page-decor" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="glass-card" style={{ position: "relative", zIndex: 1 }}>
        <h1 className="section-title">{t("loginPageTitle", language)}</h1>

        <p className="text-center">
  {t("loginWelcomeText", language)}
</p>

<br />

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        )}

        <LoginLockMessage remainingTime={lockRemaining} />

        <form onSubmit={loginUser}>
          <div>
            <label>{t("emailLabel", language)}</label>

            <div className="input-box">
              <Mail size={20} />
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <br />

          <div>
            <label>{t("passwordLabel", language)}</label>

            <div className="input-box">
              <Lock size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <br />

          <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />

          <br />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <Link href="/forgot-password">
              {t("forgotPasswordLink", language)}
            </Link>

            <Link
              href="/register"
              style={{
                fontWeight: 700,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {t("registerLink", language)}
            </Link>
          </div>

          <br />

          <button className="primary-btn" type="submit" disabled={loading || lockRemaining > 0}>
            {loading ? <LoaderCircle className="loading" /> : t("loginSubmitButton", language)}
          </button>
        </form>

        <br />
        <p className="text-center">
  {t("orLoginWithText", language)}
</p>

        <div className="flex">
          <button type="button" onClick={() => loginWithOAuth("google")}>
            Google
          </button>
          <button type="button" onClick={() => loginWithOAuth("github")}>
            GitHub
          </button>
          <button type="button" onClick={() => loginWithOAuth("facebook")}>
            Facebook
          </button>
          <button type="button" onClick={() => loginWithOAuth("apple")}>
            Apple
          </button>
        </div>
      </div>
    </div>
  );
}

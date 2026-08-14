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
const LOCKOUT_WINDOW_SECONDS = 15 * 60;

function SocialIcon({ provider }: { provider: "google" | "github" | "facebook" | "apple" }) {
  if (provider === "google") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.4-.18-2.06H12v3.9h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.22Z"/>
        <path fill="#34A853" d="M12 21.84c2.63 0 4.84-.87 6.45-2.35l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.75 9.75 0 0 0 12 21.84Z"/>
        <path fill="#FBBC05" d="M6.54 13.94A5.86 5.86 0 0 1 6.23 12c0-.67.12-1.32.31-1.94V7.54H3.3A9.84 9.84 0 0 0 2.25 12c0 1.61.39 3.13 1.05 4.46l3.24-2.52Z"/>
        <path fill="#EA4335" d="M12 6.03c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.1 14.63 2.16 12 2.16a9.75 9.75 0 0 0-8.7 5.38l3.24 2.52C7.31 7.75 9.46 6.03 12 6.03Z"/>
      </svg>
    );
  }

  if (provider === "github") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 .7A11.3 11.3 0 0 0 8.43 22.9c.57.1.78-.25.78-.55v-2.03c-3.17.69-3.84-1.34-3.84-1.34-.52-1.31-1.27-1.66-1.27-1.66-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.53-.29-5.19-1.27-5.19-5.64 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17A10.9 10.9 0 0 1 12 6.3c.97 0 1.94.13 2.85.39 2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.11 3.02.73.8 1.18 1.82 1.18 3.07 0 4.38-2.67 5.34-5.21 5.63.41.35.78 1.04.78 2.1v3.08c0 .3.21.66.79.55A11.3 11.3 0 0 0 12 .7Z"/>
      </svg>
    );
  }

  if (provider === "facebook") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.09 4.39 23.08 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.04 1.79-4.72 4.56-4.72 1.32 0 2.7.24 2.7.24v2.98h-1.52c-1.5 0-1.97.94-1.97 1.9v2.28h3.35l-.54 3.49H13.9V24C19.61 23.08 24 18.09 24 12.07Z"/>
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M16.77 12.74c.02 2.19 1.92 2.92 1.94 2.93-.02.05-.3 1.05-1 2.08-.6.89-1.22 1.78-2.2 1.8-.96.02-1.27-.58-2.37-.58-1.1 0-1.44.56-2.35.6-.94.04-1.65-.96-2.26-1.85-1.23-1.79-2.17-5.05-.91-7.24.62-1.09 1.73-1.78 2.93-1.8.92-.02 1.8.62 2.37.62.57 0 1.63-.77 2.75-.66.47.02 1.78.19 2.62 1.42-.07.04-1.56.91-1.54 2.68ZM15 4.36c.51-.62 1.36-1.09 2.18-1.13.1.96-.28 1.93-.77 2.55-.49.62-1.3 1.11-2.1 1.05-.11-.93.28-1.92.69-2.47Z"/>
    </svg>
  );
}
 // باید با WINDOW_MINUTES در src/app/api/login/route.ts یکی باشد

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
    const isDashboardUser =
      result.role === "admin" ||
      result.role === "super_admin" ||
      result.role === "seller";

    const target =
      isDashboardUser && !searchParams.get("redirect")
        ? "/dashboard"
        : redirectTo;

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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 10,
            marginTop: 14,
          }}
        >
          {(["google", "github", "facebook", "apple"] as const).map((provider) => {
            const labels = {
              google: "Google",
              github: "GitHub",
              facebook: "Facebook",
              apple: "Apple",
            };

            return (
              <button
                key={provider}
                type="button"
                onClick={() => loginWithOAuth(provider)}
                style={{
                  minHeight: 46,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                  border: "1px solid rgba(128,128,128,.35)",
                  borderRadius: 10,
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <SocialIcon provider={provider} />
                <span>{labels[provider]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

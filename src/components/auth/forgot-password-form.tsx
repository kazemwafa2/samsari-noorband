"use client";

import { FormEvent, useState } from "react";
import AuthCard from "./auth-card";
import AuthSuccess from "./auth-success";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/translate-auth-error";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";

// نسخه قبلی این کامپوننت فقط یک کامنت "// مرحله بعد: Supabase Reset
// Password" داشت و هیچ ایمیلی واقعا ارسال نمی‌شد. حالا با
// supabase.auth.resetPasswordForEmail واقعا کار می‌کند؛ لینک بازیابی
// کاربر را به /reset-password برمی‌گرداند (همان صفحه‌ای که
// ResetPasswordForm در آن است).
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const { language } = useLanguage();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(translateAuthError(resetError.message));
      return;
    }

    // به‌عمد نمی‌گوییم "ایمیل شما پیدا نشد" حتی اگر واقعا این‌طور باشد؛
    // این کار جلوی حدس‌زدن ایمیل‌های ثبت‌شده در سایت (enumeration) را
    // می‌گیرد — همان چیزی که Supabase خودش هم توصیه می‌کند.
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <AuthCard title={t("resetPasswordPageTitle", language)} subtitle={t("resetPasswordSubtitle", language)}>
        {sent ? (
          <AuthSuccess message={t("resetPasswordSentMessage", language)} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="error-message">{error}</p>}

            <input
              type="email"
              placeholder={t("emailLabel", language)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? t("sendingText", language) : t("sendResetLinkButton", language)}
            </button>
          </form>
        )}
      </AuthCard>
    </div>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "./password-input";
import AuthCard from "./auth-card";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/translate-auth-error";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";

// نسخه قبلی این کامپوننت فقط یک کامنت "// مرحله بعد: Update Password"
// داشت و رمز عبور واقعا هیچ‌وقت تغییر نمی‌کرد. حالا با
// supabase.auth.updateUser واقعا کار می‌کند. Supabase وقتی کاربر روی
// لینک ایمیل بازیابی کلیک می‌کند، خودش یک نشست موقت PASSWORD_RECOVERY
// در همین صفحه می‌سازد؛ اگر آن نشست وجود نداشته باشد (مثلا لینک
// منقضی‌شده یا کاربر مستقیم به این آدرس آمده)، فرم را نشان نمی‌دهیم.
export default function ResetPasswordForm() {
  const router = useRouter();
  const { language } = useLanguage();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // لینک بازیابی، رویداد PASSWORD_RECOVERY را با نشست موقت پرتاب می‌کند.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // اگر کاربر همین الان (بدون رفرش) از لینک ایمیل به این صفحه رسیده،
    // ممکن است رویداد بالا قبل از mount این کامپوننت اتفاق افتاده باشد؛
    // پس نشست فعلی را هم مستقیم چک می‌کنیم.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(t("passwordTooShortError", language));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("passwordConfirmMismatchError", language));
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (updateError) {
      setError(translateAuthError(updateError.message));
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <AuthCard title={t("changePasswordPageTitle", language)} subtitle={t("changePasswordSubtitle", language)}>
        {!ready && !success && (
          <p className="error-message">
            {t("resetLinkExpiredError", language)}
          </p>
        )}

        {success && <p className="success-message">{t("passwordChangedSuccess", language)}</p>}

        {ready && !success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="error-message">{error}</p>}

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("newPasswordPlaceholder", language)}
              showStrength
            />
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("confirmNewPasswordPlaceholder", language)}
            />

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? t("changingText", language) : t("changePasswordButton", language)}
            </button>
          </form>
        )}
      </AuthCard>
    </div>
  );
}

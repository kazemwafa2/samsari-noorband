"use client";

// نسخه قبلی این صفحه فقط alert(MESSAGES.PASSWORD_RESET_MESSAGE.fa) نشان
// می‌داد و هیچ ایمیلی ارسال نمی‌کرد ("// بعدا به Supabase متصل می‌شود").
// حالا از همان کامپوننت واقعی پروژه (که قبلا ساخته شده ولی هیچ‌جا
// استفاده نمی‌شد) استفاده می‌کند که واقعا Supabase Auth را صدا می‌زند.
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

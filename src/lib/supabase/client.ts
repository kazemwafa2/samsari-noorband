import { createBrowserClient } from "@supabase/ssr";

// «مرا به خاطر بسپار» (src/app/login/page.tsx): اگر کاربر این گزینه را
// خاموش کند، کوکی نشست را با طول‌عمر پیش‌فرض @supabase/ssr نگه نمی‌داریم
// — به‌جایش یک کوکی نشست مرورگر (بدون maxAge) می‌سازیم که با بستن
// مرورگر پاک می‌شود. چون این خواندن فقط سمت مرورگر معنا دارد، اگر
// localStorage در دسترس نبود (اجرای سرور) به رفتار پیش‌فرض برمی‌گردیم.
function getRememberMePreference(): boolean {
  if (typeof window === "undefined") return true;
  const saved = window.localStorage.getItem("noorband-remember-me");
  return saved === null ? true : saved === "true";
}

export function createClient() {
  const rememberMe = getRememberMePreference();

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    rememberMe
      ? undefined
      : {
          cookieOptions: {
            // بدون maxAge = کوکی نشست مرورگر (تا بسته‌شدن مرورگر)
            maxAge: undefined,
          },
        }
  );
}
export const supabase = createClient();

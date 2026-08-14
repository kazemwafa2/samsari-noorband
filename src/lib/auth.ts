// این فایل قبلا از "./supabase" (کلاینت قدیمی مبتنی بر @supabase/supabase-js،
// نشست را در localStorage نگه می‌داشت) استفاده می‌کرد؛ در حالی که صفحه واقعی
// /login و middleware.ts هر دو از کلاینت @supabase/ssr (کوکی‌محور) استفاده
// می‌کنند. یعنی useAuth/useSession (که از این فایل تغذیه می‌شوند) هیچ‌وقت
// نشست واقعی کاربر را نمی‌دیدند چون در جای دیگری (کوکی، نه localStorage)
// ذخیره شده بود. حالا با همان کلاینت واقعی هماهنگ شده است.
import { createClient } from "@/lib/supabase/client";

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const supabase = createClient();
  return await supabase.auth.signOut();
}

export async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getSession() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

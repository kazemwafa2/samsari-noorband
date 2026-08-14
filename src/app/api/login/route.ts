import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

// چرا این route لازم است: صفحه /login مستقیم supabase.auth.signInWithPassword
// را سمت کلاینت صدا می‌زد که هیچ محدودیتی روی تعداد تلاش‌های ناموفق نداشت
// (یعنی brute-force روی رمز عبور عملا آزاد بود). این route جلوی آن را
// با شمارش تلاش‌های ناموفق در جدول login_attempts می‌گیرد.

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ success: false, error: "ایمیل و رمز الزامی است." }, { status: 400 });
  }

  const supabase = await createClient();

  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("login_attempts")
    .select("*", { count: "exact", head: true })
    .eq("email", email)
    .eq("success", false)
    .gte("created_at", windowStart);

  if ((count || 0) >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { success: false, error: `تعداد تلاش‌های ناموفق زیاد است. ${WINDOW_MINUTES} دقیقه دیگر امتحان کن.` },
      { status: 429 }
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  await supabase.from("login_attempts").insert({ email, success: !error });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }

  // قبلا نقش کاربر اینجا خوانده/برگردانده نمی‌شد، پس صفحه لاگین راهی
  // برای فهمیدن «آیا این ادمین است؟» نداشت و همه (از جمله ادمین/مدیرکل)
  // بعد از ورود به «/» می‌رفتند، نه مستقیم به پنل مدیریت.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  return NextResponse.json({ success: true, user: data.user, role: profile?.role || "customer" });
}

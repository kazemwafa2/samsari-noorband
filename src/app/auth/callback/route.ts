import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// نسخه قبلی این فایل فقط بدون هیچ کاری کاربر را به /login هدایت می‌کرد —
// یعنی حتی اگر Google/GitHub در Supabase فعال بود، کاربر هیچوقت واقعا
// لاگین نمی‌شد چون کد OAuth هیچوقت تبدیل به session نمی‌شد.

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}

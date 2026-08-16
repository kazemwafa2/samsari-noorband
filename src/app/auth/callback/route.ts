import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { redirectUser } from "@/lib/redirect-user";

// نسخه قبلی این فایل فقط بدون هیچ کاری کاربر را به /login هدایت می‌کرد —
// یعنی حتی اگر Google/GitHub در Supabase فعال بود، کاربر هیچوقت واقعا
// لاگین نمی‌شد چون کد OAuth هیچوقت تبدیل به session نمی‌شد.
//
// نکته‌ی بعدی: بعد از تبدیل موفق code به session، همیشه به همان `next`
// پیش‌فرض ("/") هدایت می‌شد و نقش کاربر اصلا چک نمی‌شد — یعنی اگر
// ادمین/سوپرادمین/فروشنده‌ای از طریق ورود اجتماعی (OAuth) وارد می‌شد،
// به صفحه اصلی می‌رفت نه پنل خودش. حالا دقیقا مثل src/app/api/login و
// src/app/login/page.tsx، نقش از جدول profiles خوانده می‌شود و طبق
// redirect-user.ts هدایت انجام می‌شود — مگر اینکه `next` صراحتا یک
// مسیر غیر از خانه باشد (یعنی کاربر از یک لینک عمیق خاص آمده)، که در
// آن صورت همان مسیر مقصود حفظ می‌شود.

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      let target = next;

      if (next === "/" && data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();

        target = redirectUser(profile?.role || "customer");
      }

      return NextResponse.redirect(`${origin}${target}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}

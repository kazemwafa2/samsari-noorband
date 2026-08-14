import { NextResponse } from "next/server";

import { aiRouter } from "@/ai/router";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;
    const image = body.image; // base64 string, اختیاری

    if (!message && !image) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    // برای اینکه AI بتواند سفارش‌های کاربر را جستجو/رهگیری/لغو کند،
    // باید بداند کاربر لاگین‌شده کیست.
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Rate limiting — قبلا این endpoint هیچ محدودیتی نداشت و هرکسی
    // (حتی مهمان) می‌توانست هرچقدر بخواهد صدایش بزند و هزینه واقعی
    // GROQ API را بالا ببرد. شناسه محدودیت: کاربرِ لاگین‌کرده، یا برای
    // مهمان‌ها IP. تابع check_ai_rate_limit در db/schema.sql (بخش ۱۵)
    // تعریف شده — اتمیک و روی خود دیتابیس است، نه یک Map در حافظه، چون
    // در محیط serverless چند نسخه از این route ممکن است هم‌زمان روی
    // instance های جدا اجرا شوند.
    // اصلاح: cf-connecting-ip توسط خود Cloudflare (نه کلاینت) ست
    // می‌شود، پس قابل جعل نیست؛ x-forwarded-for فقط fallback است
    // (مثلا در dev محلی که پشت Cloudflare نیست).
    const cfConnectingIp = request.headers.get("cf-connecting-ip");
    const forwardedFor = request.headers.get("x-forwarded-for");
    const identifier = user?.id || cfConnectingIp || forwardedFor?.split(",")[0]?.trim() || "unknown";

    const { data: allowed, error: rateLimitError } = await supabase.rpc("check_ai_rate_limit", {
      p_identifier: identifier,
      p_max_requests: 15,
      p_window_minutes: 5,
    });

    // fail-open عمدی: اگر migration بخش ۱۵ هنوز روی این پروژه اجرا
    // نشده (تابع وجود ندارد)، به‌جای مسدودکردن همه کاربران، فقط این
    // چک را رد می‌کنیم و خطا را لاگ می‌کنیم — بهتر است AI بدون
    // rate-limit کار کند تا این‌که کلا از کار بیفتد.
    if (!rateLimitError && allowed === false) {
      return NextResponse.json(
        {
          success: false,
          error: "تعداد درخواست‌های شما زیاد بوده. چند دقیقه دیگر دوباره امتحان کنید.",
        },
        { status: 429 }
      );
    }

    if (rateLimitError) {
      console.log("AI RATE LIMIT CHECK ERROR (migration اجرا نشده؟):", rateLimitError.message);
    }

    const result = await aiRouter({
      message,
      image,
      userId: user?.id,
    });

    return NextResponse.json({
      success: true,
      text: result.text,
      language: result.language,
      type: result.type || "general",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, error: "AI Server Error" },
      { status: 500 }
    );
  }
}

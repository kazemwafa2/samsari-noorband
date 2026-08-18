import { NextResponse } from "next/server";
import { aiRouter } from "@/ai/router";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = body.message || "";
    const image = body.image;
    const timezone = body.timezone || "UTC";
    const localHour =
      typeof body.localHour === "number"
        ? body.localHour
        : new Date().getHours();

    // زبانی که خود سایت (middleware + LanguageProvider، بر اساس
    // جغرافیا/URL/انتخاب کاربر) از قبل تشخیص داده بود؛ قبلا فرانت‌اند
    // این را می‌فرستاد (ChatBot.tsx) ولی این‌جا هیچ‌وقت خوانده نمی‌شد.
    const interfaceLanguage =
      typeof body.interfaceLanguage === "string"
        ? body.interfaceLanguage
        : undefined;

    // چند پیام آخر مکالمه (برای پیوستگی پاسخ Groq در ادامه‌ی گفتگو).
    const history = Array.isArray(body.history)
      ? body.history
          .filter(
            (item: any) =>
              item &&
              (item.role === "user" || item.role === "assistant") &&
              typeof item.content === "string"
          )
          .slice(-10)
      : [];

    if (!message && !image) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const cfConnectingIp = request.headers.get("cf-connecting-ip");
    const forwardedFor = request.headers.get("x-forwarded-for");

    const identifier =
      user?.id ||
      cfConnectingIp ||
      forwardedFor?.split(",")[0]?.trim() ||
      "unknown";

    const { data: allowed, error: rateLimitError } =
      await supabase.rpc("check_ai_rate_limit", {
        p_identifier: identifier,
        p_max_requests: 15,
        p_window_minutes: 5,
      });

    if (!rateLimitError && allowed === false) {
      return NextResponse.json(
        {
          success: false,
          error:
            "تعداد درخواست‌های شما زیاد بوده. چند دقیقه دیگر دوباره امتحان کنید.",
        },
        { status: 429 }
      );
    }

    if (rateLimitError) {
      console.log(
        "AI RATE LIMIT CHECK ERROR:",
        rateLimitError.message
      );
    }

    const result = await aiRouter({
      message,
      image,
      userId: user?.id,
      timezone,
      localHour,
      interfaceLanguage,
      history,
    });

    return NextResponse.json({
      success: result.success,
      text: result.text,
      language: result.language,
      type: result.type || "general",
    });
  } catch (error) {
    console.error("AI API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "AI Server Error",
      },
      { status: 500 }
    );
  }
}

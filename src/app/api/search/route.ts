import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// جستجوی هوشمند واقعی: قبلا /site/search فقط یک ILIKE ساده روی عنوان
// محصول بود. این route از Groq می‌خواهد جمله‌ی طبیعی کاربر (مثلا
// «یک گوشی ارزان زیر ۵ میلیون») را به کلیدواژه + بازه قیمت تبدیل کند،
// و بعد جستجوی واقعی روی دیتابیس انجام می‌دهد.

export async function POST(request: Request) {
  const { query } = await request.json();

  if (!query) {
    return NextResponse.json({ success: false, error: "query الزامی است" }, { status: 400 });
  }

  const supabase = await createClient();

  // اصلاح امنیتی: این route هم مثل /api/ai هزینه واقعی GROQ API را
  // برای هر درخواست پرداخت می‌کند، ولی قبلا هیچ rate-limit ای نداشت —
  // یعنی هر کاربر مهمان می‌توانست بدون محدودیت آن را صدا بزند. از همان
  // تابع دیتابیسی check_ai_rate_limit استفاده می‌کنیم، با پیشوند
  // "search:" تا شمارنده‌اش از /api/ai جدا باشد.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  const forwardedFor = request.headers.get("x-forwarded-for");
  const identifier = `search:${user?.id || cfConnectingIp || forwardedFor?.split(",")[0]?.trim() || "unknown"}`;

  const { data: allowed, error: rateLimitError } = await supabase.rpc("check_ai_rate_limit", {
    p_identifier: identifier,
    p_max_requests: 20,
    p_window_minutes: 5,
  });

  // fail-open عمدی، هم‌الگوی /api/ai: اگر migration اجرا نشده باشد،
  // به‌جای قطع کامل جستجو، فقط این چک رد می‌شود.
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
    console.log("SEARCH RATE LIMIT CHECK ERROR (migration اجرا نشده؟):", rateLimitError.message);
  }

  let keywords = query;
  let minPrice: number | null = null;
  let maxPrice: number | null = null;

  if (process.env.GROQ_API_KEY) {
    try {
      const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "از جمله فارسی کاربر، کلیدواژه اصلی جستجو و در صورت وجود حداقل/حداکثر قیمت (به افغانی) را استخراج کن. فقط JSON خام برگردان با شکل: {\"keywords\":\"...\",\"min_price\":null یا عدد,\"max_price\":null یا عدد}. هیچ توضیح اضافه‌ای نده.",
            },
            { role: "user", content: query },
          ],
        }),
      });

      const aiJson = await aiResponse.json();
      const raw = aiJson?.choices?.[0]?.message?.content;

      if (raw) {
        const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        keywords = parsed.keywords || query;
        minPrice = parsed.min_price ?? null;
        maxPrice = parsed.max_price ?? null;
      }
    } catch (err) {
      console.log("SMART SEARCH AI PARSE FAILED, falling back to raw query:", err);
      // اگر AI جواب قابل‌قبول نداد، همان جستجوی ساده روی متن اصلی انجام می‌شود
    }
  }

  let dbQuery = supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .ilike("title", `%${keywords}%`);

  if (minPrice) dbQuery = dbQuery.gte("price", minPrice);
  if (maxPrice) dbQuery = dbQuery.lte("price", maxPrice);

  const { data, error } = await dbQuery.limit(30);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, products: data, interpreted: { keywords, minPrice, maxPrice } });
}

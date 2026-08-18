import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

function normalizeText(value: string): string {
  return normalizeDigits(value)
    .replace(/ي/g, "ی")
    .replace(/ى/g, "ی")
    .replace(/ك/g, "ک")
    .trim();
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") return null;

  const normalized = normalizeDigits(value)
    .replace(/[,\s٬،]/g, "")
    .replace(/میلیون/g, "000000")
    .replace(/هزار/g, "000");

  const number = Number(normalized);

  return Number.isFinite(number) ? number : null;
}

function extractPriceFromText(text: string): number | null {
  const normalized = normalizeText(text);

  const millionMatch = normalized.match(
    /(\d+(?:\.\d+)?)\s*میلیون/
  );

  if (millionMatch) {
    return Number(millionMatch[1]) * 1_000_000;
  }

  const thousandMatch = normalized.match(
    /(\d+(?:\.\d+)?)\s*هزار/
  );

  if (thousandMatch) {
    return Number(thousandMatch[1]) * 1_000;
  }

  const plainMatch = normalized.match(
    /(?:زیر|کمتر از|حداکثر تا|تا)\s*([\d,٬،]+)/
  );

  if (plainMatch) {
    return parseNumber(plainMatch[1]);
  }

  return null;
}

function removeSearchNoise(text: string): string {
  return normalizeText(text)
    .replace(
      /(?:زیر|کمتر از|بیشتر از|حداکثر|حداقل|تا)\s*[\d,٬،]+\s*(?:میلیون|هزار)?/gi,
      ""
    )
    .replace(/\d[\d,\s٬،]*/g, "")
    .replace(
      /\b(?:یک|یه|لطفاً|لطفا|میخواهم|می‌خواهم|میخوام|دنبال|جستجوی|جستجو|ارزان|ارزانترین|گران|گرانترین|مناسب|قیمت|قیمتش|می‌خواهم)\b/gi,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request: Request) {
  const { query } = await request.json();

  if (!query || typeof query !== "string") {
    return NextResponse.json(
      {
        success: false,
        error: "query الزامی است",
      },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  const forwardedFor = request.headers.get("x-forwarded-for");

  const identifier = `search:${
    user?.id ||
    cfConnectingIp ||
    forwardedFor?.split(",")[0]?.trim() ||
    "unknown"
  }`;

  const { data: allowed, error: rateLimitError } =
    await supabase.rpc("check_ai_rate_limit", {
      p_identifier: identifier,
      p_max_requests: 20,
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
      "SEARCH RATE LIMIT CHECK ERROR:",
      rateLimitError.message
    );
  }

  const normalizedQuery = normalizeText(query);

  let keywords = removeSearchNoise(normalizedQuery);
  let minPrice: number | null = null;
  let maxPrice: number | null = extractPriceFromText(normalizedQuery);

  /*
   * تمام قیمت‌های این فروشگاه بر اساس افغانی هستند.
   *
   * مثال:
   * «یک محصول زیر ۵۰۰۰ افغانی»
   * = حداکثر قیمت 5,000,000 AFN
   *
   * AI حق ندارد تومان، ریال یا دلار را به قیمت تبدیل کند.
   */
  if (process.env.GROQ_API_KEY) {
    try {
      const aiResponse = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            temperature: 0,
            messages: [
              {
                role: "system",
                content: `
تو فقط تحلیل‌کننده جستجوی فروشگاه «سیمساری نوربند جاغوری» هستی.

قوانین بسیار مهم:

1. واحد پول فروشگاه فقط «افغانی / AFN» است.
2. هرگز تومان، ریال ایران، دلار یا یورو تولید نکن.
3. «۵۰۰۰ افغانی» یعنی ۵۰۰۰ افغانی.
4. «۵۰۰ هزار» یعنی 500,000 افغانی.
5. فقط اطلاعاتی را استخراج کن که از متن کاربر مشخص است.
6. نام محصول یا مفهوم محصول را در keywords قرار بده.
7. اگر قیمت سقف دارد، max_price را به افغانی بده.
8. اگر قیمت کف دارد، min_price را به افغانی بده.
9. اگر قیمت مشخص نیست، مقدار null باشد.
10. اگر کاربر محصولی را می‌خواهد که ممکن است در فروشگاه وجود نداشته باشد، آن را فقط به‌عنوان keyword جستجو کن؛ هرگز محصول ساختگی پیشنهاد نکن.
11. فقط JSON خام برگردان.

فرمت دقیق:
{
  "keywords": "نام یا مفهوم محصول",
  "min_price": null,
  "max_price": null
}
`,
              },
              {
                role: "user",
                content: normalizedQuery,
              },
            ],
          }),
        }
      );

      const aiJson = await aiResponse.json();
      const raw = aiJson?.choices?.[0]?.message?.content;

      if (raw) {
        const parsed = JSON.parse(
          raw.replace(/```json|```/g, "").trim()
        );

        const aiKeywords = String(parsed.keywords || "").trim();

        if (aiKeywords) {
          keywords = normalizeText(aiKeywords);
        }

        const aiMinPrice = parseNumber(parsed.min_price);
        const aiMaxPrice = parseNumber(parsed.max_price);

        if (aiMinPrice !== null) {
          minPrice = aiMinPrice;
        }

        if (aiMaxPrice !== null) {
          maxPrice = aiMaxPrice;
        }
      }
    } catch (error) {
      console.log(
        "SMART SEARCH AI PARSE FAILED:",
        error
      );
    }
  }

  /*
   * اگر AI قیمت را اشتباه تشخیص داد، تشخیص مستقیم متن کاربر
   * اولویت دارد؛ چون واحد فروشگاه همیشه افغانی است.
   */
  const directMaxPrice = extractPriceFromText(normalizedQuery);

  if (directMaxPrice !== null) {
    maxPrice = directMaxPrice;
  }

  /*
   * ابتدا دسته‌بندی‌های واقعی فروشگاه را بررسی می‌کنیم.
   * بنابراین «عطر» می‌تواند از طریق دسته‌بندی واقعی پیدا شود.
   */
  let categoryIds: number[] = [];

  if (keywords) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id, title")
      .ilike("title", `%${keywords}%`)
      .limit(20);

    categoryIds = (categoryData || []).map(
      (category) => Number(category.id)
    );
  }

  /*
   * جستجو فقط در products واقعی و موجود انجام می‌شود.
   */
  let dbQuery = supabase
    .from("products")
    .select("*")
    .eq("is_available", true);

  if (keywords) {
    const escapedKeywords = keywords
      .replace(/%/g, "\\%")
      .replace(/_/g, "\\_");

    if (categoryIds.length > 0) {
      dbQuery = dbQuery.or(
        `title.ilike.%${escapedKeywords}%,description.ilike.%${escapedKeywords}%,category.ilike.%${escapedKeywords}%,category_id.in.(${categoryIds.join(",")})`
      );
    } else {
      dbQuery = dbQuery.or(
        `title.ilike.%${escapedKeywords}%,description.ilike.%${escapedKeywords}%,category.ilike.%${escapedKeywords}%`
      );
    }
  }

  if (minPrice !== null) {
    dbQuery = dbQuery.gte("price", minPrice);
  }

  if (maxPrice !== null) {
    dbQuery = dbQuery.lte("price", maxPrice);
  }

  const { data, error } = await dbQuery.limit(30);

  if (error) {
    console.log("SMART SEARCH DATABASE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "در جستجوی محصولات مشکلی پیش آمد.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    products: data || [],
    interpreted: {
      keywords,
      minPrice,
      maxPrice,
      currency: "AFN",
    },
  });
}

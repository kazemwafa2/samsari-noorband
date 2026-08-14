import { NextResponse } from "next/server";

// تشخیص خودکار کشور/ارز بر اساس IP (بدون نیاز به اجازه GPS از کاربر).
// از ipapi.co استفاده می‌شود (رایگان تا سقف مشخصی از درخواست در روز،
// بدون نیاز به کلید API). اگر بخواهی دقت بیشتر یا حجم درخواست بالاتر،
// می‌توانی با یک سرویس پولی جایگزینش کنی — فقط همین fetch را عوض کن.

const CURRENCY_BY_COUNTRY: Record<string, string> = {
  AF: "AFN",
  IR: "IRT",
  US: "USD",
  DE: "EUR",
  FR: "EUR",
  AT: "EUR",
  CH: "CHF",
};

export async function GET(request: Request) {
  // اصلاح: cf-connecting-ip را (که خود Cloudflare ست می‌کند و
  // کلاینت نمی‌تواند جعلش کند) به x-forwarded-for (که کلاینت هم
  // می‌تواند در آن مقدار دلخواه بگذارد) اولویت می‌دهیم.
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = request.headers.get("cf-connecting-ip") || forwardedFor?.split(",")[0]?.trim();

  try {
    const url = ip ? `https://ipapi.co/${ip}/json/` : "https://ipapi.co/json/";
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    if (data.error) {
      throw new Error(data.reason || "geo lookup failed");
    }

    const countryCode = data.country_code || "AF";

    return NextResponse.json({
      success: true,
      country: data.country_name || "افغانستان",
      countryCode,
      city: data.city || null,
      timezone: data.timezone || "Asia/Kabul",
      currency: CURRENCY_BY_COUNTRY[countryCode] || "AFN",
    });
  } catch (error) {
    // اگر سرویس در دسترس نبود، پیش‌فرض امن (افغانستان/کابل) برگردانده می‌شود
    return NextResponse.json({
      success: true,
      country: "افغانستان",
      countryCode: "AF",
      city: null,
      timezone: "Asia/Kabul",
      currency: "AFN",
      fallback: true,
    });
  }
}

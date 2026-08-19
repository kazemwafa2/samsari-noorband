import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// آیکون تب مرورگر (favicon) قبلا همیشه از یک فایل ثابت (public/favicon.ico)
// خوانده می‌شد — یعنی حتی بعد از تغییر لوگو از پنل مدیریت (تنظیمات →
// برندینگ)، آیکون تب مرورگر همچنان همان آیکون قدیمی می‌ماند، چون آن
// تنظیم فقط روی ناوبار/فوتر/آیکون PWA اثر می‌گذاشت، نه خود favicon.ico
// (که یک قرارداد فایل ثابت در Next.js است و نمی‌تواند مستقیم از
// دیتابیس بخواند).
//
// این route همان logo_url ذخیره‌شده در site_settings را می‌خواند و
// مرورگر را به همان‌جا هدایت می‌کند (redirect، نه دانلود و بازگرداندن
// دوباره‌ی بایت‌ها — چون فایل از قبل روی Supabase Storage با آدرس
// عمومی در دسترس است). اگر ادمین چیزی آپلود نکرده باشد، به همان
// favicon.ico ثابت قبلی برمی‌گردد — یعنی سایت هیچ‌وقت بدون آیکون
// نمی‌ماند.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);

  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("site_settings")
      .select("logo_url")
      .eq("id", 1)
      .single();

    if (data?.logo_url) {
      return NextResponse.redirect(data.logo_url);
    }
  } catch (error) {
    console.log("FAVICON ROUTE ERROR:", error);
  }

  return NextResponse.redirect(`${origin}/favicon.ico`);
}

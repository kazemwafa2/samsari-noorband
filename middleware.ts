import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ROLES } from "@/lib/auth/roles";
import { LANGUAGES } from "@/lib/i18n/dictionaries";

// ---------------------------------------------------------------------
// آدرس‌های چندزبانه واقعی (برای hreflang درست)
// ---------------------------------------------------------------------
// قبلا سایت فقط یک URL داشت و زبان صرفا سمت کلاینت عوض می‌شد؛ یعنی
// hreflang به آدرس‌هایی مثل /en یا /fr اشاره می‌کرد که اصلا در پروژه
// وجود نداشتند و ۴۰۴ می‌دادند. حالا این پیشوندها واقعا کار می‌کنند:
// /en/products/5 همان صفحه /products/5 را (این‌بار به انگلیسی) نشان
// می‌دهد — بدون این‌که هیچ فایل صفحه‌ای جابه‌جا شده باشد؛ فقط با
// rewrite داخلی. آدرس نوار مرورگر همان /en/products/5 می‌ماند (rewrite
// برخلاف redirect نامرئی است)، پس LanguageProvider سمت کلاینت با
// خواندن مستقیم window.location.pathname می‌تواند بفهمد کاربر روی
// کدام نسخه‌ی زبانی است — بدون نیاز به کوکی جداگانه.
//
// «prs» (دری) عمدا بدون پیشوند مانده — یعنی همه لینک‌ها/کارت‌ویزیت‌ها/
// نتایج قبلی گوگل که به noorband.com/... اشاره می‌کنند دقیقا مثل قبل
// کار می‌کنند. بقیه زبان‌ها پیشوند می‌گیرند: /fa /ps /en /ar /fr /de /tr /es
const LOCALE_PREFIXES = LANGUAGES.filter((l) => l !== "prs");

function stripLocalePrefix(pathname: string): { effectivePathname: string; locale: string | null } {
  for (const locale of LOCALE_PREFIXES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      const rest = pathname.slice(`/${locale}`.length);
      return { effectivePathname: rest === "" ? "/" : rest, locale };
    }
  }
  return { effectivePathname: pathname, locale: null };
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // ---------------------------------------------------------------------
  // تشخیص خودکار دری/فارسی بر اساس کشور واقعی بازدیدکننده
  // ---------------------------------------------------------------------
  // قبلا حدس زبان از روی navigator.language مرورگر بود که خیلی غیردقیق
  // است (خیلی از کاربران افغان مرورگرشان روی fa عمومی یا en تنظیم است).
  // چون سایت روی Cloudflare اجرا می‌شود، هدر cf-ipcountry همیشه توسط
  // خود Cloudflare (نه کد ما) و بر اساس IP واقعی ست می‌شود — یعنی خیلی
  // دقیق‌تر است. فقط ایران → فارسی؛ در غیر این‌صورت (افغانستان یا هر
  // کشور دیگر یا نامشخص) → دری، که همان زبان پیش‌فرض و کامل سایت است.
  // این فقط یک "پیشنهاد" اولیه است؛ اگر کاربر خودش زبان دیگری انتخاب
  // کند (localStorage) یا از پیشوند URL استفاده کند، همیشه آن اولویت
  // دارد — این فقط رفتار اولین بازدید را بهتر می‌کند.
  if (!request.cookies.get("noorband-geo-lang")) {
    const country = request.headers.get("cf-ipcountry") || "";
    const geoLang = country === "IR" ? "fa" : "prs";
    response.cookies.set("noorband-geo-lang", geoLang, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rawPathname = request.nextUrl.pathname;

  // از اینجا به بعد، تمام تصمیم‌گیری‌های مسیر (تعمیر، مسیر خصوصی،
  // داشبورد) روی effectivePathname (بدون پیشوند زبان) انجام می‌شود؛
  // یعنی /en/checkout درست مثل /checkout به‌عنوان مسیر خصوصی شناخته
  // می‌شود، نه یک مسیر ناشناس.
  const { effectivePathname: pathname, locale: detectedLocale } = stripLocalePrefix(rawPathname);

  // --------------------------------------------------------------
  // حالت تعمیر: قبلا هیچ‌جا واقعا اعمال نمی‌شد، فقط یک toggle در
  // تنظیمات بود که هیچ اثری روی سایت نداشت.
  // --------------------------------------------------------------
  const isMaintenanceExempt =
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api");

  if (!isMaintenanceExempt) {
    const { data: settings } = await supabase
      .from("site_settings")
      .select("maintenance_mode")
      .eq("id", 1)
      .maybeSingle();

    if (settings?.maintenance_mode) {
      let isAdmin = false;

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        isAdmin = profile?.role === ROLES.ADMIN || profile?.role === ROLES.SUPER_ADMIN;
      }

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/maintenance", request.url));
      }
    }
  }

  // مسیرهای نیازمند ورود
  const privateRoutes = ["/checkout", "/site/orders", "/site/profile", "/site/reservations"];

  if (privateRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // محافظت Dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role,is_active")
      .eq("id", user.id)
      .maybeSingle();

    // نکته: قبلا اینجا فقط ADMIN/SUPER_ADMIN مجاز بودند، در حالی‌که
    // src/app/dashboard/layout.tsx (requireRole) به SELLER هم اجازه
    // ورود به /dashboard را می‌دهد. این ناهماهنگی باعث می‌شد فروشنده
    // بعد از لاگین (که به درستی به /dashboard هدایت می‌شد) همین‌جا در
    // میدلور به «/» برگردانده شود و هیچ‌وقت پنل خودش را نبیند.
    const allowedRoles = [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.SELLER];

    if (!profile || !profile.is_active || !allowedRoles.includes(profile.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // --------------------------------------------------------------
  // اگر آدرس با پیشوند زبان بود (مثلا /fr/products/5)، همین الان که
  // مطمئن شدیم مجاز است، آن را داخلی به مسیر واقعی (/products/5)
  // rewrite می‌کنیم.
  // --------------------------------------------------------------
  if (detectedLocale) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = pathname;

    const rewritten = NextResponse.rewrite(rewriteUrl);
    // کوکی‌های احراز هویتی که سوپابیس روی response ست کرده بود را باید
    // روی پاسخ نهایی هم منتقل کنیم، وگرنه login/session گم می‌شود.
    response.cookies.getAll().forEach((cookie) => rewritten.cookies.set(cookie));

    return rewritten;
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkout/:path*",
    "/site/:path*",
    "/products/:path*",
    "/((?!_next/static|_next/image|favicon.ico|manifest|sw.js).*)",
  ],
};

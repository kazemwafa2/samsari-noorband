import { redirect } from "next/navigation";

// این مسیر با src/app/login/page.tsx تکراری بود؛ یکی باید نسخه اصلی باشد.
// چون فرم واقعی و کامل در /login پیاده شده، این مسیر را به همان‌جا هدایت می‌کنیم
// تا لینک‌های قدیمی به /site/login خراب نشوند.

export default function SiteLoginRedirect() {
  redirect("/login");
}

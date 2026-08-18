import { redirect } from "next/navigation";

// این مسیر با /dashboard تکراری بود و پنل مدیریت واقعی (با گارد نقش کاربر)
// فقط زیر /dashboard پیاده شده. برای جلوگیری از سردرگمی، اینجا را
// به همان پنل واقعی هدایت می‌کنیم.

export default function AdminRedirect() {
  redirect("/dashboard");
}

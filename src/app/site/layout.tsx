import type { ReactNode } from "react";
import AuthProvider from "@/components/auth/auth-provider";

// این Provider قبلا در پروژه وجود داشت (src/components/auth/auth-provider.tsx)
// ولی هیچ‌جای اپ import نشده بود — یعنی useAuth/useSession را می‌شد صدا زد،
// ولی چیزی «حالت بارگذاری نشست» را روی صفحات خصوصی مدیریت نمی‌کرد. همه‌ی
// صفحات /site/* (پروفایل، سفارش‌ها، آدرس‌ها، رزروها، سبد خرید، علاقه‌مندی‌ها،
// مقایسه، تسویه‌حساب، ورود/ثبت‌نام) از این‌جا به بعد داخل آن قرار می‌گیرند.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

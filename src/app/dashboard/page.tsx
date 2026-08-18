"use client";

import DashboardHeader from "./components/DashboardHeader";
import StatsCards from "./components/StatsCards";
import RecentOrders from "./components/RecentOrders";
import ProductOverview from "./components/ProductOverview";
import UserOverview from "./components/UserOverview";
import SalesChart from "./components/SalesChart";
import DashboardMenu from "./components/DashboardMenu";

// نکته‌ی مهم دربارهٔ باگ «صفحه هی ریفرش می‌شود / گاهی بارگذاری گاهی
// بررسی دسترسی»:
//
// این صفحه قبلا خودش هم یک بررسی دسترسی جدا و سمت مرورگر انجام می‌داد
// (checkAdmin از src/lib/check-admin.ts) — درحالی‌که src/app/dashboard/
// layout.tsx از قبل با requireRole() همین بررسی را کاملا معتبر و
// سمت‌سرور انجام می‌دهد و قبل از رندر شدن حتی همین صفحه، غیرمجازها را
// ریدایرکت می‌کند. یعنی این بررسی دوم از اساس زائد بود.
//
// بدتر از زائد بودن: checkAdmin از یک کلاینت Supabase قدیمی و اشتباه
// (src/lib/supabase.ts، ساخته‌شده با @supabase/supabase-js خام که
// نشست را در localStorage نگه می‌دارد) استفاده می‌کرد، در حالی‌که کل
// بقیه‌ی پروژه (از جمله لاگین) از کلاینت مبتنی بر کوکی (@supabase/ssr)
// استفاده می‌کند. نتیجه: getSession() در این کلاینت قدیمی همیشه خالی
// برمی‌گشت (چون نشست واقعی در کوکی بود نه localStorage)، حتی برای یک
// ادمین کاملا لاگین‌شده. پس checkAdmin() همیشه false برمی‌گرداند و این
// صفحه کاربر را به /login می‌فرستاد؛ در /login چون کاربر واقعا لاگین
// بود، هوک useGuestOnly دوباره او را به /dashboard برمی‌گرداند — و این
// صفحه دوباره checkAdmin (که باز هم false می‌داد) را اجرا می‌کرد. همین
// رفت‌وبرگشت بی‌پایان بین /dashboard و /login همان «هی ریفرش می‌شود»ی
// بود که گزارش شده بود (و پیام‌های «در حال بارگذاری» و «بررسی
// دسترسی...» هم دقیقا از همین دو صفحه‌ی درگیر در حلقه بودند).
//
// (کلاینت قدیمی در src/lib/check-admin.ts هم به کلاینت درست اصلاح شد،
// ولی چون این بررسی از اساس زائد و تنها منبع خطا بود، حذفش شد تا این
// حلقه دیگر هیچ‌وقت — حتی با یک باگ مشابه در آینده — تکرار نشود.)

export default function Dashboard() {
  return (
    <main className="home-page space-y-6">
      <DashboardHeader />

      <h1 className="section-title">
        ⚙️ پنل مدیریت نوربند
      </h1>

      <StatsCards />

      <div
        className="
grid
grid-cols-1
lg:grid-cols-2
gap-6
"
      >
        <RecentOrders />
        <ProductOverview />
        <UserOverview />
        <SalesChart />
      </div>

      <DashboardMenu />
    </main>
  );
}
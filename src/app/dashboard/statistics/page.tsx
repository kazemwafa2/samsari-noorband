"use client";

import SalesChart from "../components/SalesChart";
import StatsCards from "../components/StatsCards";

// این صفحه قبلا فقط یک تیتر بود. کامپوننت‌های SalesChart و StatsCards
// از قبل در پروژه ساخته شده بودند ولی هیچ صفحه‌ای آن‌ها را استفاده
// نمی‌کرد (فقط در dashboard/page.tsx اصلی بودند). اینجا نمای تخصصی‌تر
// آمار فروش قرار می‌گیرد.

export default function Statistics() {
  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">📈 آمار فروش سایت</h1>

      <StatsCards />
      <SalesChart />
    </main>
  );
}

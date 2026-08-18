"use client";

import Link from "next/link";

const SECTIONS = [
  { title: "🖼️ برندینگ، تماس و رسانه", path: "/dashboard/settings/branding" },
  { title: "🎨 تنظیمات ظاهری (رنگ‌ها و بنرها)", path: "/dashboard/settings/appearance" },
  { title: "⚙️ عمومی و محصولات", path: "/dashboard/settings/products" },
  { title: "💳 پرداخت", path: "/dashboard/settings/payment" },
  { title: "🔔 اعلان‌ها", path: "/dashboard/settings/notification" },
  { title: "🔐 امنیت", path: "/dashboard/settings/security" },
  { title: "👥 دسترسی کاربران", path: "/dashboard/settings/users" },
];

export default function Settings() {
  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">⚙️ تنظیمات سایت</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SECTIONS.map((section) => (
          <Link key={section.path} href={section.path} className="glass-card">
            {section.title}
          </Link>
        ))}
      </div>
    </main>
  );
}

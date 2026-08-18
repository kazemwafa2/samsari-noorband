"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";

import { useCartStore } from "@/store/cart";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { useUserRole } from "@/hooks/use-user-role";
import { redirectUser } from "@/lib/redirect-user";

// نوار پایین موبایل — چک‌لیست: در طرح مرجع (نسخه موبایل) یک نوار
// پایین ثابت با ۴ آیتم (خانه/دسته‌ها/سبد خرید/پروفایل) وجود دارد که
// در این پروژه اصلا وجود نداشت. فقط در موبایل نمایش داده می‌شود
// (globals.css → media query)، در دسکتاپ مخفی است چون ناوبار بالا
// همان نقش را دارد.
export default function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.getTotalItems());
  const { language } = useLanguage();

  // مثل Navbar.tsx: آیتم پروفایل قبلا برای همه (از جمله ادمین/سوپرادمین/
  // فروشنده) ثابت به /site/profile می‌رفت؛ حالا بر اساس نقش واقعی کاربر
  // به پنل مخصوص خودش (redirect-user.ts) هدایت می‌شود.
  const { role } = useUserRole();
  const profileHref = role ? redirectUser(role) : "/site/profile";

  const items = [
    { href: "/", label: t("home", language), Icon: Home },
    { href: "/categories", label: t("categories", language), Icon: LayoutGrid },
    { href: "/site/cart", label: t("cart", language), Icon: ShoppingBag, badge: cartCount },
    { href: profileHref, label: t("profile", language), Icon: User },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {items.map(({ href, label, Icon, badge }) => (
        <Link
          key={href}
          href={href}
          className={pathname === href ? "mobile-bottom-nav-item active" : "mobile-bottom-nav-item"}
        >
          <span className="mobile-bottom-nav-icon">
            <Icon size={22} />
            {!!badge && badge > 0 && <span className="navbar-badge">{badge}</span>}
          </span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

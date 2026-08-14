"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Gem, Search, Heart, ShoppingBag, User, Bell, Menu, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { CurrencySwitcher } from "@/components/shared/CurrencySwitcher";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { useWishlist } from "@/hooks/useWishlist";
import { useCartStore } from "@/store/cart";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { useSiteSettings } from "@/lib/site-settings";
import { createClient } from "@/lib/supabase/client";
import { useCurrency } from "@/lib/currency";

// نسخه قبلی این کامپوننت فقط چند ایموجی خام (🏠 🛍 🔎 🛒 🔔 👤) بدون
// لوگو، بدون جستجو و بدون اتصال واقعی به سبد خرید/علاقه‌مندی‌ها بود.
// این نسخه به store سبد خرید (src/store/cart.ts) و هوک واقعی
// useWishlist وصل است تا تعداد نشان داده‌شده روی نشان‌ها واقعی باشد؛
// و حالا همه متن‌ها از t() می‌آیند تا با تغییر زبان، ناوبار هم (که در
// همه صفحات سایت ثابت است) واقعا عوض شود.

export default function Navbar() {
  const router = useRouter();
  const { language } = useLanguage();
  const { logoUrl } = useSiteSettings();
  const { format } = useCurrency();
  const supabase = createClient();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // ---------------------------------------------------------------------
  // سرچ‌باکس پیشرفته: قبلا فقط یک input ساده بود که هیچ پیشنهادی نشان
  // نمی‌داد و کاربر باید Enter می‌زد تا اصلا بفهمد نتیجه‌ای هست یا نه.
  // حالا با تایپ (با debounce ۳۰۰ میلی‌ثانیه) یک لیست کشویی از ۵
  // محصول نزدیک‌ترین به عبارت جستجو، همراه با عکس/قیمت، نمایش داده
  // می‌شود — دقیقا مثل تجربه سرچ‌باکس‌های فروشگاهی حرفه‌ای.
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("products")
        // اصلاح شد: ستون "images" در جدول products وجود ندارد (نام
        // واقعی image است، تک تصویر نه آرایه) — قبلا این کوئری همیشه
        // با خطا مواجه می‌شد و پیشنهادهای جستجوی سرچ‌بار همیشه بدون
        // تصویر (یا اصلا خالی) نمایش داده می‌شدند.
        .select("id, title, price, image")
        .ilike("title", `%${q}%`)
        .limit(5);

      setSuggestions(data || []);
      setSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { items: wishlistItems } = useWishlist();
  const cartCount = useCartStore((state) => state.getTotalItems());

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setMobileOpen(false);

    const q = query.trim();
    router.push(q ? `/site/search?q=${encodeURIComponent(q)}` : "/site/search");
  }

  const navLinks = [
    { href: "/", label: t("home", language) },
    { href: "/categories", label: t("categories", language) },
    { href: "/about", label: t("about", language) },
    { href: "/contact", label: t("contactUs", language) },
  ];

  return (
    <header className="site-navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <span className="navbar-logo-icon">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="NOORBAND Jaghori" className="navbar-logo-img" />
            ) : (
              <Gem size={20} />
            )}
          </span>
          نوربند جاغوری
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={18} />
          <input
            type="search"
            placeholder={t("searchPlaceholder", language)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />

          {showSuggestions && query.trim().length >= 2 && (
            <div className="navbar-search-suggestions">
              {searching && <p className="navbar-search-hint">{t("loadingText", language)}</p>}

              {!searching && suggestions.length === 0 && (
                <p className="navbar-search-hint">{t("noResultsFound", language)}</p>
              )}

              {suggestions.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="navbar-search-suggestion-item"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} />
                  )}
                  <div>
                    <span>{p.title}</span>
                    <strong>{format(Number(p.price))}</strong>
                  </div>
                </Link>
              ))}

              {suggestions.length > 0 && (
                <button
                  type="submit"
                  className="navbar-search-see-all"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {t("seeAllResults", language)}
                </button>
              )}
            </div>
          )}
        </form>

        <nav className="navbar-links">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-actions">
          <div className="navbar-switchers">
            <LanguageSwitcher />
            <CurrencySwitcher />
            <ThemeSwitcher />
          </div>

          <Link href="/notifications" className="navbar-icon-btn" aria-label={t("notifications", language)}>
            <Bell size={19} />
          </Link>

          <Link href="/site/wishlist" className="navbar-icon-btn" aria-label={t("wishlist", language)}>
            <Heart size={19} />
            {wishlistItems.length > 0 && (
              <span className="navbar-badge">{wishlistItems.length}</span>
            )}
          </Link>

          <Link href="/site/cart" className="navbar-icon-btn" aria-label={t("cart", language)}>
            <ShoppingBag size={19} />
            {cartCount > 0 && <span className="navbar-badge">{cartCount}</span>}
          </Link>

          <Link href="/site/profile" className="navbar-icon-btn" aria-label={t("profile", language)}>
            <User size={19} />
          </Link>

          <button
            type="button"
            className="navbar-burger"
            aria-label={t("menu", language)}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="navbar-mobile">
          <form className="navbar-search" onSubmit={handleSearch}>
            <Search size={18} />
            <input
              type="search"
              placeholder={t("searchPlaceholder", language)}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          <nav className="navbar-mobile-links">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="navbar-switchers navbar-switchers-mobile">
            <LanguageSwitcher />
            <CurrencySwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}

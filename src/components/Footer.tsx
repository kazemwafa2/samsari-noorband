"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { useSiteSettings } from "@/lib/site-settings";

export default function Footer() {
  const { language } = useLanguage();
  const {
    logoUrl,
    storeImageDayUrl,
    storeImageNightUrl,
    storeGalleryUrls,
    socialFacebook,
    socialInstagram,
    socialWhatsapp,
  } = useSiteSettings();

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";

  // نکته: اگر ادمین چند عکس دوکان (گالری) آپلود کرده باشد، اولین عکس
  // گالری نمایش داده می‌شود؛ وگرنه همان عکس روز/شب قدیمی (سازگاری با
  // نسخه‌های قبلی که فقط یک عکس داشتند)
  const storeImage =
    storeGalleryUrls[0] ||
    (isDark ? storeImageNightUrl : storeImageDayUrl) ||
    storeImageDayUrl ||
    storeImageNightUrl;

  // لینک‌های شبکه‌های اجتماعی و واتساپ: اگر از پنل مدیریت تنظیم شده
  // باشند همان استفاده می‌شود، وگرنه مقدار پیش‌فرض کد (SITE_CONFIG)
  const facebookHref = socialFacebook || SITE_CONFIG.social.facebook;
  const instagramHref = socialInstagram || SITE_CONFIG.social.instagram;
  const whatsappNumber = socialWhatsapp || SITE_CONFIG.whatsapp.number;
  const whatsappHref = socialWhatsapp
    ? `https://wa.me/${socialWhatsapp.replace(/\D/g, "")}`
    : SITE_CONFIG.whatsapp.link;

  const quickLinks = [
    { href: "/", label: t("home", language) },
    { href: "/categories", label: t("categories", language) },
    { href: "/site/profile", label: t("profile", language) },
    { href: "/site/orders", label: t("footerMyOrders", language) },
    { href: "/contact", label: t("contactUs", language) },
    { href: "/faq", label: t("footerFaq", language) },
    { href: "/shipping", label: t("footerShipping", language) },
    { href: "/blog", label: t("blogTitle", language) },
    { href: "/terms", label: t("footerTerms", language) },
    { href: "/privacy", label: t("footerPrivacy", language) },
  ];

  return (
    <footer className="glass footer footer-pro">

      {/* ================= FOOTER TOP ================= */}
      <div className="footer-pro-top">

        <div className="footer-pro-brand">
          <div className="footer-pro-brand-mark">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={SITE_CONFIG.name}
                className="footer-logo-img"
              />
            ) : (
              <span>NB</span>
            )}
          </div>

          <div className="footer-pro-brand-text">
            <h2>{SITE_CONFIG.name}</h2>
            <span>NOORBAND AI</span>
          </div>
        </div>

        <div className="footer-pro-brand-line" />
      </div>

      {/* ================= STORE INFO ================= */}
      <div className="footer-pro-store">

        <div className="footer-pro-store-image">
          {storeImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={storeImage}
              alt={t("storeAddressTitleEmoji", language)}
              className="footer-store-img"
            />
          )}

          <div className="footer-pro-image-overlay" />
        </div>

        <div className="footer-pro-location-grid">

          <div className="footer-pro-info-card">
            <span className="footer-pro-info-icon">
              <MapPin size={19} />
            </span>

            <div>
              <small>{t("storeAddressTitleEmoji", language)}</small>
              <span>{t("storeAddressValue", language)}</span>
            </div>
          </div>

          <div className="footer-pro-info-card">
            <span className="footer-pro-info-icon">
              <Clock size={19} />
            </span>

            <div>
              <small>{t("footerWorkingHours", language)}</small>
              <span>{t("workingHoursValue", language)}</span>
            </div>
          </div>

        </div>
      </div>

      {/* ================= MAIN COLUMNS ================= */}
      <div className="footer-pro-columns">

        {/* CONTACT */}
        <div className="footer-pro-column">
          <div className="footer-pro-heading">
            <span className="footer-pro-heading-icon">
              <Phone size={17} />
            </span>
            <h3>{t("footerContact", language)}</h3>
          </div>

          <div className="footer-pro-links">
            {SITE_CONFIG.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone}`}
                className="footer-pro-link"
              >
                <span className="footer-pro-link-icon">
                  <Phone size={15} />
                </span>
                <span>{phone}</span>
                <ArrowUpRight size={14} className="footer-pro-link-arrow" />
              </a>
            ))}

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-pro-link"
            >
              <span className="footer-pro-link-icon">
                <MessageCircle size={15} />
              </span>
              <span>
                {t("footerWhatsapp", language)}:{" "}
                {whatsappNumber}
              </span>
              <ArrowUpRight size={14} className="footer-pro-link-arrow" />
            </a>
          </div>
        </div>

        {/* SOCIAL */}
        <div className="footer-pro-column">
          <div className="footer-pro-heading">
            <span className="footer-pro-heading-icon">
              <Instagram size={17} />
            </span>
            <h3>{t("footerSocial", language)}</h3>
          </div>

          <div className="footer-pro-social-grid">

            <a
              href={facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-pro-social-card"
            >
              <span className="footer-pro-social-icon">
                <Facebook size={18} />
              </span>
              <span>Facebook</span>
              <ArrowUpRight size={14} />
            </a>

            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-pro-social-card"
            >
              <span className="footer-pro-social-icon">
                <Instagram size={18} />
              </span>
              <span>Instagram</span>
              <ArrowUpRight size={14} />
            </a>

          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-pro-column footer-pro-quick-links">
          <div className="footer-pro-heading">
            <span className="footer-pro-heading-icon">
              <ChevronRight size={17} />
            </span>
            <h3>{t("footerQuickLinks", language)}</h3>
          </div>

          <div className="footer-pro-link-grid">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="footer-pro-quick-link"
              >
                <ChevronRight size={14} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* ================= BOTTOM ================= */}
      <div className="footer-pro-bottom">

        <div className="footer-pro-bottom-brand">
          <Link href="/" className="footer-pro-ai-link">
            NOORBAND AI
            <ArrowUpRight size={14} />
          </Link>

          <span>Next.js 15</span>
          <span>PWA</span>
          <span>Mobile First</span>
        </div>

        <div className="footer-pro-divider" />

        <div className="footer-pro-credits">
          <p className="developer">
            {t("footerDesignedBy", language)}{" "}
            <span className="developer-first">
              {SITE_CONFIG.developer.firstName}
            </span>{" "}
            <span className="developer-last">
              {SITE_CONFIG.developer.lastName}
            </span>
          </p>

          <p>
            © {SITE_CONFIG.copyrightYear} •{" "}
            {SITE_CONFIG.copyrightYearShamsi} • NOORBAND Jaghori
          </p>

          <p>{t("footerAllRightsReserved", language)}</p>
        </div>

      </div>

    </footer>
  );
}

"use client";

import Link from "next/link";
import { Facebook, Instagram, MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { useSiteSettings } from "@/lib/site-settings";
import { useTheme } from "@/lib/theme/ThemeProvider";

export default function Footer() {
  const { language } = useLanguage();
  const { logoUrl, storeImageDayUrl, storeImageNightUrl } = useSiteSettings();
  const { theme } = useTheme();

  // عکس آدرس دوکان بر اساس حالت روز/شب فعلی سایت عوض می‌شود — دقیقا
  // مثل نمونه‌ی دوقلوی روز/شب. اگر ادمین برای یکی از دو حالت عکس
  // آپلود نکرده باشد، از عکس حالت دیگر (یا هیچ‌کدام) استفاده می‌شود.
  const isDark =
    typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark";
  const storeImage = (isDark ? storeImageNightUrl : storeImageDayUrl) || storeImageDayUrl || storeImageNightUrl;

  return (
    <footer className="glass footer">
      <div className="footer-brand">
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={SITE_CONFIG.name} className="footer-logo-img" />
        )}
        <h2>{SITE_CONFIG.name}</h2>
      </div>

      {/* آدرس و ساعات کاری + عکس دوکان — یک بنر بالای فوتر */}
      <div className="footer-banner">
        {storeImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={storeImage} alt={t("storeAddressTitleEmoji", language)} className="footer-store-img" />
        )}

        <div className="footer-banner-item">
          <MapPin size={18} />
          <span>{SITE_CONFIG.address}</span>
        </div>
        <div className="footer-banner-item">
          <Clock size={18} />
          <span>
            {SITE_CONFIG.workingHours.days} • {SITE_CONFIG.workingHours.hours}
          </span>
        </div>
      </div>

      <hr />

      {/* ۳ ستون کنار هم: تماس | شبکه‌های اجتماعی | لینک‌های سریع */}
      <div className="footer-columns">
        {/* CONTACT */}
        <div className="footer-col">
          <h3>{t("footerContact", language)}</h3>

          {SITE_CONFIG.phones.map((phone) => (
            <div key={phone} className="footer-link-row">
              <Phone size={16} />
              <a href={`tel:${phone}`}>{phone}</a>
            </div>
          ))}

          <div className="footer-link-row">
            <MessageCircle size={16} />
            <a href={SITE_CONFIG.whatsapp.link} target="_blank" rel="noopener noreferrer">
              {t("footerWhatsapp", language)}: {SITE_CONFIG.whatsapp.number}
            </a>
          </div>
        </div>

        {/* SOCIAL MEDIA */}
        <div className="footer-col">
          <h3>{t("footerSocial", language)}</h3>

          <div className="footer-link-row">
            <span className="footer-social-icon"><Facebook size={16} /></span>
            <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </div>

          <div className="footer-link-row">
            <span className="footer-social-icon"><Instagram size={16} /></span>
            <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h3>{t("footerQuickLinks", language)}</h3>

          <div className="footer-link-row"><Link href="/">{t("home", language)}</Link></div>
          <div className="footer-link-row"><Link href="/categories">{t("categories", language)}</Link></div>
          <div className="footer-link-row"><Link href="/site/profile">{t("profile", language)}</Link></div>
          <div className="footer-link-row"><Link href="/site/orders">{t("footerMyOrders", language)}</Link></div>
          <div className="footer-link-row"><Link href="/contact">{t("contactUs", language)}</Link></div>
          <div className="footer-link-row"><Link href="/faq">{t("footerFaq", language)}</Link></div>
          <div className="footer-link-row"><Link href="/shipping">{t("footerShipping", language)}</Link></div>
          <div className="footer-link-row"><Link href="/blog">{t("blogTitle", language)}</Link></div>
          <div className="footer-link-row"><Link href="/terms">{t("footerTerms", language)}</Link></div>
          <div className="footer-link-row"><Link href="/privacy">{t("footerPrivacy", language)}</Link></div>
        </div>
      </div>

      <hr />

      <p>
        <Link href="/">NOORBAND AI</Link> • Next.js 15 • PWA • Mobile First
      </p>

      {/* DEVELOPER */}
      <p className="developer">
        {t("footerDesignedBy", language)}{" "}
        <span className="developer-first">{SITE_CONFIG.developer.firstName}</span>{" "}
        <span className="developer-last">{SITE_CONFIG.developer.lastName}</span>
      </p>

      <p>
        © {SITE_CONFIG.copyrightYear} • {SITE_CONFIG.copyrightYearShamsi} • NOORBAND Jaghori
      </p>

      <p>{t("footerAllRightsReserved", language)}</p>
    </footer>
  );
}

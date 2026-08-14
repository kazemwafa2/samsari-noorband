"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/constants/site";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";

export default function ContactPage() {
  const { language } = useLanguage();

  return (
    <div className="glass contact-page">
      <h1>{t("contactUs", language)}</h1>

      <p>{t("contactWelcome", language).replace("{name}", SITE_CONFIG.name)}</p>

      {/* CONTACT */}
      <h2>☎ {t("footerContact", language)}</h2>

      {SITE_CONFIG.phones.map((phone, index) => (
        <div key={phone}>
          <a href={`tel:${phone}`}>{phone}</a>
          {index < SITE_CONFIG.phones.length - 1 && <br />}
        </div>
      ))}

      {/* WHATSAPP */}
      <h2>📱 {t("footerWhatsapp", language)}</h2>

      <a href={SITE_CONFIG.whatsapp.link} target="_blank" rel="noopener noreferrer">
        {SITE_CONFIG.whatsapp.number}
      </a>

      {/* SOCIAL MEDIA */}
      <h2>{t("socialMediaTitleEmoji", language)}</h2>

      <p>
        <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
      </p>

      <p>
        <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </p>

      {/* ADDRESS */}
      <h2>{t("storeAddressTitleEmoji", language)}</h2>

      <p>{SITE_CONFIG.address}</p>

      {/* WORKING HOURS */}
      <h2>{t("workingHoursTitle", language)}</h2>

      <p>{SITE_CONFIG.workingHours.days}</p>
      <p>{SITE_CONFIG.workingHours.hours}</p>

      {/* QUICK LINKS */}
      <h2>{t("quickLinksTitle", language)}</h2>

      <p><Link href="/">{t("home", language)}</Link></p>
      <p><Link href="/categories">{t("categories", language)}</Link></p>
      <p><Link href="/site/cart">{t("cart", language)}</Link></p>

      {/* NOORBAND AI */}
      <h2>🤖 NOORBAND AI</h2>

      <p>{t("noorbandAiContactBlurb", language)}</p>

      <p className="developer">
        {t("footerDesignedBy", language)}{" "}
        <span className="developer-first">{SITE_CONFIG.developer.firstName}</span>{" "}
        <span className="developer-last">{SITE_CONFIG.developer.lastName}</span>
      </p>
    </div>
  );
}

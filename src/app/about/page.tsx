"use client";

import { SITE_CONFIG } from "@/constants/site";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className="glass contact-page">
      <h1>{t("aboutPageTitle", language)}</h1>

      <p>
        {t("aboutPageIntro", language)
          .replace("{name}", SITE_CONFIG.name)
          .replace("{address}", SITE_CONFIG.address)}
      </p>

      <h2>{t("workingHoursTitle", language)}</h2>
      <p>{SITE_CONFIG.workingHours.days}</p>
      <p>{SITE_CONFIG.workingHours.hours}</p>

      <h2>☎ {t("footerContact", language)}</h2>
      {SITE_CONFIG.phones.map((phone) => (
        <p key={phone}>
          <a href={`tel:${phone}`}>{phone}</a>
        </p>
      ))}

      <p className="developer">
        {t("footerDesignedBy", language)}{" "}
        <span className="developer-first">{SITE_CONFIG.developer.firstName}</span>{" "}
        <span className="developer-last">{SITE_CONFIG.developer.lastName}</span>
      </p>
    </div>
  );
}

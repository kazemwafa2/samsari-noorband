"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LANGUAGES, LANGUAGE_LABELS } from "@/lib/i18n/dictionaries";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value as any)}>
      {LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>
          {LANGUAGE_LABELS[lang]}
        </option>
      ))}
    </select>
  );
}

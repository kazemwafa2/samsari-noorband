"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";

type RememberMeCheckboxProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
};

export default function RememberMeCheckbox({
  checked,
  onChange,
}: RememberMeCheckboxProps) {
  const { language } = useLanguage();

  return (
    <label className="remember-me-box">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(e.target.checked)
        }
      />

      {/* نکته اصلاح‌شده: قبلا این متن همیشه فارسی بود، حتی وقتی زبان
          سایت انگلیسی/عربی/... بود */}
      <span>{t("rememberMeLabel", language)}</span>
    </label>
  );
}
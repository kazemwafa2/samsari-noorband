"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";

// قبلا این یک <select> خام مرورگر بود (بدون هیچ استایلی، هماهنگ با
// هیچ‌کدام از دو تم نبود). حالا یک دکمه‌ی سه‌حالته‌ی سبک (روشن/تیره/
// خودکار) با آیکون، مطابق ظاهر باقی دکمه‌های سایت.
const OPTIONS = [
  { value: "light" as const, icon: Sun, label: "روشن" },
  { value: "dark" as const, icon: Moon, label: "تیره" },
  { value: "system" as const, icon: Monitor, label: "خودکار" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-switcher" role="group" aria-label="تغییر پوسته سایت">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            className={`theme-switcher-btn${active ? " active" : ""}`}
            aria-pressed={active}
            title={opt.label}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}

"use client";

// دقیقا همان مجموعه گل‌های تزئینی که کاربر فرستاد، به‌عنوان یک جداکننده
// ظریف بین بخش‌های صفحه اصلی. عمدا فقط یکی از ترکیب‌ها هر بار (نه همه‌ی
// آن‌ها با هم) استفاده می‌شود تا شلوغ نشود — طبق اصل «کم ولی خوب».

const FLORAL_COMBOS = [
  "🌷🩷✨",
  "🌸💖🦋",
  "🌹💕✨",
  "🪷🤍🌿",
  "🌼💛🍃",
  "🪻💜✨",
  "💐🩷🎀",
  "🌺💖🌴",
  "🌿🦋✨",
  "🍀💚🌸",
];

interface FloralDividerProps {
  seed?: number;
}

export default function FloralDivider({ seed = 0 }: FloralDividerProps) {
  const combo = FLORAL_COMBOS[Math.abs(seed) % FLORAL_COMBOS.length];

  return (
    <div className="floral-divider" aria-hidden="true">
      <span />
      <span className="floral-divider-emoji">{combo}</span>
      <span />
    </div>
  );
}

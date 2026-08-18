"use client";

interface CartAddedBurstProps {
  show: boolean;
}

// یک جرقه‌ی کوچک که کنار دکمه/آیکون «افزودن به سبد» لحظه‌ی کلیک نمایش
// داده می‌شود — بازخورد بصری کوتاه، هماهنگ با پالت رنگی سایت.
export function CartAddedBurst({ show }: CartAddedBurstProps) {
  if (!show) return null;

  return (
    <span className="cart-added-sparkles" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </span>
  );
}

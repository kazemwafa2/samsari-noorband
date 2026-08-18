"use client";

import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";

interface AnimatedHeartProps {
  isFavorite: boolean;
  size?: number;
}

// دکمه‌ی قلب علاقه‌مندی در همه‌جای سایت (کارت محصول، پیش‌نمایش سریع)
// از این یک کامپوننت استفاده می‌کند. وقتی محصول تازه به لیست
// علاقه‌مندی اضافه می‌شود (نه وقتی برداشته می‌شود)، قلب یک پرش کوچک
// می‌کند و چند جرقه‌ی رنگی هماهنگ با پالت سایت (بنفش/طلایی/صورتی)
// دورش پخش می‌شود — قبلا این دکمه فقط رنگش عوض می‌شد، هیچ واکنش
// بصری‌ای نداشت.
export function AnimatedHeart({ isFavorite, size = 16 }: AnimatedHeartProps) {
  const [burst, setBurst] = useState(false);
  const prevFavorite = useRef(isFavorite);

  useEffect(() => {
    if (isFavorite && !prevFavorite.current) {
      setBurst(true);
      const timer = setTimeout(() => setBurst(false), 650);
      prevFavorite.current = isFavorite;
      return () => clearTimeout(timer);
    }
    prevFavorite.current = isFavorite;
  }, [isFavorite]);

  return (
    <span className="animated-heart-wrap">
      <Heart
        size={size}
        fill={isFavorite ? "#EF4444" : "none"}
        color={isFavorite ? "#EF4444" : "currentColor"}
        className={burst ? "heart-pop" : ""}
      />
      {burst && (
        <span className="heart-sparkles" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
      )}
    </span>
  );
}

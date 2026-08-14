"use client";

import { useEffect, useState } from "react";
import { Phone, ArrowUp } from "lucide-react";
import { SITE_CONFIG } from "@/constants/site";

// قبلا این ۳ دکمه شناور فقط از ایموجی خام (💬 📞 ⬆️) استفاده می‌کردند
// که روی گوشی/فونت‌های مختلف ظاهر ناهماهنگی دارد. حالا آیکون واتساپ
// اصلی (SVG رسمی) و آیکون‌های lucide-react برای تماس/بازگشت‌به‌بالا
// استفاده می‌شود تا هر دکمه شکل و رنگ برند خودش را داشته باشد.
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden="true">
      <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.6 4.45 1.73 6.38L3.2 28.8l6.6-1.7a12.74 12.74 0 0 0 6.2 1.6h.005c7.07 0 12.8-5.73 12.8-12.8s-5.73-12.7-12.8-12.7zm0 23.24h-.004a10.4 10.4 0 0 1-5.3-1.45l-.38-.22-3.92 1.02 1.05-3.82-.25-.4a10.4 10.4 0 0 1-1.6-5.57c0-5.76 4.69-10.44 10.45-10.44 2.79 0 5.42 1.09 7.39 3.06a10.37 10.37 0 0 1 3.06 7.39c0 5.76-4.69 10.43-10.44 10.43zm5.72-7.82c-.31-.16-1.86-.92-2.15-1.02-.29-.11-.5-.16-.71.16-.21.31-.81 1.02-1 1.23-.18.21-.37.23-.68.08-.31-.16-1.31-.48-2.5-1.54-.92-.82-1.55-1.84-1.73-2.15-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.19.21-.31.31-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.63-.52-.53-.71-.54h-.6c-.21 0-.55.08-.83.4-.29.31-1.09 1.06-1.09 2.6s1.12 3.02 1.28 3.23c.16.21 2.2 3.37 5.34 4.73.75.32 1.33.51 1.79.66.75.24 1.44.2 1.98.13.6-.09 1.86-.76 2.13-1.5.26-.74.26-1.37.18-1.5-.08-.13-.29-.21-.6-.37z" />
    </svg>
  );
}

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowScrollTop(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phone = SITE_CONFIG.phones?.[0];

  return (
    <>
      <a
        href={SITE_CONFIG.whatsapp.link}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        aria-label="سفارش از طریق واتساپ"
      >
        <WhatsAppIcon />
      </a>

      {phone && (
        <a href={`tel:${phone}`} className="floating-call" aria-label="تماس با نوربند">
          <Phone size={24} />
        </a>
      )}

      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="floating-scroll-top"
          aria-label="بازگشت به بالا"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </>
  );
}

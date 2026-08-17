"use client";

import { useEffect, useRef } from "react";

// دقیقا مطابق درخواست: «داخل فاکتور لینک واتساپ و شبکه اجتماعی موجود
// فروشگاه به‌صورت بارکد چاپ شود» — این کامپوننت یک بارکد قابل اسکن
// (CODE128 — چون هر متن ASCII از جمله URL را پشتیبانی می‌کند) از یک
// لینک می‌سازد. کدام شبکه‌ها اصلا نمایش داده شوند از پنل مدیریت
// (تنظیمات برندینگ → invoice_barcode_platforms) انتخاب می‌شود.

interface SocialBarcodeProps {
  value: string;
  label: string;
}

export function SocialBarcode({ value, label }: SocialBarcodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;

    import("jsbarcode").then(({ default: JsBarcode }) => {
      if (cancelled || !canvasRef.current) return;

      try {
        JsBarcode(canvasRef.current, value, {
          format: "CODE128",
          width: 1.4,
          height: 40,
          displayValue: false,
          margin: 0,
        });
      } catch {
        // اگر مقدار خالی/نامعتبر بود، بی‌صدا رد می‌شویم — فاکتور نباید
        // به‌خاطر یک بارکد خراب کلا خراب شود
      }
    });

    return () => {
      cancelled = true;
    };
  }, [value]);

  if (!value) return null;

  return (
    <div className="invoice-barcode-item">
      <canvas ref={canvasRef} />
      <span>{label}</span>
    </div>
  );
}

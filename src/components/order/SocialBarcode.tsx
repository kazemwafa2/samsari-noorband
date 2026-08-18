"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

// نکته اصلاح‌شده: نسخه قبلی این کامپوننت یک بارکد خطی (CODE128 با
// jsbarcode) می‌ساخت. اما منظور کاربر از «بارکد» همان کیوآر کد بود —
// چیزی که با موبایل اسکن می‌شود و مستقیم لینک شبکه اجتماعی/واتساپ را
// باز می‌کند (دقیقا مثل QR Code خود سفارش که پایین‌تر همین فاکتور با
// همین کتابخانه qrcode ساخته می‌شود). یک بارکد خطی برای یک URL نه
// قابل اسکن با اپ‌های معمولی دوربین گوشی است، نه این کاربرد را دارد.

interface SocialBarcodeProps {
  value: string;
  label: string;
}

export function SocialBarcode({ value, label }: SocialBarcodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!value || !canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, value, {
      width: 90,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
    }).catch(() => {
      // اگر مقدار خالی/نامعتبر بود، بی‌صدا رد می‌شویم — فاکتور نباید
      // به‌خاطر یک کیوآر خراب کلا خراب شود
    });
  }, [value]);

  if (!value) return null;

  return (
    <div className="invoice-barcode-item">
      <canvas ref={canvasRef} />
      <span>{label}</span>
    </div>
  );
}

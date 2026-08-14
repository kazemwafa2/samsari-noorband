"use client";

import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

// useOnlineStatus قبلا در پروژه ساخته شده بود ولی هیچ‌جا استفاده
// نمی‌شد — یعنی کاربری که اینترنتش قطع می‌شد هیچ پیامی نمی‌دید و فقط
// با خطاهای fetch ناموفق روبه‌رو می‌شد. این کامپوننت یک نوار ثابت بالای
// صفحه نشان می‌دهد وقتی آفلاین است.
export default function OfflineBanner() {
  const { isOnline } = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        top: 0,
        insetInline: 0,
        zIndex: 9999,
        background: "#dc2626",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "8px 12px",
        fontSize: 14,
      }}
    >
      <WifiOff size={16} />
      اتصال اینترنت قطع شده — برخی بخش‌ها ممکن است کار نکنند
    </div>
  );
}

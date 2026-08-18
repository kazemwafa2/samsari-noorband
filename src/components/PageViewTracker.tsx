"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// یک ردیاب ساده بازدید صفحه؛ آنالیتیکس کامل (مدت حضور، صفحه خروج،
// کاربران آنلاین لحظه‌ای) نیست، ولی تعداد بازدید هر صفحه را واقعی
// ثبت می‌کند.

export default function PageViewTracker() {
  const supabase = createClient();
  const pathname = usePathname();

  useEffect(() => {
    async function track() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase.from("page_views").insert({
        path: pathname,
        user_id: user?.id ?? null,
      });
    }

    track();
  }, [pathname]);

  return null;
}

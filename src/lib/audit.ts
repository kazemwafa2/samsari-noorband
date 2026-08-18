"use client";

// قبلا از "@/lib/supabase" (کلاینت localStorage-محور) استفاده می‌کرد که
// هیچ‌وقت نشست واقعی ادمین را نمی‌دید (نشست واقعی در کوکی است، نه
// localStorage) — یعنی user_id همیشه undefined ثبت می‌شد و لاگ حسابرسی
// عملا بی‌فایده بود. حالا با همان کلاینت واقعی (@/lib/supabase/client)
// که middleware.ts/صفحه login هم استفاده می‌کنند هماهنگ است.
import { createClient } from "@/lib/supabase/client";

export async function logAction(
  action: string,
  entity: string,
  entityId: string | number,
  details?: any
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("audit_log").insert({
    user_id: user?.id,
    action,
    entity,
    entity_id: String(entityId),
    details: details || null,
  });
}

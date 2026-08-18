import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// لینک کوتاه محصول — چک‌لیست بخش ۱۹. قبلا اصلا زیرساختی برایش نبود.
// noorband.com/s/AB12CD → مسیر واقعی محصول، با شمارش کلیک واقعی.
export default async function ShortLinkRedirect({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: link } = await supabase
    .from("short_links")
    .select("target_path")
    .eq("code", code)
    .maybeSingle();

  if (!link) {
    notFound();
  }

  // شمارش کلیک از طریق تابع اتمیک (بخش ۱۷ در db/schema.sql) تا race
  // condition نداشته باشد؛ منتظرش نمی‌مانیم تا ریدایرکت کند شود.
  supabase.rpc("increment_short_link_click", { p_code: code }).then(() => {});

  redirect(link.target_path);
}

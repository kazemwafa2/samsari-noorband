import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

// برای فعال شدن Push واقعی:
// 1) دستور `npx web-push generate-vapid-keys` را اجرا کن
// 2) VAPID_PUBLIC_KEY و VAPID_PRIVATE_KEY را در .env.local بگذار
// 3) VAPID_PUBLIC_KEY را با پیشوند NEXT_PUBLIC_ هم برای کلاینت اضافه کن
//    (NEXT_PUBLIC_VAPID_PUBLIC_KEY) چون مرورگر برای subscribe به آن نیاز دارد

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails("mailto:admin@example.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export async function POST(request: Request) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return NextResponse.json(
      { success: false, error: "VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY تنظیم نشده‌اند." },
      { status: 500 }
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).maybeSingle();

  if (!user || !["admin", "super_admin"].includes(profile?.role)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { title, body, url } = await request.json();

  const { data: subscriptions } = await supabase.from("push_subscriptions").select("*");

  const results = await Promise.allSettled(
    (subscriptions || []).map((sub: any) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify({ title, body, url })
      )
    )
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;

  return NextResponse.json({ success: true, sent, total: subscriptions?.length || 0 });
}

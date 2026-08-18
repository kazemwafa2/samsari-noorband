import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// این route فقط سفارش‌های خودِ کاربرِ لاگین‌کرده را برمی‌گرداند.
// توجه: نام ستون‌ها بر اساس چیزی است که در src/app/site/checkout/page.tsx
// موقع ثبت سفارش استفاده شده (order_number, order_code, total_amount, ...).
// اگر اسکیمای واقعی جدول orders در Supabase شما فرق دارد، این نام‌ها را
// با ستون‌های واقعی هماهنگ کن.

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("ORDERS API ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, orders: data });
}

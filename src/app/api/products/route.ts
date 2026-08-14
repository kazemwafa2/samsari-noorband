import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // اصلاح شد: قبلا اینجا { supabase } از lib/supabase/server ایمپورت
    // می‌شد، ولی آن فایل فقط تابع createClient() را export می‌کند، نه
    // یک شیء supabase — یعنی این route همیشه undefined می‌گرفت و خطا
    // برمی‌گرداند.
    const supabase = await createClient();

    // اصلاح شد: فیلتر قبلا روی ستون "status" بود که در schema واقعی
    // محصولات وجود ندارد؛ ستون درست is_available است.
    const { data, error } = await supabase
      .from("products")
      .select(`*, categories(title)`)
      .eq("is_available", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

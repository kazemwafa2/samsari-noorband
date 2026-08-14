import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

// برای فعال شدن: در https://resend.com یک اکانت بساز، دامنه‌ات را verify
// کن، و RESEND_API_KEY را در .env.local بگذار.

const resendApiKey = process.env.RESEND_API_KEY;

// اصلاح امنیتی: قبلا این route بدون هیچ احراز هویتی بود و "to"،
// "orderNumber" و "totalAmount" مستقیم از بدنه درخواست کلاینت خوانده
// می‌شدند — یعنی هرکسی می‌توانست این endpoint عمومی را با هر ایمیل و
// هر متنی صدا بزند (سوءاستفاده از اکانت Resend برای اسپم/فیشینگ) و
// چون totalAmount/orderNumber بدون escape داخل HTML قرار می‌گرفتند،
// امکان تزریق HTML در ایمیل هم وجود داشت.
// الان: کاربر باید لاگین باشد، سفارش با شماره داده‌شده باید واقعا
// متعلق به همان کاربر باشد (طبق دیتابیس، نه ورودی کلاینت)، ایمیل فقط
// به آدرس ایمیل تایید‌شده‌ی همان کاربر ارسال می‌شود، و مبلغ از خود
// رکورد سفارش خوانده می‌شود نه از بدنه درخواست.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  if (!resendApiKey) {
    return NextResponse.json(
      { success: false, error: "RESEND_API_KEY تنظیم نشده است." },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { orderNumber } = await request.json();

  if (!orderNumber || typeof orderNumber !== "string") {
    return NextResponse.json({ success: false, error: "اطلاعات ناقص است." }, { status: 400 });
  }

  // سفارش را از دیتابیس می‌خوانیم و مالکیت آن را روی همین کاربر لاگین‌شده
  // چک می‌کنیم — هرگز به orderNumber/totalAmount که کلاینت ادعا می‌کند
  // اعتماد نمی‌کنیم.
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, order_number, total_amount")
    .eq("order_number", orderNumber)
    .eq("user_id", user.id)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json({ success: false, error: "سفارش پیدا نشد" }, { status: 404 });
  }

  const resend = new Resend(resendApiKey);
  const safeOrderNumber = escapeHtml(String(order.order_number));

  try {
    await resend.emails.send({
      from: "NOORBAND Jaghori <orders@yourdomain.com>",
      to: user.email,
      subject: `تایید سفارش #${safeOrderNumber}`,
      html: `
        <div dir="rtl" style="font-family: Tahoma, sans-serif;">
          <h2>سفارش شما ثبت شد 🎉</h2>
          <p>شماره سفارش: <strong>${safeOrderNumber}</strong></p>
          <p>مبلغ کل: <strong>${Number(order.total_amount).toLocaleString("fa-AF")} افغانی</strong></p>
          <p>از خرید شما از سیمساری نوربند جاغوری متشکریم.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

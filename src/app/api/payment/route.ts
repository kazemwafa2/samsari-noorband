import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// قبلا این route همیشه {status:"success"} برمی‌گرداند بدون اینکه واقعا
// پرداختی انجام شود — یعنی هر سفارشی به‌صورت خودکار "موفق" اعلام می‌شد.
// این یک ریسک امنیتی/مالی جدی است.
//
// این نسخه یک اسکلت واقعی برای درگاه زرین‌پال است (رایج‌ترین درگاه ایرانی).
// برای فعال شدن کامل باید:
//   1) MERCHANT_ID واقعی زرین‌پال را در .env.local به‌صورت
//      ZARINPAL_MERCHANT_ID=xxxx اضافه کنی (هرگز آن را در کد هاردکد نکن).
//   2) اگر از درگاه دیگری (آیدی‌پی، نکست‌پی و ...) استفاده می‌کنی،
//      فقط بدنه‌ی fetch به سرویس گیت‌وی را عوض کن، بقیه‌ی منطق یکی است.

const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || "";
const CALLBACK_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(request: Request) {
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

  const body = await request.json();
  const { order_id } = body;

  if (!order_id) {
    return NextResponse.json(
      { success: false, error: "order_id الزامی است" },
      { status: 400 }
    );
  }

  // سفارش را از دیتابیس می‌خوانیم تا مبلغ واقعی را خودمان تعیین کنیم
  // (هرگز نباید مبلغ پرداخت را از سمت کلاینت بگیریم، چون قابل دستکاری است)
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, total_amount, user_id")
    .eq("id", order_id)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { success: false, error: "سفارش پیدا نشد" },
      { status: 404 }
    );
  }

  if (!ZARINPAL_MERCHANT_ID) {
    return NextResponse.json(
      {
        success: false,
        error:
          "درگاه پرداخت هنوز تنظیم نشده است. ZARINPAL_MERCHANT_ID را در .env.local قرار بده.",
      },
      { status: 500 }
    );
  }

  try {
    const zarinpalResponse = await fetch(
      "https://payment.zarinpal.com/pg/v4/payment/request.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: ZARINPAL_MERCHANT_ID,
          amount: Math.round(order.total_amount), // مبلغ به افغانی یا ریال بسته به تنظیمات درگاهت
          callback_url: `${CALLBACK_BASE_URL}/api/payment/callback?order_id=${order.id}`,
          description: `پرداخت سفارش #${order.id}`,
        }),
      }
    );

    const zarinpalData = await zarinpalResponse.json();

    if (zarinpalData?.data?.code !== 100) {
      throw new Error(
        zarinpalData?.errors?.message || "خطا در اتصال به درگاه پرداخت"
      );
    }

    const authority = zarinpalData.data.authority;

    // مرجع پرداخت را روی سفارش ذخیره می‌کنیم تا در callback بتوانیم آن را تایید کنیم
    await supabase
      .from("orders")
      .update({ payment_authority: authority, payment_status: "pending" })
      .eq("id", order.id);

    return NextResponse.json({
      success: true,
      payment_url: `https://payment.zarinpal.com/pg/StartPay/${authority}`,
    });
  } catch (error: any) {
    console.log("PAYMENT API ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message || "خطای درگاه پرداخت" },
      { status: 500 }
    );
  }
}

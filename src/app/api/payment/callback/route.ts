import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || "";

// زرین‌پال کاربر را بعد از پرداخت با ?Authority=...&Status=OK به همین آدرس
// بازمی‌گرداند. اینجا باید پرداخت را با زرین‌پال verify کنیم، نه اینکه
// صرفا وجود Status=OK را ملاک "موفق بودن" بدانیم (چون قابل جعل در URL است).

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");
  const orderId = searchParams.get("order_id");

  const supabase = await createClient();

  if (status !== "OK" || !authority || !orderId) {
    if (orderId) {
      await supabase
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("id", orderId);
    }
    return NextResponse.redirect(
      new URL(`/orders/${orderId}?payment=failed`, request.url)
    );
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, total_amount, payment_authority")
    .eq("id", orderId)
    .single();

  if (!order || order.payment_authority !== authority) {
    return NextResponse.redirect(
      new URL(`/orders/${orderId}?payment=failed`, request.url)
    );
  }

  const verifyResponse = await fetch(
    "https://payment.zarinpal.com/pg/v4/payment/verify.json",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: Math.round(order.total_amount),
        authority,
      }),
    }
  );

  const verifyData = await verifyResponse.json();

  const isSuccessful =
    verifyData?.data?.code === 100 || verifyData?.data?.code === 101;

  await supabase
    .from("orders")
    .update({
      payment_status: isSuccessful ? "paid" : "failed",
      status: isSuccessful ? "paid" : "cancelled",
      ref_id: verifyData?.data?.ref_id ?? null,
    })
    .eq("id", orderId);

  return NextResponse.redirect(
    new URL(
      `/orders/${orderId}/success?payment=${isSuccessful ? "ok" : "failed"}`,
      request.url
    )
  );
}

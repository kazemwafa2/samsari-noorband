//==================================
// NOORBAND AI ORDER SYSTEM
//==================================
// این فایل قبلا اصلا وجود نداشت — router.ts هیچ راهی برای پاسخ به
// سوالات کاربر درباره سفارش‌هایش (کجاست، وضعیتش چیست، لغوش کن) نداشت.
// این توابع دقیقا با schema واقعی جدول orders/order_items هماهنگ‌اند.

import { createClient } from "@/lib/supabase/server";

const STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت‌شده",
  packing: "در حال بسته‌بندی",
  shipping: "در حال ارسال",
  completed: "تحویل داده‌شده",
  cancelled: "لغوشده",
  returned: "مرجوع‌شده",
};

//==================================
// لیست سفارش‌های کاربر
//==================================
export async function getUserOrdersAI(userId: string): Promise<string> {
  const supabase = await createClient();
  if (!userId) {
    return "برای دیدن سفارش‌هایتان ابتدا وارد حساب کاربری خود شوید.";
  }

  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status, total_amount, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.log("AI ORDERS ERROR:", error);
    return "در دریافت سفارش‌ها مشکلی پیش آمد.";
  }

  if (!data || data.length === 0) {
    return "شما تا کنون سفارشی ثبت نکرده‌اید.";
  }

  let result = "📦 سفارش‌های اخیر شما:\n\n";

  data.forEach((order, index) => {
    result += `${index + 1}. سفارش #${order.order_number || order.id} — ${
      STATUS_LABELS[order.status] || order.status
    } — ${Number(order.total_amount).toLocaleString("fa-AF")} افغانی\n`;
  });

  return result;
}

//==================================
// جستجو/رهگیری یک سفارش خاص (با شماره سفارش)
//==================================
export async function trackOrderAI(userId: string, message: string): Promise<string> {
  const supabase = await createClient();
  const orderNumberMatch = message.match(/[A-Za-z0-9\-]{4,}/);

  if (!orderNumberMatch) {
    return "لطفاً شماره سفارش خود را وارد کنید (مثلا NB-20260101-12345).";
  }

  const orderNumber = orderNumberMatch[0];

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, order_number, status, total_amount, delivery_status, created_at")
    .eq("order_number", orderNumber)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.log("AI TRACK ORDER ERROR:", error);
    return "در بررسی سفارش مشکلی پیش آمد.";
  }

  if (!order) {
    return `سفارشی با شماره "${orderNumber}" برای حساب شما پیدا نشد.`;
  }

  return (
    `📦 سفارش #${order.order_number}\n` +
    `وضعیت: ${STATUS_LABELS[order.status] || order.status}\n` +
    `مبلغ: ${Number(order.total_amount).toLocaleString("fa-AF")} افغانی\n` +
    `تاریخ ثبت: ${new Date(order.created_at).toLocaleDateString("fa-AF")}`
  );
}

// searchOrderAI هم‌نام دیگری برای trackOrderAI است (سازگاری با نام‌گذاری
// درخواستی)؛ منطقش یکیست.
export const searchOrderAI = trackOrderAI;

//==================================
// لغو سفارش
//==================================
export async function cancelOrderAI(userId: string, message: string): Promise<string> {
  const supabase = await createClient();
  const orderNumberMatch = message.match(/[A-Za-z0-9\-]{4,}/);

  if (!orderNumberMatch) {
    return "لطفاً شماره سفارشی که می‌خواهید لغو کنید را وارد کنید.";
  }

  const orderNumber = orderNumberMatch[0];

  const { data: order, error: findError } = await supabase
    .from("orders")
    .select("id, status, user_id")
    .eq("order_number", orderNumber)
    .eq("user_id", userId)
    .maybeSingle();

  if (findError || !order) {
    return `سفارشی با شماره "${orderNumber}" پیدا نشد.`;
  }

  if (["shipping", "completed", "cancelled", "returned"].includes(order.status)) {
    return `این سفارش در وضعیت «${STATUS_LABELS[order.status]}» است و دیگر قابل لغو نیست. برای مرجوعی از پنل سفارش خود اقدام کنید.`;
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", order.id);

  if (updateError) {
    console.log("AI CANCEL ORDER ERROR:", updateError);
    return "لغو سفارش با خطا مواجه شد.";
  }

  return `سفارش #${orderNumber} با موفقیت لغو شد.`;
}

//==================================
// روتر کوچک: تشخیص اینکه پیام کاربر مربوط به کدام اکشن سفارش است
//==================================
export async function orderIntentAI(userId: string, message: string): Promise<string | null> {
  const lower = message.toLowerCase();

  const isOrderRelated =
    lower.includes("سفارش") || lower.includes("رهگیری") || lower.includes("پیگیری") || lower.includes("order");

  if (!isOrderRelated) return null;

  if (lower.includes("لغو") || lower.includes("cancel")) {
    return cancelOrderAI(userId, message);
  }

  if (lower.includes("لیست") || lower.includes("سفارش‌های من") || lower.includes("سفارشاتم")) {
    return getUserOrdersAI(userId);
  }

  // اگر شماره سفارشی در پیام باشد، یعنی می‌خواهد یک سفارش خاص را رهگیری کند
  if (/[A-Za-z0-9\-]{4,}/.test(message)) {
    return trackOrderAI(userId, message);
  }

  return getUserOrdersAI(userId);
}

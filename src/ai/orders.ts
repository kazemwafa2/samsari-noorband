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
// نکته اصلاح‌شده: قبلا این تابع همیشه فیلتر user_id هم می‌زد و از
// router.ts هم فقط زمانی صدا زده می‌شد که کاربر لاگین بود — یعنی چت‌بات
// اصلا نمی‌توانست با «کد پیگیری» به یک کاربر مهمان (بدون لاگین) کمک
// کند. حالا اگر userId خالی باشد (مهمان)، جستجو فقط بر اساس شماره
// سفارش انجام می‌شود (بدون فیلتر مالکیت) — دقیقا رفتار رایج «پیگیری
// سفارش با کد» در بیشتر فروشگاه‌های آنلاین.
export async function trackOrderAI(userId: string, message: string): Promise<string> {
  const supabase = await createClient();
  const orderNumberMatch = message.match(/[A-Za-z0-9\-]{4,}/);

  if (!orderNumberMatch) {
    return "لطفاً کد پیگیری/شماره سفارش خود را وارد کنید (مثلا NB-20260101-12345).";
  }

  const orderNumber = orderNumberMatch[0];

  // کاربر لاگین‌شده: مستقیم از جدول orders (RLS خودش مالکیت را چک
  // می‌کند). کاربر مهمان: از طریق تابع امن track_order_by_number که
  // فقط با شماره دقیق سفارش کار می‌کند و فقط فیلدهای غیرحساس را
  // برمی‌گرداند — چون RLS جدول orders به‌درستی به کاربر بدون لاگین
  // هیچ ردیفی نشان نمی‌دهد.
  if (userId) {
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

    if (order) {
      return (
        `📦 سفارش #${order.order_number}\n` +
        `وضعیت: ${STATUS_LABELS[order.status] || order.status}\n` +
        `مبلغ: ${Number(order.total_amount).toLocaleString("fa-AF")} افغانی\n` +
        `تاریخ ثبت: ${new Date(order.created_at).toLocaleDateString("fa-AF")}`
      );
    }
    // اگر با فیلتر مالکیت چیزی پیدا نشد، به حالت مهمان (پایین) سقوط
    // می‌کند تا اگر کد درست بود ولی سفارش متعلق به کاربر دیگری نبود
    // هم پیام «پیدا نشد» درست باشد، نه فرض غلط.
  }

  const { data: guestOrder, error: guestError } = await supabase.rpc("track_order_by_number", {
    p_order_number: orderNumber,
  });

  if (guestError) {
    console.log("AI TRACK ORDER (GUEST) ERROR:", guestError);
    return "در بررسی سفارش مشکلی پیش آمد.";
  }

  const order = Array.isArray(guestOrder) ? guestOrder[0] : guestOrder;

  if (!order) {
    return `سفارشی با کد "${orderNumber}" پیدا نشد. لطفاً کد را دوباره بررسی کنید.`;
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
// گزارش مشکل به ادمین — دقیقا طبق درخواست: «چت‌بات هر مشکلی را که
// کاربر می‌گوید باید به ادمین گزارش دهد». پاسخ عادی به کاربر همچنان از
// طریق Groq داده می‌شود؛ این تابع فقط به‌صورت جانبی و بی‌صدا یک اعلان
// برای همه‌ی ادمین‌ها می‌سازد (از طریق تابع امن دیتابیس
// report_issue_to_admin) تا هیچ مشکلی گم نشود.
//==================================
const ISSUE_KEYWORDS = [
  "مشکل", "شکایت", "خراب", "کار نمیکند", "کار نمی‌کند", "نمیشه", "نمی‌شود",
  "problem", "issue", "complaint", "broken", "not working", "doesn't work",
  "مشكلة", "معطل", "problème", "cassé", "Problem", "kaputt", "funktioniert nicht",
];

export function looksLikeIssueReport(message: string): boolean {
  const lower = message.toLowerCase();
  return ISSUE_KEYWORDS.some((k) => lower.includes(k.toLowerCase()));
}

export async function reportIssueToAdmin(userId: string | undefined, message: string): Promise<void> {
  const supabase = await createClient();

  try {
    await supabase.rpc("report_issue_to_admin", {
      p_message: message,
      p_reporter_id: userId || null,
    });
  } catch (error) {
    // گزارش مشکل نباید خودش باعث خراب‌شدن پاسخ عادی چت‌بات به کاربر شود
    console.log("REPORT ISSUE TO ADMIN ERROR:", error);
  }
}

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
// نکته اصلاح‌شده: قبلا این تابع فرض می‌کرد کاربر همیشه لاگین است.
// حالا برای «پیگیری با کد سفارش» به کاربر مهمان هم اجازه می‌دهد
// (چون trackOrderAI بالا خودش userId خالی را می‌پذیرد)؛ فقط لیست کامل
// سفارش‌ها و لغو سفارش هنوز نیاز به ورود دارند (برای حفظ حریم خصوصی).
export async function orderIntentAI(userId: string, message: string): Promise<string | null> {
  const lower = message.toLowerCase();

  const isOrderRelated =
    lower.includes("سفارش") ||
    lower.includes("رهگیری") ||
    lower.includes("پیگیری") ||
    lower.includes("کد پیگیری") ||
    lower.includes("order") ||
    lower.includes("tracking") ||
    lower.includes("track");

  if (!isOrderRelated) return null;

  if (lower.includes("لغو") || lower.includes("cancel")) {
    if (!userId) return "برای لغو سفارش، ابتدا وارد حساب کاربری خود شوید.";
    return cancelOrderAI(userId, message);
  }

  if (lower.includes("لیست") || lower.includes("سفارش‌های من") || lower.includes("سفارشاتم")) {
    if (!userId) return "برای دیدن لیست سفارش‌هایتان، ابتدا وارد حساب کاربری خود شوید — یا اگر کد پیگیری سفارش را دارید همان را برایم بفرستید.";
    return getUserOrdersAI(userId);
  }

  // اگر یک کد/شماره سفارش در پیام باشد، رهگیری با کد انجام می‌شود —
  // چه کاربر لاگین باشد چه مهمان
  if (/[A-Za-z0-9\-]{4,}/.test(message)) {
    return trackOrderAI(userId, message);
  }

  if (!userId) {
    return "لطفاً کد پیگیری سفارش خود را برایم بفرستید تا وضعیتش را برایتان بررسی کنم.";
  }

  return getUserOrdersAI(userId);
}

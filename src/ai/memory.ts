// نکته: کلید ذخیره‌سازی نسخه‌دار شد (V2). دلیلش این است که این پروژه
// قبلا (پیش از تغییر نام رسمی به «سیمساری نوربند جاغوری» و بازطراحی
// چت‌بات) با همین کلید در localStorage کاربرانی که قبلا امتحانش کرده
// بودند، گفتگوی قدیمی ذخیره کرده بود. بدون نسخه‌دار کردن، ChatBot.tsx
// چون می‌بیند «حافظه خالی نیست»، پیام خوش‌آمدگویی تازه را هرگز نشان
// نمی‌دهد و همان گفتگوی قدیمی (با نام/متن قدیمی) را نشان می‌دهد.
// نسخه‌دار کردن یعنی هر کسی که قبلا استفاده کرده، یک‌بار پیام خوش‌آمد
// تازه می‌بیند؛ گفتگوی جدیدش از همین به بعد باز هم ذخیره و یادآوری می‌شود.
const MEMORY_KEY = "NOORBAND_AI_MEMORY_V2";

// باگ واقعی که باعث کرش کامل صفحه می‌شد: JSON.parse بدون try/catch.
// اگر مقدار ذخیره‌شده در localStorage به هر دلیلی (نسخه قدیمی‌تر و
// ناسازگار، دستکاری دستی، افزونه مرورگر، فضای پر) یک JSON معتبر نباشد،
// JSON.parse یک خطای همزمان (SyntaxError) پرتاب می‌کند. چون این تابع
// داخل useEffect در ChatBot.tsx صدا زده می‌شود، این خطای مدیریت‌نشده
// از مرز React خارج شده و کل صفحه را با صفحه عمومی خطای Next.js
// («Application error: a client-side exception has occurred»)
// جایگزین می‌کرد — دقیقا همان چیزی که با کلیک روی دکمه چت‌بات دیده شد.
// هر دو تابع حالا با try/catch محافظت شده‌اند و در صورت خرابی داده،
// به‌جای کرش، حافظه را پاک و از صفر شروع می‌کنند.

export function saveAIMemory(data: any) {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    const old = raw ? JSON.parse(raw) : [];
    const safeOld = Array.isArray(old) ? old : [];

    const updated = [...safeOld, data];

    if (updated.length > 50) updated.shift();

    localStorage.setItem(MEMORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.log("NOORBAND AI MEMORY SAVE ERROR:", error);
    // داده خراب بود؛ به‌جای کرش کردن، حافظه را پاک می‌کنیم تا دفعه بعد
    // از یک وضعیت سالم شروع شود.
    try {
      localStorage.removeItem(MEMORY_KEY);
    } catch {
      // اگر خود localStorage در دسترس نباشد (مثلا حالت خصوصی مرورگر
      // با ذخیره‌سازی غیرفعال)، همین‌جا بی‌صدا رها می‌کنیم.
    }
  }
}

export function getAIMemory(): { role: "AI" | "USER"; text: string }[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.log("NOORBAND AI MEMORY READ ERROR:", error);
    return [];
  }
}

export function clearAIMemory() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(MEMORY_KEY);
  } catch (error) {
    console.log("NOORBAND AI MEMORY CLEAR ERROR:", error);
  }
}

// ==================================
// NOORBAND AI — LANGUAGE DETECTION
// ==================================
// هفت زبان رسمی و پشتیبانی‌شده سایت (دقیقا همان لیست جدول `languages`
// در db/schema.sql که LocaleProvider/LocaleSelector از آن می‌خوانند):
// دری (prs) پیش‌فرض، پشتو (ps)، فارسی (fa)، انگلیسی (en)، عربی (ar)،
// فرانسوی (fr)، آلمانی (de).
//
// قبلا این تابع همیشه یک زبان برمی‌گرداند (هیچ‌وقت null/undefined) و
// چون فقط کلمات دری/فارسی/پشتو/انگلیسی/آلمانی/فرانسوی/ایتالیایی را از
// روی چند کلمه‌ی محدود حدس می‌زد، برای هر پیام مبهم (یا حتی عربی یا
// فرانسوی/آلمانیِ خارج از آن چند کلمه) بی‌صدا به "prs" برمی‌گشت — و چون
// systemPrompt.ts هم فقط ۴ زبان را صریح پیاده‌سازی کرده بود، این یعنی
// در عمل هر زبانی جز دری/پشتو/انگلیسی/آلمانی، به دستورالعمل «فقط فارسی/
// دری جواب بده» می‌افتاد؛ دقیقا همان چیزی که کاربر می‌بیند وقتی ربات
// می‌گوید «فقط دستور دارم به دری/فارسی جواب بدهم».
//
// این نسخه: (۱) هیچ‌وقت زبانی که در لیست هفت‌گانه نیست برنمی‌گرداند،
// (۲) وقتی از روی متن پیام با اطمینان کافی نمی‌توان زبان را تشخیص داد
// (پیام خالی، خیلی کوتاه، یا فاقد هرگونه نشانه‌ی زبانی)، undefined
// برمی‌گرداند تا فراخوان (aiRouter) بتواند به‌جایش از زبانی که خود
// سایت قبلا (بر اساس URL/جغرافیا/انتخاب کاربر) تشخیص داده استفاده کند،
// نه اینکه کورکورانه دری را جایگزین کند.

export type SupportedLanguage = "prs" | "fa" | "ps" | "en" | "ar" | "fr" | "de";

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  "prs",
  "fa",
  "ps",
  "en",
  "ar",
  "fr",
  "de",
];

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return (
    typeof value === "string" &&
    (SUPPORTED_LANGUAGES as string[]).includes(value)
  );
}

export function detectLanguage(message: string): SupportedLanguage | undefined {
  const text = message.toLowerCase().trim();

  if (!text) return undefined;

  // پشتو — حروف اختصاصی پشتو که در دری/فارسی نیستند
  if (
    text.includes("څ") ||
    text.includes("ځ") ||
    text.includes("ږ") ||
    text.includes("ښ") ||
    text.includes("ې") ||
    text.includes("ۍ") ||
    text.includes("مننه") ||
    text.includes("ستاسو") ||
    text.includes("څنګه")
  ) {
    return "ps";
  }

  // انگلیسی
  if (
    /\b(hello|hi|hey|how are you|product|price|order|available|buy|sell|thanks|please)\b/i.test(
      text
    )
  ) {
    return "en";
  }

  // آلمانی (سوئیسی/اتریشی هم همینجا به آلمانی نگاشت می‌شود)
  if (
    /\b(hallo|guten|guten morgen|guten tag|guten abend|preis|produkt|bestellung|kaufen|danke|grüezi|gruezi)\b/i.test(
      text
    )
  ) {
    return "de";
  }

  // فرانسوی
  if (
    /\b(bonjour|bonsoir|salut|prix|produit|commande|merci|s'il vous plaît)\b/i.test(
      text
    )
  ) {
    return "fr";
  }

  // عربی — کلمات/عبارات رایج عربی که در دری/فارسی محاوره‌ای استفاده
  // نمی‌شوند (چون رسم‌الخط عربی و دری/فارسی مشترک است، باید از روی
  // واژگان تشخیص داد نه حروف)
  if (
    text.includes("مرحبا") ||
    text.includes("السلام عليكم") ||
    text.includes("كم السعر") ||
    text.includes("شكرا") ||
    text.includes("من فضلك") ||
    text.includes("أريد") ||
    text.includes("متوفر") ||
    text.includes("هل يوجد")
  ) {
    return "ar";
  }

  // دری افغانستان
  if (
    text.includes("سلام علیکم") ||
    text.includes("عرض ادب") ||
    text.includes("هستین") ||
    text.includes("چیطور") ||
    text.includes("کدام") ||
    text.includes("می‌خواهم") ||
    text.includes("میخواهم") ||
    text.includes("خوش آمدید") ||
    text.includes("تشکر")
  ) {
    return "prs";
  }

  // فارسی ایران
  if (
    text.includes("درود") ||
    text.includes("قیمت") ||
    text.includes("محصول") ||
    text.includes("خرید") ||
    text.includes("فروش") ||
    text.includes("چادر") ||
    text.includes("لباس") ||
    text.includes("موجودی") ||
    text.includes("سفارش") ||
    text.includes("می‌باشد") ||
    text.includes("ممنون")
  ) {
    return "fa";
  }

  // سلام ساده و سایر پیام‌های بدون نشانه‌ی زبانی مشخص: فراخوان تصمیم
  // می‌گیرد (زبان سایت/interfaceLanguage جایگزین می‌شود)
  return undefined;
}

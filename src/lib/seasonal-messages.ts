// سیستم پیام‌های فصلی/زمانی — نسخه تمیز و ساده
// ==========================================================
// این فایل جایگزین سه فایل یتیم قبلی شد: ai/smart.ts،
// ai/notifications.ts، ai/user-events.ts (~۵۵۰ خط). آن فایل‌ها هیچ‌جای
// اپ import نمی‌شدند (کد کاملا مرده بودند) و زبان کاربر را از یک کش
// جداگانه (ai/cache) می‌خواندند که با LanguageProvider اصلی سایت
// هماهنگ نبود — یعنی حتی اگر وصل می‌شدند، زبان پیام‌ها می‌توانست با
// زبان واقعی انتخاب‌شده کاربر متفاوت باشد.
//
// اصل مهم: هیچ داده‌ای که واقعا نمی‌دانیم حدس زده نمی‌شود. برای همین:
// - آب‌وهوا (WEATHER_MESSAGE) و اوقات شرعی/طلوع‌وغروب
//   (PRAYER_TIME_MESSAGE، SUNRISE_MESSAGE، SUNSET_MESSAGE) اینجا نیستند
//   — این‌ها به API واقعی هواشناسی/محاسبه نجومی دقیق برای مختصات
//   جاغوری نیاز دارند که هنوز نداریم؛ ساختن آن‌ها با داده ساختگی بدتر
//   از نداشتنشان است.
// - عید فطر/قربان و رمضان (EID_MESSAGE و مشابه) اینجا نیستند — این‌ها
//   روی تقویم قمری‌اند که هرسال حدود ۱۱ روز زودتر می‌افتد؛ بدون یک
//   کتابخانه‌ی تقویم هجری قمری واقعی (که در package.json نیست)، حدس
//   زدن تاریخشان یعنی احتمالا در روز اشتباه «عید مبارک» نشان بدهیم.
// - سال نو اینجا فقط ۱ ژانویه میلادی است، نه نوروز — چون تاریخ دقیق
//   نوروز (اعتدال بهاری) هرسال کمی جابه‌جا می‌شود (۱۹ تا ۲۱ مارس) و
//   محاسبه دقیقش هم به کتابخانه نجومی نیاز دارد.
//
// همه‌ی موارد بالا واقعی و قابل‌ساخت‌اند، فقط باید جداگانه و با کتابخانه
// درست (تقویم هجری قمری + API هواشناسی) اضافه شوند.

import { getMessage } from "@/constants/messages";
import type { Language } from "@/lib/i18n/dictionaries";

export type SeasonalMessage = { key: string; text: string } | null;

function getSeasonKey(month: number): string {
  // فصل‌های میلادی نجومی/هواشناسی — افغانستان در نیم‌کره شمالی است.
  if (month >= 3 && month <= 5) return "SPRING_MESSAGE";
  if (month >= 6 && month <= 8) return "SUMMER_MESSAGE";
  if (month >= 9 && month <= 11) return "AUTUMN_MESSAGE";
  return "WINTER_MESSAGE"; // 12, 1, 2
}

// یک پیام «امروز» را برمی‌گرداند: اولویت با مناسبت‌های نادر (سال نو،
// جمعه) است، وگرنه فصل + زمان روز با هم به یک پیام واحد ترکیب می‌شوند
// تا کاربر در هر بازدید چند toast پشت‌سرهم نبیند.
export function getTodaysSeasonalMessage(language: Language): SeasonalMessage {
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const day = now.getDay(); // 0=یکشنبه ... 5=جمعه ... 6=شنبه
  const hour = now.getHours();

  if (month === 1 && date === 1) {
    return { key: "NEW_YEAR_MESSAGE", text: getMessage("NEW_YEAR_MESSAGE", language) };
  }

  if (day === 5) {
    return { key: "FRIDAY_MESSAGE", text: getMessage("FRIDAY_MESSAGE", language) };
  }

  if (hour >= 11 && hour < 16) {
    return { key: "NOON_MESSAGE", text: getMessage("NOON_MESSAGE", language) };
  }

  if (hour >= 16 && hour < 20) {
    return { key: "EVENING_MESSAGE", text: getMessage("EVENING_MESSAGE", language) };
  }

  const seasonKey = getSeasonKey(month);
  return { key: seasonKey, text: getMessage(seasonKey, language) };
}

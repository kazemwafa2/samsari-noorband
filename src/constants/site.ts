// اطلاعات فروشگاه — یک منبع واحد
// قبلا این اطلاعات هم در src/app/contact/page.tsx و هم در
// src/components/Footer.tsx جداگانه و تکراری نوشته شده بود؛ یعنی هر
// تغییری (شماره تماس، آدرس و ...) باید در چند فایل هم‌زمان اعمال
// می‌شد و امکان فراموش‌شدن یکی از آن‌ها بالا بود. حالا همه‌جا از همین
// فایل خوانده می‌شود.

export const SITE_CONFIG = {
  name: "سیمساری نوربند جاغوری",

  address: "افغانستان، ولایت غزنی، ولسوالی جاغوری، بازار سنگ‌ماشه، مارکیت VIP، زیر قومندانی، دوکان شماره ۵",

  phones: ["0093765323400", "0093747689694"],

  whatsapp: {
    number: "0093782884528",
    link: "https://wa.me/93782884528",
  },

  email: "", // اگر ایمیل فروشگاه را داری، اینجا اضافه کن

  social: {
    facebook: "https://www.facebook.com/share/1Zmb391yso/",
    instagram: "https://www.instagram.com/shegofarezaie114?igsh=MWExN2dlYjZiZHNoeA==",
  },

  workingHours: {
    days: "شنبه تا پنجشنبه",
    hours: "۸ صبح الی ۶ عصر",
  },

  developer: {
    firstName: "کاظم",
    lastName: "رفیعی",
  },

  version: "1.0.0",
  copyrightYear: "2026",
  copyrightYearShamsi: "1405",
} as const;

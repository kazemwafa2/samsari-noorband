// تبدیل تقویم میلادی به هجری شمسی (همان تقویمی که در افغانستان و ایران
// استفاده می‌شود). الگوریتم استاندارد تبدیل جلالی/گرگوری بدون نیاز به
// هیچ کتابخانه خارجی. قبلا در کل پروژه فقط از
// toLocaleDateString("fa-IR") استفاده می‌شد که آن هم شمسی نمایش می‌دهد
// ولی کنترلی روی فرمت (مثلا برای فاکتور یا فرم‌های رسمی) نمی‌داد.

export interface JalaliDate {
  year: number;
  month: number; // 1-12
  day: number;
}

export function toJalali(gDate: Date): JalaliDate {
  const gy = gDate.getFullYear();
  const gm = gDate.getMonth() + 1;
  const gd = gDate.getDate();

  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  let gy2 = gy <= 1600 ? gy - 621 : gy - 1600;
  const gy3 = gm > 2 ? gy2 + 1 : gy2;

  let days =
    365 * gy2 +
    Math.floor((gy3 + 3) / 4) -
    Math.floor((gy3 + 99) / 100) +
    Math.floor((gy3 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];

  jy += 33 * Math.floor(days / 12053);
  days %= 12053;

  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);

  return { year: jy, month: jm, day: jd };
}

const JALALI_MONTHS = [
  "حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله",
  "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت",
];

export function formatJalali(gDate: Date): string {
  const { year, month, day } = toJalali(gDate);
  return `${day} ${JALALI_MONTHS[month - 1]} ${year}`;
}

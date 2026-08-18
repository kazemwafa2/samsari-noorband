const KEY = "noorband_recently_viewed";
const MAX_ITEMS = 10;

// هیچ جدول/ستون دیتابیسی برای «اخیرا مشاهده‌شده» وجود نداشت. چون این
// قابلیت ذاتا مخصوص همان مرورگر/دستگاه است (نه چیزی که لزوما باید بین
// دستگاه‌های کاربر sync شود)، ساده و بدون نیاز به لاگین در localStorage
// نگه داشته می‌شود.

export function trackRecentlyViewed(productId: number) {
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(KEY);
    const ids: number[] = raw ? JSON.parse(raw) : [];

    const next = [productId, ...ids.filter((id) => id !== productId)].slice(0, MAX_ITEMS);

    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // localStorage در دسترس نیست (مثلا حالت خصوصی مرورگر) — بی‌خطر رد می‌شویم.
  }
}

export function getRecentlyViewed(excludeId?: number): number[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(KEY);
    const ids: number[] = raw ? JSON.parse(raw) : [];
    return excludeId ? ids.filter((id) => id !== excludeId) : ids;
  } catch {
    return [];
  }
}

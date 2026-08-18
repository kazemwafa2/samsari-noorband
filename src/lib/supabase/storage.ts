import { createClient } from "./client";

const supabase = createClient();

// قبلا uploadImage فقط آپلود می‌کرد ولی راهی برای گرفتن URL عمومی قابل
// نمایش نداشتیم. اینجا آن اضافه شده.
// نکته: باکت "images" باید در Supabase → Storage به‌صورت Public ساخته شود
// و حتما یک Storage Policy روی آن تنظیم شود (نوشتن فقط برای
// authenticated، خواندن عمومی) — RLS جدول‌های دیتابیس روی باکت‌های
// Storage اثر ندارد، آن‌ها Policy جدا دارند.

// اصلاح: قبلا این توابع فقط باکت "images" را می‌شناختند. پروژه واقعا
// چند باکت جدا دارد (avatars, images, ...)، هرکدام با Policy مخصوص
// خودش در Supabase → Storage، پس حالا باکت به‌عنوان پارامتر اختیاری
// گرفته می‌شود (پیش‌فرض همان "images" قبلی تا جایی که صدا زده می‌شود خراب نشود).

// اصلاح امنیتی: قبلا هیچ محدودیتی روی نوع/حجم فایل نبود — یعنی هر
// کاربر لاگین‌شده می‌توانست هر نوع فایلی (حتی html/svg قابل اجرا یا
// فایل خیلی بزرگ) را در باکت عمومی آپلود کند.
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

export async function uploadImage(file: File, path: string, bucket: string = "images") {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      data: null,
      error: { message: "فقط تصاویر JPG، PNG، WEBP یا GIF مجاز است." },
    } as const;
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return {
      data: null,
      error: { message: "حجم تصویر نباید بیشتر از ۵ مگابایت باشد." },
    } as const;
  }

  return await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });
}

// آپلود ویدیو (برای ویدیوی تبلیغاتی صفحه اصلی) — جدا از uploadImage
// چون نوع فایل و سقف حجم مجاز کاملاً متفاوت است.
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB

export async function uploadVideo(file: File, path: string, bucket: string = "videos") {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      data: null,
      error: { message: "فقط فایل‌های ویدیویی MP4، WEBM یا MOV مجاز است." },
    } as const;
  }

  if (file.size > MAX_VIDEO_BYTES) {
    return {
      data: null,
      error: { message: "حجم ویدیو نباید بیشتر از ۵۰ مگابایت باشد. برای ویدیوهای بزرگ‌تر، از لینک یوتیوب/آپارات استفاده کنید." },
    } as const;
  }

  return await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });
}

export function getImagePublicUrl(path: string, bucket: string = "images") {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImage(path: string, bucket: string = "images") {
  return await supabase.storage.from(bucket).remove([path]);
}

// از روی URL عمومی، مسیر خام فایل داخل باکت را برمی‌گرداند — چون در
// کامپوننت‌ها فقط URL نهایی را نگه می‌داریم، نه مسیر خام، و برای حذف
// فایل از Storage به همان مسیر خام نیاز داریم.
export function getPathFromPublicUrl(url: string, bucket: string = "images") {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

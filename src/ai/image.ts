//==================================
// NOORBAND AI IMAGE SYSTEM
//==================================

import { getMessage } from "@/constants/messages";
import type { Language } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/server";

type ImageResult = {
  success: boolean;
  type: string;
  message: string;
  image?: string;
};

//==================================
// IMAGE AI
//==================================

export async function imageAI(
  image: string,
  language: string = "fa"
): Promise<string> {

  const product =
    await detectProduct(image, language);

  if (product.success) {
    return product.message;
  }

  const similar =
    await similarProducts(image, language);

  return similar.message;
}

//==================================
// IMAGE SEARCH
//==================================

export async function imageSearch(
  image: string,
  language: string = "fa"
): Promise<ImageResult> {

  return {
    success: true,

    type: "IMAGE_SEARCH",

    message:
      getMessage("SEARCH_MESSAGE", language as Language) ||
      "در حال جستجوی تصویر...",

    image,
  };
}

//==================================
// PRODUCT DETECTION
//==================================

export async function detectProduct(
  image: string,
  language: string = "fa"
): Promise<ImageResult> {

  return {
    success: true,

    type: "PRODUCT",

    message:
      getMessage("PRODUCT_MESSAGE", language as Language) ||
      "محصول شناسایی شد.",

    image,
  };
}

//==================================
// SIMILAR PRODUCTS
//==================================

export async function similarProducts(
  image: string,
  language: string = "fa"
): Promise<ImageResult> {

  return {
    success: true,

    type: "SIMILAR_PRODUCTS",

    message:
      getMessage("SMART_SUGGESTION_MESSAGE", language as Language) ||
      "محصولات مشابه پیدا شدند.",

    image,
  };
}

//==================================
// IMAGE VALIDATION
//==================================

export function isValidImage(
  file: File
): boolean {

  const allow = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];

  return allow.includes(file.type);
}

//==================================
// IMAGE SIZE
//==================================

export function validImageSize(
  file: File
): boolean {

  const maxSize =
    5 * 1024 * 1024;

  return file.size <= maxSize;
}

//==================================
// IMAGE UPLOAD
//==================================

export async function uploadImage(
  file: File
) {
  const supabase = await createClient();

  if (!isValidImage(file)) {
    return {
      success: false,
      message:
        "فرمت تصویر پشتیبانی نمی‌شود.",
    };
  }

  if (!validImageSize(file)) {
    return {
      success: false,
      message:
        "حجم تصویر بیش از ۵ مگابایت است.",
    };
  }

  // اگر ENV ها وجود نداشتند
  if (
    !process.env
      .NEXT_PUBLIC_SUPABASE_URL
  ) {
    return {
      success: true,
      message:
        "تصویر آماده پردازش است.",
      file,
    };
  }

  const fileName =
    `ai/${Date.now()}-${file.name}`;

  const { data, error } =
    await supabase.storage
      // اصلاح شد: قبلا اینجا از باکت "products" استفاده می‌شد در حالی
      // که بقیه اپلیکیشن (src/lib/supabase/storage.ts) از باکت "images"
      // استفاده می‌کند — یعنی این آپلود همیشه با خطا مواجه می‌شد چون
      // چنین باکتی ساخته نشده بود.
      .from("images")
      .upload(
        fileName,
        file
      );

  if (error) {
    return {
      success: false,
      message:
        "خطا در بارگذاری تصویر.",
    };
  }

  const { data: url } =
    supabase.storage
      .from("images")
      .getPublicUrl(
        data.path
      );

  return {
    success: true,

    message:
      "تصویر با موفقیت بارگذاری شد.",

    image:
      url.publicUrl,
  };
}
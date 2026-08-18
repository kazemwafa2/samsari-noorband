"use client";

import { useState } from "react";
import { LoaderCircle, Upload, Trash2 } from "lucide-react";

import { uploadImage, getImagePublicUrl, deleteImage, getPathFromPublicUrl } from "@/lib/supabase/storage";

interface ImageUploaderProps {
  value?: string;
  onUploaded: (url: string) => void;
  folder?: string;
  bucket?: string;
  allowRemove?: boolean;
}

// قبلا فرم افزودن/ویرایش محصول فقط یک اینپوت متنی برای URL تصویر داشت
// (یعنی عملا آپلود واقعی وجود نداشت). این کامپوننت واقعا فایل را در
// Supabase Storage آپلود می‌کند.

export function ImageUploader({
  value,
  onUploaded,
  folder = "products",
  bucket = "images",
  allowRemove = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const path = `${folder}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await uploadImage(file, path, bucket);

    setUploading(false);

    if (uploadError) {
      setError("آپلود با خطا مواجه شد: " + uploadError.message);
      return;
    }

    onUploaded(getImagePublicUrl(path, bucket));
    e.currentTarget.value = "";
  }

  async function handleRemove() {
    if (!value) return;

    const path = getPathFromPublicUrl(value, bucket);

    // اگر مسیر خام قابل استخراج نبود (مثلا لینک از یک منبع خارجی
    // پیست‌شده)، فقط مقدار را خالی می‌کنیم؛ چیزی برای حذف از Storage
    // وجود ندارد.
    if (!path) {
      onUploaded("");
      return;
    }

    setUploading(true);
    setError("");

    const { error: deleteError } = await deleteImage(path, bucket);

    setUploading(false);

    if (deleteError) {
      setError("حذف با خطا مواجه شد: " + deleteError.message);
      return;
    }

    onUploaded("");
  }

  return (
    <div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="پیش‌نمایش" width={120} height={120} />
      )}

      <label className="primary-btn" style={{ display: "inline-flex", cursor: "pointer" }}>
        {uploading ? <LoaderCircle className="loading" /> : <Upload size={16} />}
        {uploading ? " در حال آپلود..." : " انتخاب تصویر"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          style={{ display: "none" }}
        />
      </label>

      {allowRemove && value && (
        <button
          type="button"
          className="secondary-btn"
          onClick={handleRemove}
          disabled={uploading}
          style={{ display: "inline-flex", marginInlineStart: 8 }}
        >
          <Trash2 size={16} /> حذف عکس
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { LoaderCircle, Upload, Trash2 } from "lucide-react";

import { uploadVideo, getImagePublicUrl, deleteImage, getPathFromPublicUrl } from "@/lib/supabase/storage";

interface VideoUploaderProps {
  value?: string;
  onUploaded: (url: string) => void;
  folder?: string;
}

// دقیقا مطابق درخواست: «اگر از لینک ویدیویی تبلیغات مد نظر نبود بشه
// آپلود کرد» — این کامپوننت فایل ویدیو را مستقیم در Supabase Storage
// (باکت "videos") آپلود می‌کند، دقیقا مثل ImageUploader برای عکس‌ها.
// نکته: باکت "videos" باید یک‌بار در Supabase → Storage به‌صورت Public
// ساخته شود (دقیقا مثل باکت "images").

export function VideoUploader({ value, onUploaded, folder = "promo" }: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const path = `${folder}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await uploadVideo(file, path, "videos");

    setUploading(false);

    if (uploadError) {
      setError("آپلود با خطا مواجه شد: " + uploadError.message);
      return;
    }

    onUploaded(getImagePublicUrl(path, "videos"));
    e.currentTarget.value = "";

    // نکته اصلاح‌شده: قبلا بعد از آپلود موفق (که فقط یعنی فایل روی
    // Storage نوشته شد)، هیچ بررسی نمی‌شد که آیا لینک عمومی واقعا قابل
    // دسترسی است یا نه. اگر باکت «videos» در Supabase روی Public تنظیم
    // نشده باشد، آپلود ظاهرا موفق است ولی لینک نهایی برای هیچکس (حتی
    // خود ادمین) قابل پخش نیست — دقیقا همان «آیکون شکسته» که در پنل
    // دیده می‌شود. این بررسی همان لحظه به ادمین اطلاع می‌دهد، به‌جای
    // اینکه بعدا در صفحه اصلی به‌صورت یک ویدیوی خراب کشف شود.
    const publicUrl = getImagePublicUrl(path, "videos");
    try {
      const check = await fetch(publicUrl, { method: "HEAD" });
      if (!check.ok) {
        setError(
          "فایل آپلود شد ولی لینک آن در دسترس نیست (خطای " + check.status + "). " +
          "احتمالا باکت «videos» در Supabase Storage روی Public تنظیم نشده — " +
          "به Supabase → Storage → videos بروید و گزینه‌ی Public bucket را فعال کنید."
        );
      }
    } catch {
      setError(
        "فایل آپلود شد ولی بررسی دسترسی به لینک آن ممکن نشد. مطمئن شوید باکت «videos» در Supabase Storage ساخته و Public شده باشد."
      );
    }
  }

  async function handleRemove() {
    if (!value) return;

    const path = getPathFromPublicUrl(value, "videos");

    if (!path) {
      onUploaded("");
      return;
    }

    setUploading(true);
    setError("");

    const { error: deleteError } = await deleteImage(path, "videos");

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
        <video src={value} controls style={{ width: "100%", maxWidth: 320, borderRadius: 12 }} />
      )}

      <label className="primary-btn" style={{ display: "inline-flex", cursor: "pointer" }}>
        {uploading ? <LoaderCircle className="loading" /> : <Upload size={16} />}
        {uploading ? " در حال آپلود..." : " انتخاب فایل ویدیو"}
        <input
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFile}
          disabled={uploading}
          style={{ display: "none" }}
        />
      </label>

      {value && (
        <button
          type="button"
          className="secondary-btn"
          onClick={handleRemove}
          disabled={uploading}
          style={{ display: "inline-flex", marginInlineStart: 8 }}
        >
          <Trash2 size={16} /> حذف ویدیو
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

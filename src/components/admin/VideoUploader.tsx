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

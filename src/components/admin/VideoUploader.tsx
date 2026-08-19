"use client";

import { useState } from "react";
import { LoaderCircle, Upload, Trash2 } from "lucide-react";

import { uploadVideo, getImagePublicUrl, deleteImage, getPathFromPublicUrl } from "@/lib/supabase/storage";
import { createClient } from "@/lib/supabase/client";

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
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; text: string } | null>(null);

  // دکمه‌ی تشخیصی: قبل از آپلود یک ویدیوی واقعی (که ممکن است چند
  // مگابایت باشد و چند ثانیه طول بکشد)، با یک فایل خیلی کوچک آزمایشی
  // بلافاصله مشخص می‌کند که آیا باکت «videos» اصلا وجود دارد و Public
  // است یا نه — به‌جای اینکه ادمین هر بار مجبور باشد یک ویدیوی واقعی
  // را کامل آپلود کند تا بفهمد مشکل کجاست.
  async function testBucket() {
    setTesting(true);
    setTestResult(null);

    const supabase = createClient();
    const testPath = `${folder}/__healthcheck__.txt`;
    const testFile = new File(["ok"], "healthcheck.txt", { type: "text/plain" });

    try {
      // نکته: از uploadVideo استفاده نشد چون آن تابع فقط انواع فایل
      // ویدیویی را قبول می‌کند و این فقط یک فایل متنی خیلی کوچک برای
      // آزمایش دسترسی است، نه ویدیوی واقعی
      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(testPath, testFile, { upsert: true });

      if (uploadError) {
        const raw = uploadError.message || "";
        if (raw.toLowerCase().includes("bucket not found")) {
          setTestResult({ ok: false, text: "❌ باکت «videos» اصلا در Supabase Storage ساخته نشده." });
        } else if (raw.includes("Unexpected token") || raw.includes("<!DOCTYPE")) {
          setTestResult({ ok: false, text: "❌ سایت به آدرس Supabase درست وصل نمی‌شود (مشکل تنظیمات دیپلوی، نه باکت)." });
        } else {
          setTestResult({ ok: false, text: "❌ خطا: " + raw });
        }
        setTesting(false);
        return;
      }

      const publicUrl = getImagePublicUrl(testPath, "videos");
      const check = await fetch(publicUrl, { method: "HEAD" }).catch(() => null);

      await deleteImage(testPath, "videos");

      if (!check || !check.ok) {
        setTestResult({ ok: false, text: "⚠️ آپلود کار کرد ولی باکت Public نیست — از Supabase → Storage → videos، گزینه‌ی Public bucket را فعال کنید." });
      } else {
        setTestResult({ ok: true, text: "✅ باکت videos درست کار می‌کند. می‌توانید ویدیوی واقعی را آپلود کنید." });
      }
    } catch (err) {
      setTestResult({ ok: false, text: "❌ خطای غیرمنتظره: " + (err instanceof Error ? err.message : String(err)) });
    } finally {
      setTesting(false);
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const path = `${folder}/${Date.now()}-${file.name}`;

    try {
      const { error: uploadError } = await uploadVideo(file, path, "videos");

      setUploading(false);

      if (uploadError) {
        // نکته اصلاح‌شده: پیام خام «Unexpected token '<', <!DOCTYPE...»
        // یک خطای JSON.parse داخلی کتابخانه Supabase است، نه پیام
        // معنادار برای یک مدیر غیرفنی. این خطا دقیقا یعنی درخواست
        // آپلود به‌جای پاسخ JSON از Supabase، یک صفحه HTML خطا
        // (معمولا صفحه ۴۰۴/۵۰۰ خود دامنه یا یک صفحه خطای Cloudflare)
        // پس گرفته — که معمولا یکی از این دو علت را دارد: (۱) باکت
        // «videos» در Supabase Storage اصلا ساخته نشده، یا (۲) آدرس/کلید
        // Supabase در همین محیط دیپلوی (Cloudflare Workers/Netlify) درست
        // تنظیم نشده. پیام واضح‌تر اینجا نشان داده می‌شود.
        const raw = uploadError.message || "";
        if (raw.includes("Unexpected token") || raw.includes("<!DOCTYPE") || raw.includes("<!doctype")) {
          setError(
            "آپلود با خطای غیرمنتظره مواجه شد — به‌جای پاسخ درست از Supabase، یک صفحه خطای HTML برگشته. " +
            "دو علت رایج: ۱) باکت «videos» در Supabase → Storage هنوز ساخته نشده (باید دقیقا با همین نام، Public). " +
            "۲) در تنظیمات همین دیپلوی (Cloudflare Workers/Netlify)، متغیرهای NEXT_PUBLIC_SUPABASE_URL و " +
            "NEXT_PUBLIC_SUPABASE_ANON_KEY درست تنظیم نشده‌اند."
          );
        } else {
          setError("آپلود با خطا مواجه شد: " + raw);
        }
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
    } catch (err) {
      // دفاعی: قبلا اگر خود فراخوانی uploadVideo یک استثنا واقعی پرتاب
      // می‌کرد (نه یک شیء error برگشتی)، هیچ‌جا catch نمی‌شد — یعنی
      // uploading برای همیشه true می‌ماند و هیچ پیام خطایی هم دیده
      // نمی‌شد.
      setUploading(false);
      setError("آپلود با یک خطای غیرمنتظره مواجه شد: " + (err instanceof Error ? err.message : String(err)));
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

      <button
        type="button"
        className="outline-btn"
        onClick={testBucket}
        disabled={testing || uploading}
        style={{ display: "inline-flex", marginInlineStart: 8 }}
      >
        {testing ? "در حال بررسی..." : "🔍 تست باکت videos (قبل از آپلود واقعی)"}
      </button>

      {testResult && (
        <p style={{ color: testResult.ok ? "#22C55E" : "#EF4444", fontWeight: 700 }}>{testResult.text}</p>
      )}

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

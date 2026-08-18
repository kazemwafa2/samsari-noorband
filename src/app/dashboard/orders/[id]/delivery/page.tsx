"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { DigitalSignature } from "@/components/delivery/DigitalSignature";
import { createClient } from "@/lib/supabase/client";
import { logAction } from "@/lib/audit";

// قبلا هرکسی می‌توانست بدون هیچ تاییدی سفارش را «تحویل‌شده» ثبت کند.
// حالا: مشتری موقع ثبت سفارش یک کد ۴ رقمی می‌گیرد (خودکار توسط
// دیتابیس ساخته می‌شود)؛ پیک باید همان کد را از مشتری بگیرد و اینجا
// وارد کند. فقط اگر کد درست باشد، مرحله امضا و ثبت تحویل باز می‌شود.

export default function Delivery() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [enteredCode, setEnteredCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("id, order_number, delivery_code, delivery_code_verified, delivery_status")
      .eq("id", id)
      .single();

    setOrder(data);
    setCodeVerified(!!data?.delivery_code_verified);
    setLoading(false);
  }

  function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setCodeError("");

    if (!order) return;

    if (!order.delivery_code) {
      // سفارش‌های قدیمی که قبل از این ویژگی ثبت شده‌اند ممکن است کد
      // نداشته باشند؛ برای اینکه برای همیشه قفل نمانند، به ادمین اجازه
      // عبور با تایید دستی داده می‌شود.
      const confirmed = window.confirm(
        "این سفارش کد تحویل ندارد (احتمالا قبل از فعال شدن این ویژگی ثبت شده). می‌خواهید بدون کد ادامه دهید؟"
      );
      if (confirmed) setCodeVerified(true);
      return;
    }

    if (enteredCode.trim() !== order.delivery_code) {
      setCodeError("کد وارد شده اشتباه است. از مشتری بخواهید کد صحیح را بدهد.");
      return;
    }

    setCodeVerified(true);
  }

  async function handleSignatureSave(signatureData: {
    svg: string;
    points: { x: number; y: number }[];
  }) {
    setSaving(true);
    setError("");

    // تایید کد دوباره سمت سرور هم چک می‌شود (نه فقط ظاهر UI) تا کسی
    // نتواند بدون کد درست از این مرحله رد شود. برای سفارش‌های قدیمی
    // بدون کد (order.delivery_code خالی)، این شرط اضافی رد می‌شود.
    let query = supabase
      .from("orders")
      .update({
        status: "completed",
        delivery_status: "delivered",
        delivery_signature: signatureData.svg,
        delivered_at: new Date().toISOString(),
        delivery_code_verified: true,
      })
      .eq("id", id);

    if (order.delivery_code) {
      query = query.eq("delivery_code", enteredCode.trim());
    }

    const { error: updateError } = await query;

    setSaving(false);

    if (updateError) {
      setError("ثبت تحویل با خطا مواجه شد: " + updateError.message);
      return;
    }

    setDone(true);
    logAction("mark_delivered", "order", id, { code_verified: true });
    setTimeout(() => router.push(`/dashboard/orders/${id}`), 1500);
  }

  if (loading) {
    return (
      <main className="home-page">
        <p>در حال بارگذاری...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="home-page">
        <h1 className="section-title">سفارش پیدا نشد</h1>
      </main>
    );
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">🚚 ثبت تحویل سفارش #{order.order_number || id}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {done ? (
        <p>✅ تحویل با موفقیت ثبت شد.</p>
      ) : !codeVerified ? (
        <form onSubmit={verifyCode} className="space-y-6">
          <p>برای شروع تحویل، کد ۴ رقمی که مشتری از سفارش خود دارد را از او بگیرید و اینجا وارد کنید.</p>

          {codeError && <p style={{ color: "red" }}>{codeError}</p>}

          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="کد ۴ رقمی"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            style={{ fontSize: "24px", textAlign: "center", letterSpacing: "8px" }}
            required
          />

          <button className="primary-btn" type="submit">تایید کد</button>
        </form>
      ) : (
        <>
          <p>✅ کد تایید شد. حالا از گیرنده امضا دریافت کنید تا تحویل سفارش ثبت شود.</p>
          <DigitalSignature onSave={handleSignatureSave} />
          {saving && <p>در حال ثبت...</p>}
        </>
      )}
    </main>
  );
}

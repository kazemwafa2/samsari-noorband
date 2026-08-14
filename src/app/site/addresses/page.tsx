"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LocationSelector } from "@/components/location/LocationSelector";
import ProtectedRoute from "@/components/auth/protected-route";

// نسخه قبلی این صفحه selectهای دستی خودش را داشت (کد تکراری با
// LocationSelector که از قبل در پروژه ساخته شده بود ولی هیچ‌جا
// استفاده نمی‌شد). حالا از همان کامپوننت واقعی پروژه استفاده می‌کند.

// این صفحه قبلا هیچ محافظتی نداشت — برخلاف checkout/profile/orders که
// middleware.ts آن‌ها را در privateRoutes گارد می‌کند، /site/addresses
// اصلا در آن لیست نبود؛ یعنی یک کاربر مهمان می‌توانست فرم افزودن آدرس
// را ببیند (فقط submit با خطای بی‌صدا مواجه می‌شد چون user_id نداشت).
// حالا با همان ProtectedRoute واقعی پروژه (که قبلا ساخته شده ولی هیچ‌جا
// استفاده نمی‌شد) به /login هدایت می‌شود.
export default function AddressesPage() {
  return (
    <ProtectedRoute>
      <Addresses />
    </ProtectedRoute>
  );
}

function Addresses() {
  const supabase = createClient();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("خانه");
  const [location, setLocation] = useState<{
    countryId?: string;
    provinceId?: string;
    districtId?: string;
  }>({});
  const [fullAddress, setFullAddress] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error: loadError } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (loadError) console.log("ADDRESSES ERROR:", loadError);
    setAddresses(data || []);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("برای افزودن آدرس ابتدا وارد حساب خود شوید.");
      return;
    }

    if (!fullAddress || !location.provinceId) {
      setError("ولایت/استان و آدرس کامل الزامی است.");
      return;
    }

    setSaving(true);

    const [{ data: province }, { data: district }] = await Promise.all([
      supabase.from("provinces").select("name").eq("id", location.provinceId).single(),
      location.districtId
        ? supabase.from("districts").select("name").eq("id", location.districtId).single()
        : Promise.resolve({ data: null }),
    ]);

    const { data: country } = location.countryId
      ? await supabase.from("countries").select("name").eq("id", location.countryId).single()
      : { data: null };

    const { error: insertError } = await supabase.from("addresses").insert({
      user_id: user.id,
      title,
      country: country?.name || "افغانستان",
      province: province?.name || "",
      city: district?.name || "",
      full_address: fullAddress,
      receiver_name: receiverName,
      receiver_phone: receiverPhone,
    });

    setSaving(false);

    if (insertError) {
      setError("ثبت آدرس با خطا مواجه شد: " + insertError.message);
      return;
    }

    setFullAddress("");
    load();
  }

  async function remove(id: number) {
    if (!window.confirm("این آدرس حذف شود؟")) return;

    const { error: deleteError } = await supabase.from("addresses").delete().eq("id", id);
    if (!deleteError) load();
  }

  async function setDefault(id: number) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    load();
  }

  return (
    <main className="container home-page space-y-6">
      <h1 className="section-title">📍 آدرس‌های من</h1>

      <form onSubmit={handleAdd} className="space-y-6">
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <label>عنوان آدرس</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="خانه، محل کار و ..." />
        </div>

        <LocationSelector
          countryId={location.countryId}
          provinceId={location.provinceId}
          districtId={location.districtId}
          onChange={setLocation}
          showCountry
        />

        <div>
          <label>آدرس کامل</label>
          <textarea value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} required />
        </div>

        <div>
          <label>نام گیرنده</label>
          <input value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />
        </div>

        <div>
          <label>شماره تماس گیرنده</label>
          <input value={receiverPhone} onChange={(e) => setReceiverPhone(e.target.value)} />
        </div>

        <button className="primary-btn" type="submit" disabled={saving}>
          {saving ? "در حال ثبت..." : "افزودن آدرس"}
        </button>
      </form>

      <h2>آدرس‌های ثبت‌شده</h2>

      {loading && <p>در حال بارگذاری...</p>}
      {!loading && addresses.length === 0 && <p>هنوز آدرسی ثبت نشده.</p>}

      {addresses.map((a) => (
        <div key={a.id} className="glass-card">
          <p>{a.title} {a.is_default && "⭐ (پیش‌فرض)"}</p>
          <p>{a.country} - {a.province} - {a.city}</p>
          <p>{a.full_address}</p>
          {a.receiver_name && <p>گیرنده: {a.receiver_name} - {a.receiver_phone}</p>}

          <div className="flex">
            {!a.is_default && <button className="outline-btn" onClick={() => setDefault(a.id)}>تنظیم به‌عنوان پیش‌فرض</button>}
            <button className="danger-btn" onClick={() => remove(a.id)}>حذف</button>
          </div>
        </div>
      ))}
    </main>
  );
}

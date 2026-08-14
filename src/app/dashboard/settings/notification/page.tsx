"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { subscribeToPush } from "@/lib/push-subscribe";

export default function NotificationSetting() {
  const supabase = createClient();
  const [siteEnabled, setSiteEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();

    if (data) {
      setSiteEnabled(data.notify_site_enabled ?? true);
      setEmailEnabled(!!data.notify_email_enabled);
      setPushEnabled(!!data.notify_push_enabled);
    }

    setLoading(false);
  }

  async function save() {
    setSaving(true);

    const { error } = await supabase.from("site_settings").upsert({
      id: 1,
      notify_site_enabled: siteEnabled,
      notify_email_enabled: emailEnabled,
      notify_push_enabled: pushEnabled,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (error) alert("ذخیره با خطا مواجه شد: " + error.message);
    else alert("تنظیمات ذخیره شد.");
  }

  if (loading) return <main className="home-page"><p>در حال بارگذاری...</p></main>;

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">🔔 تنظیمات اعلان‌ها</h1>

      <div className="flex">
        <label>
          <input type="checkbox" checked={siteEnabled} onChange={(e) => setSiteEnabled(e.target.checked)} />
          اعلان داخل سایت
        </label>
      </div>

      <div className="flex">
        <label>
          <input type="checkbox" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} />
          اعلان ایمیلی (نیاز به تنظیم سرویس ارسال ایمیل دارد)
        </label>
      </div>

      <div className="flex">
        <label>
          <input type="checkbox" checked={pushEnabled} onChange={(e) => setPushEnabled(e.target.checked)} />
          Push Notification (نیاز به تنظیم سرویس Push دارد)
        </label>
      </div>

      <button
        type="button"
        onClick={async () => {
          try {
            await subscribeToPush();
            alert("اعلان Push برای این دستگاه فعال شد.");
          } catch (err: any) {
            alert(err.message);
          }
        }}
      >
        فعال‌سازی Push روی این دستگاه (تست)
      </button>

      <button className="primary-btn" onClick={save} disabled={saving}>
        {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </button>
    </main>
  );
}

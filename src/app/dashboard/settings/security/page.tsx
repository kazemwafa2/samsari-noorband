"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Security() {
  const supabase = createClient();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("رمزهای عبور یکسان نیستند.");
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setSaving(false);

    if (updateError) {
      setError("تغییر رمز با خطا مواجه شد: " + updateError.message);
      return;
    }

    setMessage("رمز عبور با موفقیت تغییر کرد.");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">🔐 تنظیمات امنیتی</h1>

      <form onSubmit={handleChangePassword} className="space-y-6">
        <h2>تغییر رمز عبور</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <div>
          <label>رمز عبور جدید</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>تکرار رمز عبور جدید</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button className="primary-btn" type="submit" disabled={saving}>
          {saving ? "در حال ذخیره..." : "تغییر رمز عبور"}
        </button>
      </form>

      <div className="glass-card">
        <p>
          توصیه امنیتی: در Supabase Dashboard خودت زیر بخش Authentication →
          Policies، حتما Row Level Security (RLS) را برای جدول‌های حساس
          (orders, profiles, payment) فعال و محدود کن، چون این پروژه فعلا
          فاقد فایل migration برای RLS است.
        </p>
      </div>
    </main>
  );
}

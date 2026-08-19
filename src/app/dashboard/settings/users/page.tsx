"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { logAction } from "@/lib/audit";
import { ROLES } from "@/lib/auth/roles";

export default function UsersSetting() {
  const supabase = createClient();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailToPromote, setEmailToPromote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .in("role", [ROLES.ADMIN, ROLES.SUPER_ADMIN]);

    setAdmins(data || []);
    setLoading(false);
  }

  async function promote(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!emailToPromote) return;

    setSaving(true);

    const { data: profile, error: findError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", emailToPromote)
      .single();

    if (findError || !profile) {
      setSaving(false);
      setError("کاربری با این ایمیل پیدا نشد.");
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: ROLES.ADMIN })
      .eq("id", profile.id);

    setSaving(false);

    if (updateError) {
      setError("ارتقا کاربر با خطا مواجه شد: " + updateError.message);
      return;
    }

    setEmailToPromote("");
    logAction("promote_to_admin", "profile", profile.id);
    load();
  }

  async function demote(id: string) {
    if (!window.confirm("دسترسی مدیریت این کاربر لغو شود؟")) return;

    const { error } = await supabase
      .from("profiles")
      .update({ role: ROLES.CUSTOMER })
      .eq("id", id);

    if (!error) {
      logAction("demote_admin", "profile", id);
      load();
    }
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">👥 دسترسی کاربران</h1>

      <p style={{ color: "#6B7280" }}>
        این صفحه فقط برای ارتقا/لغو سریع نقش «ادمین» است. برای تغییر نقش به فروشنده، مأمور تحویل یا سایر نقش‌ها،
        از <Link href="/dashboard/users" style={{ textDecoration: "underline" }}>لیست کامل کاربران</Link> استفاده کنید.
      </p>

      <form onSubmit={promote} className="flex">
        <input
          type="email"
          placeholder="ایمیل کاربری که می‌خواهی ادمین کنی"
          value={emailToPromote}
          onChange={(e) => setEmailToPromote(e.target.value)}
        />
        <button className="primary-btn" type="submit" disabled={saving}>
          ارتقا به ادمین
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>مدیران فعلی</h2>

      {loading && <p>در حال بارگذاری...</p>}
      {!loading && admins.length === 0 && <p>مدیری ثبت نشده است.</p>}

      {!loading && admins.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>نام</th>
              <th>ایمیل</th>
              <th>نقش</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>{a.role}</td>
                <td>
                  {a.role !== ROLES.SUPER_ADMIN && (
                    <button className="danger-btn" onClick={() => demote(a.id)}>لغو دسترسی مدیریت</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

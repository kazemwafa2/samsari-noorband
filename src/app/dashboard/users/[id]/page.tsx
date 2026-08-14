"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { ROLES } from "@/lib/auth/roles";
import type { User } from "@/types/user";

export default function UserDetail() {
  const supabase = createClient();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) loadUser();
  }, [id]);

  async function loadUser() {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      setUser(null);
    } else {
      setUser(data);
    }

    setLoading(false);
  }

  async function updateRole(newRole: string) {
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert("تغییر نقش با خطا مواجه شد.");
      return;
    }

    setUser((prev) => (prev ? { ...prev, role: newRole as User["role"] } : prev));
  }

  async function toggleActive(active: boolean) {
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ is_active: active })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert("تغییر وضعیت حساب با خطا مواجه شد.");
    }
  }

  if (loading) {
    return (
      <main className="home-page">
        <p>در حال بارگذاری...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="home-page">
        <h1 className="section-title">کاربر پیدا نشد</h1>
      </main>
    );
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">👤 {user.name}</h1>

      <div className="glass-card">
        <p>ایمیل: {user.email}</p>
        <p>تلفن: {user.phone || "—"}</p>
        <p>تاریخ عضویت: {new Date(user.created_at).toLocaleDateString("fa-IR")}</p>

        <div>
          <label>نقش کاربر: </label>
          <select
            value={user.role}
            disabled={saving}
            onChange={(e) => updateRole(e.target.value)}
          >
            {Object.values(ROLES).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            className="primary-btn"
            disabled={saving}
            onClick={() => toggleActive(false)}
          >
            مسدود کردن کاربر
          </button>
        </div>
      </div>
    </main>
  );
}

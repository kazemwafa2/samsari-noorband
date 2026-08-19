"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { ROLES } from "@/lib/auth/roles";
import type { User } from "@/types/user";

// برچسب فارسی هر نقش، برای اینکه در dropdown به‌جای رشته‌ی خام انگلیسی
// (admin, super_admin, seller, courier...) چیزی قابل‌فهم دیده شود
const ROLE_LABELS: Record<string, string> = {
  [ROLES.SUPER_ADMIN]: "سوپر ادمین",
  [ROLES.ADMIN]: "ادمین",
  [ROLES.SELLER]: "فروشنده",
  [ROLES.COURIER]: "مأمور تحویل",
  [ROLES.VIP]: "مشتری VIP",
  [ROLES.PREMIUM]: "مشتری ویژه",
  [ROLES.CUSTOMER]: "مشتری عادی",
};

export default function UserDetail() {
  const supabase = createClient();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  // نکته اصلاح‌شده: قبلا نقش انتخاب‌شده در <select> بلافاصله با
  // onChange ذخیره می‌شد — بدون هیچ بازخوردی (نه پیام موفقیت، نه
  // دکمه‌ی تاییدی که کاربر مطمئن شود کاری انجام شده). این باعث می‌شد
  // به نظر برسد «تایید ندارد» و انگار هیچ اتفاقی نمی‌افتد. حالا نقش
  // انتخاب‌شده جدا از نقش ذخیره‌شده نگه داشته می‌شود و فقط با کلیک
  // صریح روی «ذخیره نقش» واقعا اعمال می‌شود، همراه با پیام موفقیت/خطا.
  const [selectedRole, setSelectedRole] = useState<string>("");
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
      setSelectedRole(data.role);
    }

    setLoading(false);
  }

  const roleChanged = user && selectedRole !== user.role;

  async function saveRole() {
    if (!user || !roleChanged) return;

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ role: selectedRole })
      .eq("id", id);

    setSaving(false);

    if (error) {
      toast.error("تغییر نقش با خطا مواجه شد: " + error.message);
      return;
    }

    toast.success(`نقش کاربر با موفقیت به «${ROLE_LABELS[selectedRole] || selectedRole}» تغییر کرد.`);
    setUser((prev) => (prev ? { ...prev, role: selectedRole as User["role"] } : prev));
  }

  async function toggleActive(active: boolean) {
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ is_active: active })
      .eq("id", id);

    setSaving(false);

    if (error) {
      toast.error("تغییر وضعیت حساب با خطا مواجه شد: " + error.message);
      return;
    }

    toast.success(active ? "حساب کاربر فعال شد." : "حساب کاربر مسدود شد.");
    setUser((prev) => (prev ? { ...prev, is_active: active } : prev));
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

      <div className="glass-card space-y-3">
        <p>ایمیل: {user.email}</p>
        <p>تلفن: {user.phone || "—"}</p>
        <p>تاریخ عضویت: {new Date(user.created_at).toLocaleDateString("fa-IR")}</p>

        <div>
          <label>نقش کاربر: </label>
          <select
            value={selectedRole}
            disabled={saving}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {Object.values(ROLES).map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role] || role}
              </option>
            ))}
          </select>

          {roleChanged && (
            <button className="primary-btn" disabled={saving} onClick={saveRole} style={{ marginInlineStart: 10 }}>
              {saving ? "در حال ذخیره..." : "✅ ذخیره نقش جدید"}
            </button>
          )}
        </div>

        <p>
          وضعیت حساب:{" "}
          <strong style={{ color: user.is_active === false ? "#EF4444" : "#22C55E" }}>
            {user.is_active === false ? "مسدود" : "فعال"}
          </strong>
        </p>

        <div>
          {user.is_active === false ? (
            <button
              className="primary-btn"
              disabled={saving}
              onClick={() => toggleActive(true)}
            >
              فعال‌سازی کاربر
            </button>
          ) : (
            <button
              className="primary-btn"
              disabled={saving}
              onClick={() => toggleActive(false)}
            >
              مسدود کردن کاربر
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

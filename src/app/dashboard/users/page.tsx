"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types/user";

export default function Users() {
  const supabase = createClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [myRole, setMyRole] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setErrorMsg("");

    // نکته: برای اینکه اگر لیست باز هم خالی آمد بدانید علتش چیست،
    // نقش خودِ حساب فعلی هم جداگانه خوانده می‌شود (این کوئری همیشه کار
    // می‌کند، چون هرکس اجازه خواندن ردیف خودش را دارد). اگر اینجا چیزی
    // غیر از admin/super_admin نشان داد، یعنی مشکل از خود نقش حساب
    // شماست، نه از کد این صفحه.
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user) {
      const { data: myProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .maybeSingle();
      setMyRole(myProfile?.role || null);
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("DASHBOARD USERS ERROR:", error);
      // نکته اصلاح‌شده: قبلا خطای واقعی فقط در کنسول مرورگر (که یک
      // مدیر عادی هیچ‌وقت باز نمی‌کند) چاپ می‌شد و لیست فقط بی‌صدا خالی
      // نشان داده می‌شد — یعنی هیچ سرنخی از علت واقعی («لیست نمیاد»)
      // در دسترس نبود. حالا متن خطای واقعی روی خود صفحه نمایش داده
      // می‌شود.
      setErrorMsg(error.message);
    }

    setUsers(data || []);
    setLoading(false);
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">👥 مدیریت کاربران</h1>

      {loading && <p>در حال بارگذاری...</p>}

      {!loading && errorMsg && (
        <p style={{ color: "#EF4444" }}>
          خطا در دریافت لیست کاربران: {errorMsg}
        </p>
      )}

      {!loading && !errorMsg && users.length === 0 && (
        <div style={{ color: "#EF4444" }}>
          <p>هیچ کاربری برگشت داده نشد.</p>
          <p>
            نقش ثبت‌شده‌ی حساب فعلی شما: <strong>{myRole || "نامشخص"}</strong>
          </p>
          {myRole !== "admin" && myRole !== "super_admin" && (
            <p>
              چون نقش حساب شما «{myRole || "نامشخص"}» است، نه admin/super_admin، طبق تنظیمات دسترسی دیتابیس
              فقط پروفایل خودتان قابل مشاهده است، نه لیست کل کاربران. اگر این حساب باید ادمین باشد، نقش آن را
              در جدول profiles (ستون role) در Supabase به admin یا super_admin تغییر دهید.
            </p>
          )}
          {(myRole === "admin" || myRole === "super_admin") && (
            <p>
              نقش حساب شما درست است؛ اگر باز هم لیست خالی می‌آید، احتمالاً فایل db/schema.sql به‌روزشده هنوز
              روی دیتابیس Supabase اجرا نشده — آن را از SQL Editor اجرا کنید.
            </p>
          )}
        </div>
      )}

      {!loading && users.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>نام</th>
              <th>ایمیل</th>
              <th>نقش</th>
              <th>تاریخ عضویت</th>
              <th>عملیات</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("fa-IR")
                    : "—"}
                </td>
                <td>
                  <Link href={`/dashboard/users/${user.id}`}>مشاهده</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

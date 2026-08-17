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

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setErrorMsg("");

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

      {!loading && !errorMsg && users.length === 0 && <p>کاربری یافت نشد.</p>}

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

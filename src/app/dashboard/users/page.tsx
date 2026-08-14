"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types/user";

export default function Users() {
  const supabase = createClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("DASHBOARD USERS ERROR:", error);
    }

    setUsers(data || []);
    setLoading(false);
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">👥 مدیریت کاربران</h1>

      {loading && <p>در حال بارگذاری...</p>}

      {!loading && users.length === 0 && <p>کاربری یافت نشد.</p>}

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

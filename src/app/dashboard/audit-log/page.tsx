"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuditLogPage() {
  const supabase = createClient();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("audit_log")
      .select("*, profiles(name, email)")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) console.log("AUDIT LOG ERROR:", error);
    setLogs(data || []);
    setLoading(false);
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">🕵️ گزارش فعالیت مدیران (Audit Log)</h1>

      {loading && <p>در حال بارگذاری...</p>}
      {!loading && logs.length === 0 && <p>هنوز فعالیتی ثبت نشده.</p>}

      {!loading && logs.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>کاربر</th>
              <th>اکشن</th>
              <th>روی</th>
              <th>جزئیات</th>
              <th>زمان</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.profiles?.name || log.profiles?.email || "—"}</td>
                <td>{log.action}</td>
                <td>{log.entity} #{log.entity_id}</td>
                <td>{log.details ? JSON.stringify(log.details) : "—"}</td>
                <td>{new Date(log.created_at).toLocaleString("fa-IR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

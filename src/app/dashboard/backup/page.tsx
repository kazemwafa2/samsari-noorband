"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BACKUP_TABLES = [
  "products",
  "categories",
  "brands",
  "discounts",
  "site_settings",
];

// این صفحه یک بک‌آپ ساده (Export/Import JSON) از جدول‌های اصلی است.
// برای بک‌آپ کامل و خودکار دیتابیس بهتر است از قابلیت Backup خود
// Supabase (Point-in-time Recovery در پلن‌های پولی) هم استفاده کنی؛
// این صفحه مکمل آن برای بک‌آپ سریع محتوای فروشگاه است.

export default function Backup() {
  const supabase = createClient();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  async function handleExport() {
    setExporting(true);
    setLog([]);

    const backup: Record<string, any> = {};

    for (const table of BACKUP_TABLES) {
      const { data, error } = await supabase.from(table).select("*");

      if (error) {
        setLog((prev) => [...prev, `❌ ${table}: ${error.message}`]);
        continue;
      }

      backup[table] = data;
      setLog((prev) => [...prev, `✅ ${table}: ${data?.length || 0} ردیف`]);
    }

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `noorband-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setExporting(false);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      "وارد کردن بک‌آپ، داده‌های فعلی جدول‌های مشابه را با upsert جایگزین می‌کند. مطمئنی؟"
    );
    if (!confirmed) return;

    setImporting(true);
    setLog([]);

    const text = await file.text();
    const backup = JSON.parse(text);

    for (const table of Object.keys(backup)) {
      if (!BACKUP_TABLES.includes(table)) continue;

      const rows = backup[table];
      if (!Array.isArray(rows) || rows.length === 0) continue;

      const { error } = await supabase.from(table).upsert(rows);

      if (error) {
        setLog((prev) => [...prev, `❌ ${table}: ${error.message}`]);
      } else {
        setLog((prev) => [...prev, `✅ ${table}: ${rows.length} ردیف بازیابی شد`]);
      }
    }

    setImporting(false);
    e.currentTarget.value = "";
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">💾 بک‌آپ و بازیابی</h1>

      <p>جدول‌های شامل این بک‌آپ: {BACKUP_TABLES.join("، ")}</p>

      <button className="primary-btn" onClick={handleExport} disabled={exporting}>
        {exporting ? "در حال ساخت بک‌آپ..." : "📥 دانلود بک‌آپ (JSON)"}
      </button>

      <div>
        <label className="primary-btn" style={{ display: "inline-block", cursor: "pointer" }}>
          {importing ? "در حال بازیابی..." : "📤 بازیابی از فایل بک‌آپ"}
          <input type="file" accept="application/json" onChange={handleImport} disabled={importing} style={{ display: "none" }} />
        </label>
      </div>

      {log.length > 0 && (
        <div className="glass-card">
          {log.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </main>
  );
}

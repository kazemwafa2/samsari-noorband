"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { logAction } from "@/lib/audit";

// توجه: ستون‌های return_reason و returned_at باید در جدول orders موجود
// باشند (یا اضافه شوند). اگر اسم دیگری در دیتابیس واقعی‌ات داری، عوضش کن.

export default function ReturnOrder() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!reason.trim()) {
      setError("لطفا دلیل مرجوعی را وارد کنید.");
      return;
    }

    setSaving(true);
    setError("");

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "returned",
        delivery_status: "returned",
        return_reason: reason,
        returned_at: new Date().toISOString(),
      })
      .eq("id", id);

    setSaving(false);

    if (updateError) {
      setError("ثبت مرجوعی با خطا مواجه شد: " + updateError.message);
      return;
    }

    logAction("mark_returned", "order", id, { reason });
    router.push(`/dashboard/orders/${id}`);
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">↩️ ثبت مرجوعی سفارش #{id}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label>دلیل مرجوعی</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="مثلا: کالای معیوب، عدم مطابقت با توضیحات و ..."
            required
          />
        </div>

        <button className="primary-btn" type="submit" disabled={saving}>
          {saving ? "در حال ثبت..." : "ثبت مرجوعی"}
        </button>
      </form>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Reservations() {
  const supabase = createClient();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("reservations")
      .select("*, products(title, price, image)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) console.log("RESERVATIONS ERROR:", error);
    setReservations(data || []);
    setLoading(false);
  }

  async function cancelReservation(id: number) {
    const { error } = await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (!error) load();
  }

  return (
    <main className="container home-page space-y-6">
      <h1 className="section-title">📌 رزروهای من</h1>

      {loading && <p>در حال بارگذاری...</p>}
      {!loading && reservations.length === 0 && <p>هنوز کالایی رزرو نکرده‌اید.</p>}

      <div className="product-grid">
        {reservations.map((r) => (
          <div key={r.id} className="product-card">
            <Link href={`/products/${r.product_id}`}>
              <h3>{r.products?.title}</h3>
            </Link>
            <p>وضعیت: {r.status}</p>
            <p>رزرو تا: {new Date(r.reserved_until).toLocaleDateString("fa-IR")}</p>

            {r.status === "active" && (
              <button className="danger-btn" onClick={() => cancelReservation(r.id)}>لغو رزرو</button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

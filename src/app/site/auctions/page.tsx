"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { useCurrency } from "@/lib/currency";

export default function Auctions() {
  const supabase = createClient();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { format } = useCurrency();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("auctions")
      .select("*, products(title, image)")
      .eq("status", "open")
      .order("ends_at", { ascending: true });

    if (error) console.log("AUCTIONS ERROR:", error);
    setAuctions(data || []);
    setLoading(false);
  }

  return (
    <main className="container home-page space-y-6">
      <h1 className="section-title">{t("auctionsPageTitle", language)}</h1>

      {loading && <p>{t("loadingText", language)}</p>}
      {!loading && auctions.length === 0 && <p>{t("noActiveAuctionsText", language)}</p>}

      <div className="product-grid">
        {auctions.map((a) => (
          <Link key={a.id} href={`/site/auctions/${a.id}`} className="product-card">
            <h3>{a.products?.title}</h3>
            <p>{t("currentPriceLabel", language)}: {format(Number(a.current_price))}</p>
            <p>{t("auctionEndsLabel", language)}: {new Date(a.ends_at).toLocaleDateString(language === "en" ? "en-US" : "fa-AF")}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

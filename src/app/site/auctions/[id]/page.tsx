"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { useCurrency } from "@/lib/currency";

export default function AuctionDetail() {
  const supabase = createClient();
  const params = useParams();
  const id = params.id as string;
  const { language } = useLanguage();
  const { format } = useCurrency();

  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) load();

    // بروزرسانی هر ۱۰ ثانیه تا وضعیت جدید پیشنهادها دیده شود
    // (بدیل ساده به‌جای Supabase Realtime که نیاز به تنظیم جداگانه دارد)
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [id]);

  async function load() {
    const { data: auctionData } = await supabase
      .from("auctions")
      .select("*, products(title, image, description)")
      .eq("id", id)
      .single();

    setAuction(auctionData);

    const { data: bidsData } = await supabase
      .from("auction_bids")
      .select("*, profiles(name)")
      .eq("auction_id", id)
      .order("amount", { ascending: false })
      .limit(10);

    setBids(bidsData || []);
    setLoading(false);
  }

  async function placeBid(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(t("loginToBidError", language));
      return;
    }

    const amount = Number(bidAmount);
    const minAllowed = Number(auction.current_price) + Number(auction.min_increment);

    if (amount < minAllowed) {
      setError(t("bidMinAmountError", language).replace("{amount}", format(minAllowed)));
      return;
    }

    setPlacing(true);

    // به‌روزرسانی شرطی: فقط اگر قیمت فعلی هنوز همان چیزی است که کاربر
    // دیده، اجازه بده. این از دو پیشنهاد هم‌زمان با overwrite شدن جلوگیری
    // می‌کند (هنوز جایگزین کامل یک تابع دیتابیسی با قفل ردیف نیست، ولی
    // خطر رایج‌ترین حالت race condition را کم می‌کند).
    const { data: updatedAuction, error: raceError } = await supabase
      .from("auctions")
      .update({ current_price: amount })
      .eq("id", id)
      .eq("current_price", auction.current_price)
      .select()
      .single();

    setPlacing(false);

    if (raceError || !updatedAuction) {
      setError(t("bidRaceConditionError", language));
      load();
      return;
    }

    const { error: bidError } = await supabase.from("auction_bids").insert({
      auction_id: Number(id),
      user_id: user.id,
      amount,
    });

    if (bidError) {
      setError(t("bidSubmitErrorPrefix", language).replace("{error}", bidError.message));
      return;
    }

    setBidAmount("");
    load();
  }

  if (loading) return <main className="home-page"><p>{t("loadingText", language)}</p></main>;
  if (!auction) return <main className="home-page"><h1 className="section-title">{t("auctionNotFoundTitle", language)}</h1></main>;

  const localeStr = language === "en" ? "en-US" : "fa-AF";

  return (
    <main className="container home-page space-y-6">
      <h1 className="section-title">🔨 {auction.products?.title}</h1>

      <div className="glass-card">
        <p>{t("startPriceLabel", language)}: {format(Number(auction.start_price))}</p>
        <p>{t("currentPriceLabel", language)}: <strong>{format(Number(auction.current_price))}</strong></p>
        <p>{t("minIncrementLabel", language)}: {format(Number(auction.min_increment))}</p>
        <p>{t("auctionEndLabel", language)}: {new Date(auction.ends_at).toLocaleString(localeStr)}</p>
      </div>

      {auction.status === "open" ? (
        <form onSubmit={placeBid} className="flex">
          <input
            type="number"
            placeholder={t("bidAmountPlaceholder", language)}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
          />
          <button className="primary-btn" type="submit" disabled={placing}>
            {placing ? t("submittingBidText", language) : t("submitBidButton", language)}
          </button>
        </form>
      ) : (
        <p>{t("auctionClosedText", language)}</p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>{t("recentBidsTitle", language)}</h2>

      {bids.length === 0 && <p>{t("noBidsYetText", language)}</p>}

      {bids.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t("userColumnLabel", language)}</th>
              <th>{t("amountLabel", language)}</th>
              <th>{t("timeColumnLabel", language)}</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((b) => (
              <tr key={b.id}>
                <td>{b.profiles?.name || t("userColumnLabel", language)}</td>
                <td>{format(Number(b.amount))}</td>
                <td>{new Date(b.created_at).toLocaleTimeString(localeStr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

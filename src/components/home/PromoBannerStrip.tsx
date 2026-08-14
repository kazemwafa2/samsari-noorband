"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image: string | null;
  link_url: string | null;
  button_label: string | null;
}

// این کامپوننت قبلا اصلا وجود نداشت — بنرهای «بین محصولات» و «پایین
// صفحه» در چک‌لیست خواسته شده بودند ولی هیچ‌جای کد چنین چیزی نبود. اگر
// ادمین از /dashboard/banners چیزی برای این zone نساخته باشد، این
// کامپوننت هیچی رندر نمی‌کند (نه یک باکس خالی جا‌گیر).
//
// چیدمان دوباره طراحی شد تا دقیقا مثل طرح مرجع باشد: دو بنر بزرگ کنار
// هم، هرکدام با عکس پس‌زمینه‌ی تمام‌قد و متن روی آن — نه یک ردیف
// عمودی از کارت‌های کوچک با تامبنیل.
export default function PromoBannerStrip({ zone }: { zone: "middle" | "footer" | "product" }) {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("banners")
      .select("id, title, subtitle, image, link_url, button_label")
      .eq("zone", zone)
      .order("sort_order")
      .then(({ data }) => setBanners(data || []));
  }, [zone]);

  if (banners.length === 0) return null;

  return (
    <div className="promo-banner-strip">
      {banners.map((banner) => {
        const content = (
          <>
            {banner.image && (
              <span className="promo-banner-media">
                <Image src={banner.image} alt={banner.title} fill sizes="(max-width: 700px) 100vw, 50vw" />
              </span>
            )}

            <div className="promo-banner-body">
              <h3>{banner.title}</h3>
              {banner.subtitle && <p>{banner.subtitle}</p>}
              {banner.button_label && <span className="primary-btn">{banner.button_label}</span>}
            </div>
          </>
        );

        return banner.link_url ? (
          <Link key={banner.id} href={banner.link_url} className="promo-banner-card">
            {content}
          </Link>
        ) : (
          <div key={banner.id} className="promo-banner-card">
            {content}
          </div>
        );
      })}
    </div>
  );
}

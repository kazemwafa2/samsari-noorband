"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode";

import { createClient } from "@/lib/supabase/client";

// این صفحه برچسب چاپی کالا (بارکد واقعی با jsbarcode + QR) را می‌سازد.
// از دکمه مرورگر (Ctrl+P / دکمه چاپ) برای چاپ روی چاپگر برچسب استفاده کن.

export default function ProductLabel() {
  const supabase = createClient();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (id) load();
  }, [id]);

  useEffect(() => {
    if (product) drawBarcode();
  }, [product]);

  async function load() {
    const { data } = await supabase.from("products").select("*").eq("id", id).single();
    setProduct(data);

    if (data) {
      const qr = await QRCode.toDataURL(`NOORBAND-PRODUCT:${data.sku || data.id}`, { width: 100 });
      setQrDataUrl(qr);
    }
  }

  async function drawBarcode() {
    if (!barcodeRef.current || !product) return;

    const JsBarcode = (await import("jsbarcode")).default;

    JsBarcode(barcodeRef.current, product.sku || String(product.id), {
      format: "CODE128",
      width: 2,
      height: 50,
      displayValue: true,
    });
  }

  if (!product) return <main className="home-page"><p>در حال بارگذاری...</p></main>;

  return (
    <main className="home-page space-y-6">
      <style>{`
        @media print {
          nav, header, .admin-panel > *:not(.print-label) { display: none !important; }
        }
      `}</style>

      <h1 className="section-title">🏷 برچسب کالا: {product.title}</h1>

      <div className="glass-card print-label" style={{ width: 260, textAlign: "center" }}>
        <p>{product.title}</p>
        <svg ref={barcodeRef}></svg>
        {qrDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrDataUrl} alt="QR" width={80} height={80} />
        )}
        <p>{Number(product.price).toLocaleString("fa-AF")} افغانی</p>
      </div>

      <button className="primary-btn" onClick={() => window.print()}>
        🖨 چاپ برچسب
      </button>
    </main>
  );
}

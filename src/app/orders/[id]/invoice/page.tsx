"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode";

import { createClient } from "@/lib/supabase/client";
import { formatJalali } from "@/lib/jalali";
import { SITE_CONFIG } from "@/constants/site";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { useCurrency } from "@/lib/currency";

// این صفحه فاکتور را نمایش می‌دهد و با کلیک روی دکمه، یک PDF واقعی
// (با jsPDF) به‌همراه QR Code (که شماره سفارش را رمزگذاری می‌کند) می‌سازد.
// برای فعال شدن باید یک‌بار `npm install` بزنی تا jspdf و qrcode نصب شوند.

export default function Invoice() {
  const supabase = createClient();
  const params = useParams();
  const id = params.id as string;
  const { language } = useLanguage();
  const { format } = useCurrency();

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    setLoading(true);

    const { data: orderData } = await supabase.from("orders").select("*").eq("id", id).single();
    const { data: itemsData } = await supabase.from("order_items").select("*").eq("order_id", id);

    setOrder(orderData);
    setItems(itemsData || []);

    if (orderData) {
      const qr = await QRCode.toDataURL(
        `NOORBAND Jaghori-ORDER:${orderData.order_number || orderData.id}`,
        { width: 150 }
      );
      setQrDataUrl(qr);
    }

    setLoading(false);
  }

  async function downloadPdf() {
    if (!order) return;

    setGenerating(true);

    // jsPDF فقط سمت کلاینت import می‌شود تا در build سمت سرور مشکلی ایجاد نکند
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`${SITE_CONFIG.name} - Invoice`, 14, 20);

    doc.setFontSize(11);
    doc.text(`Order: ${order.order_number || order.id}`, 14, 32);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString("en-US")}`, 14, 39);
    doc.text(`Status: ${order.status}`, 14, 46);

    let y = 60;
    doc.text("Items:", 14, y);
    y += 8;

    items.forEach((item) => {
      doc.text(
        `${item.product_name}  x${item.quantity}  -  ${item.total_price}`,
        14,
        y
      );
      y += 7;
    });

    y += 6;
    doc.setFontSize(13);
    doc.text(`Total: ${order.total_amount}`, 14, y);

    if (qrDataUrl) {
      doc.addImage(qrDataUrl, "PNG", 150, 20, 40, 40);
    }

    doc.save(`invoice-${order.order_number || order.id}.pdf`);

    setGenerating(false);
  }

  if (loading) return <main className="home-page"><p>{t("loadingText", language)}</p></main>;
  if (!order) return <main className="home-page"><h1 className="section-title">{t("orderNotFoundTitle", language)}</h1></main>;

  const orderNumber = String(order.order_number || order.id);

  return (
    <main className="container home-page space-y-6">
      {/* استایل چاپ حرارتی: فقط بخش .thermal-receipt چاپ می‌شود، در
          عرض ۸۰ میلی‌متر (اندازه رایج پرینتر حرارتی فروشگاهی) */}
      <style>{`
        .thermal-receipt { display: none; }
        @media print {
          body.print-thermal * { visibility: hidden; }
          body.print-thermal .thermal-receipt, body.print-thermal .thermal-receipt * { visibility: visible; }
          body.print-thermal .thermal-receipt {
            display: block;
            position: fixed; top: 0; left: 0; width: 80mm; font-size: 12px;
          }
        }
      `}</style>

      <h1 className="section-title">{t("invoiceHeaderTitle", language).replace("{orderNumber}", orderNumber)}</h1>

      {/* چیدمان فاکتور — چک‌لیست بخش ۶: قبلا هر بخش یک .glass-card جدا
          و زیر هم بود (لوگو، تاریخ، QR، مشتری، جدول همه جدا)؛ الان
          دقیقا مثل طرح مرجع یک کارت رسید یکپارچه با ردیف بالا
          (لوگو+شماره فاکتور)، ردیف اطلاعات مشتری کنار QR، جدول اقلام و
          ردیف مجموع پررنگ در پایین است. */}
      <div className="invoice-card">
        <div className="invoice-head">
          <div>
            <h2>{SITE_CONFIG.name}</h2>
            <p style={{ opacity: .7, fontSize: 13 }}>{SITE_CONFIG.address}</p>
            <p style={{ opacity: .7, fontSize: 13 }}>{SITE_CONFIG.phones.join(" - ")}</p>
          </div>

          <div className="invoice-head-meta">
            <p>{t("invoiceLabel", language)}</p>
            <strong>#{orderNumber}</strong>
            <p>{t("invoiceDateLabel", language)}: {formatJalali(new Date(order.created_at))}</p>
          </div>
        </div>

        <div className="invoice-customer-row">
          <div>
            <h3>{t("customerDetailsTitle", language)}</h3>
            <p>{t("invoiceNameLabel", language)}: {order.shipping_name || "—"}</p>
            <p>{t("invoicePhoneLabel", language)}: {order.shipping_phone || order.phone || "—"}</p>
            <p>
              {t("invoiceAddressLabel", language)}: {[order.province, order.district, order.shipping_address || order.address]
                .filter(Boolean)
                .join("، ") || "—"}
            </p>
            <p>{t("invoiceStatusLabel", language)}: {order.status}</p>
            {order.delivery_code && !order.delivery_code_verified && (
              <p>{t("deliveryCodeLabel", language)}: <strong>{order.delivery_code}</strong></p>
            )}
          </div>

          {qrDataUrl && (
            <div className="invoice-qr-box">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="QR Code" width={110} height={110} />
              <span>{t("scanQrLabel", language)}</span>
            </div>
          )}
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>{t("productColumnLabel", language)}</th>
              <th>{t("quantityLabel", language)}</th>
              <th>{t("unitPriceColumnLabel", language)}</th>
              <th>{t("totalColumnLabel", language)}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>{format(Number(item.final_price))}</td>
                <td>{format(Number(item.total_price))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-total-row">
          <span>{t("invoiceTotalLabel", language)}</span>
          <strong>{format(Number(order.total_amount))}</strong>
        </div>

        <p className="invoice-thanks">{t("invoiceThanksMessage", language)}</p>
      </div>

      <div className="flex" style={{ gap: 12 }}>
        <button className="primary-btn" onClick={downloadPdf} disabled={generating}>
          {generating ? t("generatingPdfText", language) : t("downloadPdfButton", language)}
        </button>

        <button
          className="primary-btn"
          onClick={() => {
            document.body.classList.add("print-thermal");
            window.print();
            document.body.classList.remove("print-thermal");
          }}
        >
          {t("thermalPrintButton", language)}
        </button>
      </div>

      {/* نسخه فشرده مخصوص چاپگر حرارتی، فقط هنگام چاپ نمایش داده می‌شود */}
      <div className="thermal-receipt">
        <p>NOORBAND Jaghori</p>
        <p>{t("orderHashLabel", language).replace("{orderNumber}", orderNumber)}</p>
        <p>{formatJalali(new Date(order.created_at))}</p>
        <hr />
        {items.map((item) => (
          <p key={item.id}>
            {item.product_name} x{item.quantity} — {format(Number(item.total_price))}
          </p>
        ))}
        <hr />
        <p>{t("invoiceGrandTotalLabel", language).replace("{amount}", format(Number(order.total_amount)))}</p>
      </div>
    </main>
  );
}

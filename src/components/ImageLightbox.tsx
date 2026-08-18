"use client";

import { useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";

// قبلا صفحه محصول فقط یک تصویر اصلی + ردیف thumbnail کوچک داشت، بدون
// هیچ بزرگنمایی یا نمایش تمام‌صفحه — دقیقا همان چیزی که چک‌لیست
// می‌خواست و در بررسی v26 هم درست به‌عنوان کمبود شناسایی شد.
export default function ImageLightbox({
  image,
  alt,
  onClose,
}: {
  image: string;
  alt: string;
  onClose: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
      }}
    >
      <button
        type="button"
        aria-label="بستن"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1001,
          background: "white",
          borderRadius: "50%",
          width: 44,
          height: 44,
          border: "none",
          cursor: "pointer",
        }}
      >
        <X size={22} style={{ margin: "auto" }} />
      </button>

      <button
        type="button"
        aria-label={zoomed ? "کوچک‌نمایی" : "بزرگنمایی"}
        onClick={(e) => {
          e.stopPropagation();
          setZoomed((z) => !z);
        }}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1001,
          background: "white",
          borderRadius: "50%",
          width: 44,
          height: 44,
          border: "none",
          cursor: "pointer",
        }}
      >
        {zoomed ? <ZoomOut size={22} style={{ margin: "auto" }} /> : <ZoomIn size={22} style={{ margin: "auto" }} />}
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={alt}
        onClick={(e) => {
          e.stopPropagation();
          setZoomed((z) => !z);
        }}
        style={{
          maxWidth: zoomed ? "none" : "92vw",
          maxHeight: zoomed ? "none" : "92vh",
          width: zoomed ? "180%" : "auto",
          cursor: zoomed ? "zoom-out" : "zoom-in",
          transition: "all 0.2s ease",
        }}
      />
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { X, RotateCw } from "lucide-react";

interface Product360ViewerProps {
  images: string[];
  title: string;
  onClose: () => void;
}

// نمای ۳۶۰ درجه واقعی از روی عکس‌های واقعی گالری محصول: با کشیدن
// ماوس/انگشت به چپ و راست، بین فریم‌های واقعی محصول می‌چرخد — نه یک
// مدل سه‌بعدی جعلی با عکس ثابت.
export default function Product360Viewer({ images, title, onClose }: Product360ViewerProps) {
  const [frame, setFrame] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);

  const frameCount = images.length;

  function step(delta: number) {
    setFrame((f) => {
      const next = (f + delta) % frameCount;
      return next < 0 ? next + frameCount : next;
    });
  }

  function handlePointerDown(e: React.PointerEvent) {
    dragging.current = true;
    lastX.current = e.clientX;
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    // هر ۲۰ پیکسل کشیدن = یک فریم چرخش
    if (Math.abs(dx) > 20) {
      step(dx > 0 ? -1 : 1);
      lastX.current = e.clientX;
    }
  }

  function handlePointerUp() {
    dragging.current = false;
  }

  if (frameCount === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="بستن"
        style={{
          position: "absolute",
          top: 16,
          insetInlineEnd: 16,
          background: "rgba(255,255,255,0.15)",
          border: "none",
          borderRadius: "50%",
          width: 40,
          height: 40,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <X size={22} />
      </button>

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          width: "min(420px, 90vw)",
          height: "min(420px, 60vh)",
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          cursor: "grab",
          touchAction: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[frame]}
          alt={`${title} — نمای ${frame + 1} از ${frameCount}`}
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "contain", userSelect: "none" }}
        />
      </div>

      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, color: "#fff" }}>
        <RotateCw size={18} />
        <span>برای چرخش، بکشید</span>
      </div>

      <div style={{ marginTop: 8, color: "#fff", opacity: 0.7, fontSize: 13 }}>
        {frame + 1} / {frameCount}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

// این کامپوننت همان انیمیشن «کره‌ی ذره‌ای» که کاربر نمونه‌اش را فرستاد
// (ذره‌ها روی سطح یک کره + چند حلقه‌ی مداری چرخان دورش، با گرادیان رنگی
// بر اساس زاویه) را با Canvas 2D بازسازی می‌کند — نه با Three.js واقعی،
// چون Three.js یک وابستگی سنگین (WebGL) اضافه می‌کرد که برای یک المان
// صرفا تزئینی روی یک دکمه‌ی کوچک شناور به‌صرفه نیست؛ از نظر بصری
// (ذرات روی سطح کره با تغییر هیو رنگی + حلقه‌های مداری اطراف با
// درخشش) دقیقا همان جلوه بازسازی شده است.
//
// جای استفاده: آواتار دکمه‌ی شناور «NOORBAND AI» (src/components/
// ChatBotLauncher.tsx) — چون این المان دقیقا نماد «هوش مصنوعی» سایت
// است و در همه صفحات همیشه دیده می‌شود، جای طبیعی و پرتکراری برای
// این انیمیشن است؛ ماسکوت ربات ثابت قبلی جایگزین آن شد.

interface ParticleSphereProps {
  size?: number;
  className?: string;
}

export default function ParticleSphere({ size = 44, className }: ParticleSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const center = size / 2;
    const sphereRadius = size * 0.32;

    // ذرات روی سطح کره — با توزیع فیبوناچی (یکنواخت‌تر از رندوم خام)
    const PARTICLE_COUNT = 220;
    const particles: { theta: number; phi: number }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = golden * i;
      particles.push({ theta, phi: Math.acos(y) });
      void radiusAtY;
    }

    // حلقه‌های مداری چرخان دور کره (مثل رینگ‌های سبز/سفید نمونه)
    const RING_COUNT = 3;
    const RING_PARTICLES = 70;

    let rotation = 0;
    let raf = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);

      // هسته‌ی درخشان پشت کره (شبیه گرادیان صورتی/بنفش نمونه)
      const glow = ctx.createRadialGradient(
        center,
        center,
        sphereRadius * 0.2,
        center,
        center,
        sphereRadius * 1.5
      );
      glow.addColorStop(0, "rgba(236,72,153,0.55)");
      glow.addColorStop(0.5, "rgba(139,92,246,0.35)");
      glow.addColorStop(1, "rgba(139,92,246,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(center, center, sphereRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // ذرات سطح کره
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const t = p.theta + rotation;

        const x3 = Math.sin(p.phi) * Math.cos(t);
        const y3 = Math.cos(p.phi);
        const z3 = Math.sin(p.phi) * Math.sin(t);

        // پرسپکتیو ساده
        const scale = 1 / (1.8 - z3 * 0.8);
        const x2 = center + x3 * sphereRadius * scale;
        const y2 = center + y3 * sphereRadius * scale;

        const hue = 285 + z3 * 55; // بنفش → صورتی بر اساس عمق
        const alpha = 0.35 + Math.max(0, z3) * 0.65;
        const dotSize = Math.max(0.5, 1.1 * scale);

        ctx.fillStyle = `hsla(${hue}, 85%, ${60 + z3 * 10}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x2, y2, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // حلقه‌های مداری
      for (let r = 0; r < RING_COUNT; r++) {
        const ringRadius = sphereRadius * (1.35 + r * 0.22);
        const tilt = 0.35 + r * 0.25;
        const speed = rotation * (r % 2 === 0 ? 1 : -1.3) + r * 1.4;

        for (let i = 0; i < RING_PARTICLES; i++) {
          const a = (i / RING_PARTICLES) * Math.PI * 2 + speed;
          const x3 = Math.cos(a);
          const z3 = Math.sin(a) * Math.sin(tilt);
          const y3 = Math.sin(a) * Math.cos(tilt);

          const scale = 1 / (1.8 - z3 * 0.8);
          const x2 = center + x3 * ringRadius * scale;
          const y2 = center + y3 * ringRadius * scale;

          const alpha = 0.15 + Math.max(0, z3) * 0.55;
          if (alpha < 0.18) continue;

          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath();
          ctx.arc(x2, y2, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    if (reduceMotion) {
      draw();
      return;
    }

    function animate() {
      rotation += 0.006;
      draw();
      raf = requestAnimationFrame(animate);
    }
    animate();

    return () => cancelAnimationFrame(raf);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: size, height: size, display: "block" }}
      aria-hidden="true"
    />
  );
}

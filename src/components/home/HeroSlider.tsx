"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Gem, Sparkles, Tag } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t, LANGUAGE_DIRECTION } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/client";
import { useSiteSettings } from "@/lib/site-settings";

interface Slide {
  eyebrow: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  Icon: typeof Gem;
  // نکته اصلاح‌شده: بنرهایی که از پنل (/dashboard/banners) با زون
  // «hero» ساخته می‌شدند، عکس اختصاصی خودشان را داشتند (ستون image در
  // جدول banners) ولی این عکس هیچ‌وقت اینجا خوانده نمی‌شد — یعنی هر چند
  // بنر که ادمین با عکس‌های مختلف می‌ساخت، همه فقط یک عکس ثابت سراسری
  // (heroImageUrl از تنظیمات برندینگ) یا آیکون پیش‌فرض را نشان می‌دادند.
  image?: string | null;
}

export default function HeroSlider() {
  const { language } = useLanguage();
  const { heroImageUrl } = useSiteSettings();
  const [index, setIndex] = useState(0);

  // بنرهای اضافی که ادمین از پنل (/dashboard/banners) ساخته — قبلا این
  // اسلایدر کاملا hardcode بود و هیچ راهی برای مدیریت از پنل نداشت.
  // این‌ها به اسلایدهای ثابت چندزبانه *اضافه* می‌شوند، جایگزینشان
  // نمی‌شوند، چون بنرهای دیتابیس فقط یک زبان دارند.
  const [extraSlides, setExtraSlides] = useState<Slide[]>([]);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("banners")
      .select("*")
      .eq("zone", "hero")
      .order("sort_order")
      .then(({ data }) => {
        if (!data) return;

        setExtraSlides(
          data.map((b) => ({
            eyebrow: "",
            title: b.title,
            text: b.subtitle || "",
            ctaLabel: b.button_label || t("heroCtaProducts", language),
            ctaHref: b.link_url || "/categories",
            secondaryLabel: t("categories", language),
            secondaryHref: "/categories",
            Icon: Tag,
            image: b.image,
          }))
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dir = LANGUAGE_DIRECTION[language];

  // اسلایدها حالا با t() ساخته می‌شوند تا با تغییر زبان واقعا عوض شوند
  // (قبلا این متن‌ها مستقیم فارسی و ثابت بودند).
  const SLIDES: Slide[] = [
    {
      eyebrow: t("heroSlide1Eyebrow", language),
      title: t("heroSlide1Title", language),
      text: t("heroSlide1Text", language),
      ctaLabel: t("heroCtaProducts", language),
      ctaHref: "/categories",
      secondaryLabel: t("heroCtaAbout", language),
      secondaryHref: "/about",
      Icon: Gem,
    },
    {
      eyebrow: t("heroSlide2Eyebrow", language),
      title: t("heroSlide2Title", language),
      text: t("heroSlide2Text", language),
      ctaLabel: t("heroCtaChat", language),
      ctaHref: "/site/search",
      secondaryLabel: t("categories", language),
      secondaryHref: "/categories",
      Icon: Sparkles,
    },
    {
      eyebrow: t("heroSlide3Eyebrow", language),
      title: t("heroSlide3Title", language),
      text: t("heroSlide3Text", language),
      ctaLabel: t("heroCtaDeals", language),
      ctaHref: "#deals",
      secondaryLabel: t("newBadge", language),
      secondaryHref: "#new-arrivals",
      Icon: Tag,
    },
  ];

  const ALL_SLIDES = [...SLIDES, ...extraSlides];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % ALL_SLIDES.length);
    }, 6000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, extraSlides.length]);

  function goTo(i: number) {
    setIndex((i + ALL_SLIDES.length) % ALL_SLIDES.length);
  }

  const slide = ALL_SLIDES[index % ALL_SLIDES.length];
  const Icon = slide.Icon;

  // جهت پیکان‌ها باید با راست‌به‌چپ/چپ‌به‌راست هماهنگ باشد — در فارسی/
  // دری/پشتو (rtl) دکمه «قبلی» باید فلش-به-راست باشد، ولی در انگلیسی/
  // فرانسوی/آلمانی (ltr) باید فلش-به-چپ باشد؛ قبلا این آیکون‌ها ثابت
  // بودند و در حالت ltr برعکس به‌نظر می‌رسیدند.
  const PrevIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <section className="hero-slider">
      <button
        type="button"
        className="hero-arrow hero-arrow-prev"
        aria-label={t("heroPrevSlide", language)}
        onClick={() => goTo(index - 1)}
      >
        <PrevIcon size={22} />
      </button>

      <div className="hero-slide" key={index}>
        <div className="hero-slide-text">
          <span className="hero-eyebrow">{slide.eyebrow}</span>
          <h1>{slide.title}</h1>
          <p>{slide.text}</p>

          <div className="hero-cta-row">
            <Link href={slide.ctaHref} className="primary-btn">
              {slide.ctaLabel}
            </Link>
            <Link href={slide.secondaryHref} className="outline-btn">
              {slide.secondaryLabel}
            </Link>
          </div>
        </div>

        <div className="hero-slide-visual" aria-hidden="true">
          {slide.image || heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slide.image || heroImageUrl} alt="" className="hero-slide-photo" />
          ) : (
            <div className="hero-visual-ring">
              <Icon size={64} strokeWidth={1.4} />
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="hero-arrow hero-arrow-next"
        aria-label={t("heroNextSlide", language)}
        onClick={() => goTo(index + 1)}
      >
        <NextIcon size={22} />
      </button>

      <div className="hero-dots">
        {ALL_SLIDES.map((s, i) => (
          <button
            key={`${s.title}-${i}`}
            type="button"
            aria-label={`${i + 1}`}
            className={`hero-dot ${i === index ? "hero-dot-active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}

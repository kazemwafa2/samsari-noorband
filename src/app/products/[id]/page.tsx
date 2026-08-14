"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cart";
import { useCompareStore } from "@/store/compare";
import { useWishlist } from "@/hooks/useWishlist";
import { trackRecentlyViewed } from "@/lib/recentlyViewed";
import type { Product } from "@/types/product";
import { generateProductSchema, generateBreadcrumbSchema, safeJsonLdString } from "@/lib/seo/schema";
import { SEOHead } from "@/components/seo/SEOHead";
import { SITE_CONFIG } from "@/constants/site";
import PromoBannerStrip from "@/components/home/PromoBannerStrip";
import ImageLightbox from "@/components/ImageLightbox";
import Product360Viewer from "@/components/Product360Viewer";
import { CartAddedBurst } from "@/components/CartAddedBurst";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { useCurrency } from "@/lib/currency";

// این صفحه قبلا اصلا وجود نداشت — کارت‌های محصول در صفحه اصلی
// جایی برای لینک شدن نداشتند. نام ستون‌ها بر اساس src/types/product.ts است.

export default function ProductDetailPage() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const { format } = useCurrency();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [gallery, setGallery] = useState<{ id: number; url: string }[]>([]);
  const [activeImage, setActiveImage] = useState<string>("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [questionMessage, setQuestionMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "qa" | "reviews">("description");

  const addItem = useCartStore((state) => state.addItem);
  const addToCompare = useCompareStore((state) => state.add);

  // علاقه‌مندی (♡) — چک‌لیست: در طرح مرجع کنار «مقایسه» و «QR» یک دکمه
  // قلب هست. useWishlist از قبل کامل و واقعی ساخته شده بود (جدول
  // wishlist) ولی در همین صفحه محصول وصل نبود.
  const { add: addToWishlist, remove: removeFromWishlist, isInWishlist } = useWishlist();
  const [wishlistBusy, setWishlistBusy] = useState(false);

  // «کد ۳بعدی» — چک‌لیست: دکمه‌ای که یک نمای چرخشی/۳۶۰ محصول باز
  // می‌کند. چون مدل واقعی سه‌بعدی (glTF/…) برای محصولات وجود ندارد، به
  // جای ساختن یک ویووئر ۳بعدی جعلی/ساختگی، از خود گالری واقعی محصول یک
  // نمای ۳۶۰ درجه (چرخش با کشیدن ماوس/انگشت بین عکس‌های واقعی) می‌سازیم.
  const [view360Open, setView360Open] = useState(false);

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  async function loadProduct() {
    setLoading(true);

    const [{ data, error }, { data: images }] = await Promise.all([
      supabase.from("products").select("*, brands(title), categories(title)").eq("id", id).single(),
      supabase.from("product_images").select("id, url").eq("product_id", id).order("sort_order"),
    ]);

    if (error) {
      console.log("PRODUCT DETAIL ERROR:", error);
      setProduct(null);
    } else {
      setProduct(data);
      setActiveImage(data?.image || "");
      // برای بخش «به‌تازگی مشاهده کرده‌اید» در صفحه اصلی
      if (data?.id) trackRecentlyViewed(data.id);
    }

    setGallery(images || []);
    setLoading(false);

    // پیشنهاد محصولات مشابه بر اساس دسته‌بندی — قبلا این قابلیت اصلا
    // وجود نداشت («پیشنهاد هوشمند» در چک‌لیست)
    if (data?.category) {
      const { data: similar } = await supabase
        .from("products")
        .select("*")
        .eq("category", data.category)
        .eq("is_available", true)
        .neq("id", id)
        .limit(4);

      setSimilarProducts(similar || []);
    }

    // نکته: قبلا اینجا مستقیم از comments + profiles(name) خوانده
    // می‌شد، اما چون RLS جدول profiles نام بقیه کاربران را برای کاربر
    // فعلی محدود می‌کند، نام نویسنده نظر برای هرکسی جز خودش/ادمین
    // خالی برمی‌گشت. حالا از ویو عمومی public_reviews (db/schema.sql
    // بخش ۱۱) خوانده می‌شود که همین مشکل را حل کرده.
    const { data: reviewData, error: reviewError } = await supabase
      .from("public_reviews")
      .select("*")
      .eq("product_id", id)
      .order("created_at", { ascending: false });

    if (reviewError) {
      console.log("PRODUCT REVIEWS ERROR (migration اجرا نشده؟):", reviewError.message);
    }

    setReviews(reviewData || []);

    const { data: questionData, error: questionError } = await supabase
      .from("public_product_questions")
      .select("*")
      .eq("product_id", id)
      .order("created_at", { ascending: false });

    if (questionError) {
      console.log("PRODUCT QUESTIONS ERROR (migration اجرا نشده؟):", questionError.message);
    }

    setQuestions(questionData || []);
  }

  async function handleReserve() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert(t("reserveLoginRequiredAlert", language));
      return;
    }

    const reservedUntil = new Date();
    reservedUntil.setDate(reservedUntil.getDate() + 3); // پیش‌فرض ۳ روز رزرو

    const { error } = await supabase.from("reservations").insert({
      product_id: Number(product?.id),
      user_id: user.id,
      reserved_until: reservedUntil.toISOString(),
      status: "active",
    });

    if (error) {
      alert(t("reserveErrorPrefix", language) + " " + error.message);
      return;
    }

    alert(t("reserveSuccessAlert", language));
  }

  async function submitQuestion(e: React.FormEvent) {
    e.preventDefault();
    setQuestionMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setQuestionMessage(t("questionLoginRequiredText", language));
      return;
    }

    if (!newQuestion.trim()) {
      setQuestionMessage(t("questionEmptyText", language));
      return;
    }

    setSubmittingQuestion(true);

    const { error } = await supabase.from("product_questions").insert({
      product_id: Number(id),
      user_id: user.id,
      question: newQuestion,
    });

    setSubmittingQuestion(false);

    if (error) {
      setQuestionMessage(t("questionErrorPrefix", language) + " " + error.message);
      return;
    }

    setNewQuestion("");
    setQuestionMessage(t("questionSuccessText", language));
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setReviewMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setReviewMessage(t("reviewLoginRequiredText", language));
      return;
    }

    if (!reviewText.trim()) {
      setReviewMessage(t("reviewEmptyText", language));
      return;
    }

    setSubmittingReview(true);

    const { error } = await supabase.from("comments").insert({
      product_id: Number(id),
      user_id: user.id,
      content: reviewText,
      rating: reviewRating,
      is_approved: false,
    });

    setSubmittingReview(false);

    if (error) {
      setReviewMessage(t("reviewErrorPrefix", language) + " " + error.message);
      return;
    }

    setReviewText("");
    setReviewMessage(t("reviewSuccessText", language));
  }

  function handleAddToCart() {
    if (!product) return;

    const finalPrice =
      product.discount > 0
        ? product.price - (product.price * product.discount) / 100
        : product.price;

    addItem({
      product_id: String(product.id),
      title: product.title,
      price: product.price,
      discount_percent: product.discount,
      final_price: finalPrice,
      image: product.image,
      stock_quantity: product.stock,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  // «خرید فوری» — چک‌لیست: دقیقا مثل طرح مرجع، یک دکمه جدا از «افزودن
  // به سبد خرید» که بلافاصله کاربر را به تسویه‌حساب می‌برد (بدون اینکه
  // مجبور باشد اول به سبد برود، بعد خودش پیدا کند کجا باید پرداخت کند).
  function handleQuickBuy() {
    handleAddToCart();
    router.push("/site/checkout");
  }

  if (loading) {
    return (
      <main className="container home-page">
        <p>{t("loadingText", language)}</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container home-page">
        <h1 className="section-title">{t("productNotFoundTitle", language)}</h1>
      </main>
    );
  }

  const finalPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  // میانگین امتیاز واقعی از نظرات تاییدشده همین محصول (برای
  // AggregateRating در schema — اگر نظری نباشد، این بخش از schema اصلا
  // اضافه نمی‌شود، نه اینکه عدد ساختگی نشان بدهد).
  const ratingCount = reviews.length;
  const ratingAvg =
    ratingCount > 0 ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / ratingCount : 0;

  const productSchema = generateProductSchema(
    product,
    ratingCount > 0 ? { avg: ratingAvg, count: ratingCount } : undefined
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t("home", language), url: "/" },
    { name: t("categories", language), url: "/categories" },
    { name: product.title, url: `/products/${product.id}` },
  ]);

  return (
    <main className="container home-page">
      {/* چون این صفحه یک کامپوننت کلاینت است، از generateMetadata سرور
          نمی‌تواند استفاده کند — یعنی title/description/og:image واقعی
          هر محصول تا امروز فقط همان متادیتای عمومی کل سایت (در
          layout.tsx) بود، نه مخصوص همین محصول. SEOHead (که قبلا ساخته
          شده بود ولی هیچ‌جا استفاده نمی‌شد) این را سمت کلاینت تنظیم
          می‌کند. */}
      <SEOHead
        title={`${product.title} | نوربند`}
        description={product.description?.slice(0, 160) || product.title}
        image={product.image}
        type="product"
      />

      {/* Schema.org برای نتایج غنی گوگل (قیمت، موجودی، امتیاز و مسیر
          صفحه) — قبلا اینجا یک نسخه دستی و ناقص بود که ارز را اشتباه
          «IRT» (افغانی ایران) می‌گذاشت، در حالی که ارز پایه فروشگاه AFN
          است. حالا از src/lib/seo/schema.ts که با نوع واقعی Product
          هماهنگ است استفاده می‌شود. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdString(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdString(breadcrumbSchema) }}
      />

      <div className="product-detail-grid">

        {/* گالری تصاویر — چک‌لیست: عکس اصلی بزرگ، گالری تصاویر کوچک،
            تغییر عکس اصلی، درصد تخفیف روی عکس. قبلا این‌ها فقط تگ‌های
            img خام با width/height ثابت و بدون هیچ کلاس/چیدمانی بودند؛
            دقیقا مثل طرح مرجع (عکس بزرگ راست/چپ + تامبنیل زیرش) نبود. */}
        <div className="product-gallery">
          <div className="product-gallery-main" onClick={() => setLightboxOpen(true)}>
            {product.discount > 0 && (
              <span className="product-badge product-badge-danger">
                -{product.discount}%
              </span>
            )}

            {activeImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activeImage} alt={product.title} />
            )}
          </div>

          {lightboxOpen && activeImage && (
            <ImageLightbox image={activeImage} alt={product.title} onClose={() => setLightboxOpen(false)} />
          )}

          {gallery.length > 0 && (
            <div className="product-gallery-thumbs">
              {[{ id: 0, url: product.image }, ...gallery]
                .filter((g) => g.url)
                .map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={activeImage === g.url ? "active" : ""}
                    onClick={() => setActiveImage(g.url as string)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.url} alt="" />
                  </button>
                ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1 className="section-title">{product.title}</h1>

          {ratingCount > 0 && (
            <div className="product-rating" style={{ fontSize: 14 }}>
              ⭐ {ratingAvg.toFixed(1)}
              <span className="product-rating-count">({ratingCount} {t("reviewCountSuffix", language)})</span>
            </div>
          )}

          <p className="product-card-price" style={{ fontSize: 18 }}>
            {product.discount > 0 && (
              <span className="product-price-old">
                {format(product.price)}
              </span>
            )}
            <span className="product-price-new" style={{ fontSize: 22 }}>
              {format(finalPrice)}
            </span>
          </p>

          <p className="product-stock">
            {product.stock > 0 ? t("inStockWithCount", language).replace("{n}", String(product.stock)) : t("outOfStock", language)}
          </p>

          {/* مشخصات سریع — چک‌لیست: برند، جنس، اندازه، رنگ، کشور
              سازنده کنار قیمت. قبلا برند اصلا هیچ‌جای این صفحه نمایش
              داده نمی‌شد و بقیه‌ی موارد فقط داخل تب «مشخصات» (پایین
              صفحه) پنهان بودند. */}
          <ul className="product-quick-specs">
            {(product as any).brands?.title && (
              <li><span>{t("brandLabel", language)}</span> {(product as any).brands.title}</li>
            )}
            {(product as any).categories?.title && (
              <li><span>{t("categoryLabel", language)}</span> {(product as any).categories.title}</li>
            )}
            {product.specifications &&
              Object.entries(product.specifications)
                .slice(0, 4)
                .map(([key, value]) => (
                  <li key={key}><span>{key}:</span> {String(value)}</li>
                ))}
          </ul>

          <div className="product-qty-row">
            <div className="product-qty-input">
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              <button type="button" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
            </div>
          </div>

          <div className="product-main-actions">
            <button
              className="primary-btn"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <span className={`cart-added-wrap ${added ? "cart-added-pop" : ""}`}>
                {added ? `✅ ${t("addedToCartLabel", language)}` : `🛒 ${t("addToCart", language)}`}
                <CartAddedBurst show={added} />
              </span>
            </button>

            {/* خرید فوری — چک‌لیست: دکمه جدا و پررنگ برای خرید یک‌مرحله‌ای */}
            <button
              className="primary-btn quick-buy-btn"
              onClick={handleQuickBuy}
              disabled={product.stock <= 0}
            >
              ⚡ {t("quickBuyButton", language)}
            </button>
          </div>

          <button className="secondary-btn" onClick={handleReserve} disabled={product.stock <= 0}>
            📌 {t("reserveItemButton", language)}
          </button>

          {/* ردیف آیکون‌های اشتراک‌گذاری/مقایسه/QR/واتساپ — چک‌لیست
              بخش ۳ و ۸. قبلا این دکمه‌ها یکی زیر دیگری با کلاس
              primary-btn تکراری بودند؛ الان یک ردیف افقی جمع‌وجور،
              دقیقا مثل طرح مرجع. */}
          <div className="product-icon-actions">
            <button
              type="button"
              onClick={async () => {
                const shareData = {
                  title: product.title,
                  text: product.title,
                  url: window.location.href,
                };

                if (navigator.share) {
                  try {
                    await navigator.share(shareData);
                  } catch {
                    // کاربر خودش اشتراک‌گذاری را لغو کرده — نیازی به خطا نیست.
                  }
                } else {
                  await navigator.clipboard.writeText(window.location.href);
                  toast.success(t("productLinkCopiedToast", language));
                }
              }}
            >
              🔗 {t("shareButton", language)}
            </button>

            <button
              type="button"
              disabled={wishlistBusy}
              onClick={async () => {
                setWishlistBusy(true);
                const productId = String(product.id);
                if (isInWishlist(productId)) {
                  await removeFromWishlist(productId);
                  toast.success(t("removedFromWishlistToast", language));
                } else {
                  const { error } = await addToWishlist(productId);
                  if (error) {
                    toast.error(error);
                  } else {
                    toast.success(t("addedToWishlistToast", language));
                  }
                }
                setWishlistBusy(false);
              }}
            >
              {isInWishlist(String(product.id)) ? "💗" : "🤍"} {t("wishlistButton", language)}
            </button>

            <button
              type="button"
              onClick={() => {
                const before = useCompareStore.getState().productIds.length;
                addToCompare(product.id);
                const after = useCompareStore.getState().productIds.length;

                if (after === before && before >= 4) {
                  toast.error(t("maxCompareToast", language));
                } else if (after > before) {
                  toast.success(t("addedToCompareToast", language));
                }
              }}
            >
              ⚖️ {t("compareButton", language)}
            </button>

            {gallery.length > 0 && (
              <button type="button" onClick={() => setView360Open(true)}>
                🧊 {t("view360Button", language)}
              </button>
            )}

            <button
              type="button"
              onClick={async () => {
                const code = Math.random().toString(36).slice(2, 8).toUpperCase();

                const { error } = await supabase.from("short_links").insert({
                  code,
                  target_path: `/products/${product.id}`,
                  product_id: product.id,
                });

                if (error) {
                  toast.error(t("shortLinkErrorToast", language));
                  return;
                }

                const shortUrl = `${window.location.origin}/s/${code}`;
                await navigator.clipboard.writeText(shortUrl);
                toast.success(`${t("shortLinkCopiedPrefix", language)} ${shortUrl}`);
              }}
            >
              ✂️ {t("shortLinkButton", language)}
            </button>

            <button
              type="button"
              onClick={async () => {
                if (qrDataUrl) {
                  setQrDataUrl("");
                  return;
                }
                const QRCode = (await import("qrcode")).default;
                const url = await QRCode.toDataURL(window.location.href, { width: 220 });
                setQrDataUrl(url);
              }}
            >
              📱 {qrDataUrl ? t("closeQrButton", language) : t("qrCodeButton", language)}
            </button>

            <a
              href={`${SITE_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                `${t("whatsappOrderGreeting", language)}\n\n${t("whatsappOrderIntent", language)}\n\n${t("whatsappProductNameLabel", language)} ${product.title}\n${t("whatsappProductCodeLabel", language)} ${product.id}\n${t("whatsappPriceLabel", language)} ${format(finalPrice)}\n${t("whatsappQuantityLabel", language)} ${quantity}\n${t("whatsappProductLinkLabel", language)} ${typeof window !== "undefined" ? window.location.href : ""}\n\n${t("whatsappOrderClosing", language)}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: "#25d366", color: "#fff" }}
            >
              💬 {t("orderViaWhatsappButton", language)}
            </a>
          </div>

          {qrDataUrl && (
            <div style={{ marginTop: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt={t("qrCodeAlt", language)} width={160} height={160} />
            </div>
          )}

          {view360Open && (
            <Product360Viewer
              images={gallery.length > 0 ? gallery.map((g) => g.url) : [product.image]}
              title={product.title}
              onClose={() => setView360Open(false)}
            />
          )}
        </div>
      </div>

      {/* بنر تبلیغاتی صفحه محصول — چک‌لیست بخش ۱۱ */}
      <PromoBannerStrip zone="product" />

      {similarProducts.length > 0 && (
        <div>
          <h2 className="section-title">{t("relatedProductsTitle", language)}</h2>
          <div className="products-grid-v2">
            {similarProducts.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="product-card-v2">
                <div className="product-card-media">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} className="product-card-img" />
                  ) : (
                    <span className="product-card-img-placeholder">{t("noImage", language)}</span>
                  )}
                </div>
                <div className="product-card-body">
                  <h3>{p.title}</h3>
                  <p className="product-card-price">
                    <span className="product-price-new">{format(p.price)}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* تب‌های توضیحات/مشخصات/پرسش‌وپاسخ/نظرات — چک‌لیست: قبلا این
          بخش‌ها همه زیر هم و همیشه باز بودند؛ الان دقیقا مثل طرح مرجع
          به‌صورت تب کنار هم هستند و «مشخصات» (که اصلا وجود نداشت) هم
          اضافه شد. */}
      <div className="product-tabs">
        <div className="product-tabs-nav">
          <button type="button" className={activeTab === "description" ? "active" : ""} onClick={() => setActiveTab("description")}>
            {t("productTabDescription", language)}
          </button>
          <button type="button" className={activeTab === "specs" ? "active" : ""} onClick={() => setActiveTab("specs")}>
            {t("productTabSpecs", language)}
          </button>
          <button type="button" className={activeTab === "qa" ? "active" : ""} onClick={() => setActiveTab("qa")}>
            {t("productTabQa", language)} ({questions.length})
          </button>
          <button type="button" className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>
            {t("productTabReviews", language)} ({reviews.length})
          </button>
        </div>

        <div className="product-tabs-panel">
          {activeTab === "description" && (
            <p>{product.description || t("noDescriptionText", language)}</p>
          )}

          {activeTab === "specs" && (
            <>
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <table className="spec-table">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <th>{key}</th>
                        <td>{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>{t("noSpecsText", language)}</p>
              )}
            </>
          )}

          {activeTab === "qa" && (
            <div>
              {questions.length === 0 && <p>{t("noQuestionsYetText", language)}</p>}

              {questions.map((q) => (
                <div key={q.id} className="glass-card">
                  <p><strong>{t("questionLabel", language)}</strong> {q.question}</p>
                  <p style={{ color: "#6B7280" }}>{q.asker_name || t("userColumnLabel", language)}</p>
                  {q.answer ? (
                    <p><strong>{t("answerLabel", language)}</strong> {q.answer}{q.answerer_name ? ` — ${q.answerer_name}` : ""}</p>
                  ) : (
                    <p style={{ color: "#F59E0B" }}>{t("notAnsweredYetText", language)}</p>
                  )}
                </div>
              ))}

              <form onSubmit={submitQuestion} className="space-y-6">
                <h3>{t("askNewQuestionTitle", language)}</h3>

                {questionMessage && <p>{questionMessage}</p>}

                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder={t("askQuestionPlaceholder", language)}
                />

                <button className="primary-btn" type="submit" disabled={submittingQuestion}>
                  {submittingQuestion ? t("submitting", language) : t("submitQuestionButton", language)}
                </button>
              </form>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {reviews.length === 0 && <p>{t("noReviewsYetText", language)}</p>}

              {reviews.map((r) => (
                <div key={r.id} className="glass-card">
                  <p>{"⭐".repeat(r.rating || 0)}</p>
                  <p>{r.content}</p>
                  <p style={{ color: "#6B7280" }}>{r.author_name || t("userColumnLabel", language)}</p>
                </div>
              ))}

              <form onSubmit={submitReview} className="space-y-6">
                <h3>{t("writeYourReviewTitle", language)}</h3>

                {reviewMessage && <p>{reviewMessage}</p>}

                <div>
                  <label>{t("ratingLabel", language)} </label>
                  <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{"⭐".repeat(n)}</option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder={t("writeReviewPlaceholder", language)}
                />

                <button className="primary-btn" type="submit" disabled={submittingReview}>
                  {submittingReview ? t("submitting", language) : t("submitReviewButton", language)}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

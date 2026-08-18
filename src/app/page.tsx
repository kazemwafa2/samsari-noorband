"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Bot,
  CircleDot,
  CreditCard,
  Droplet,
  Gem,
  Mail,
  Package,
  Play,
  Quote,
  Shirt,
  ShieldCheck,
  Sparkle,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import HeroSlider from "@/components/home/HeroSlider";
import SectionHeader from "@/components/home/SectionHeader";
import ProductCard from "@/components/home/ProductCard";
import CountdownTimer from "@/components/home/CountdownTimer";
import Reveal from "@/components/home/Reveal";
import PromoBannerStrip from "@/components/home/PromoBannerStrip";
import QuickViewModal from "@/components/home/QuickViewModal";
import {
  ProductGridSkeleton,
  CategoryGridSkeleton,
  ChipsSkeleton,
  TestimonialGridSkeleton,
} from "@/components/home/Skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import { useCurrency } from "@/lib/currency";
import { useWishlist } from "@/hooks/useWishlist";
import { useCompareStore } from "@/store/compare";
import { getRecentlyViewed } from "@/lib/recentlyViewed";
import { useSiteSettings } from "@/lib/site-settings";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { resolveTranslated } from "@/lib/i18n/resolveContent";
import { formatLocalDate } from "@/lib/geo/timezone";

const CATEGORY_ICONS: Record<string, typeof Gem> = {
  // زیورآلات و زیرمجموعه‌هایش
  jewelry: Gem,
  ring: Gem,
  bracelet: CircleDot,
  necklace: Sparkle,
  earring: Sparkle,

  // آرایشی/بهداشتی و زیرمجموعه‌هایش
  "beauty-cosmetics": Sparkles,
  makeup: Sparkles,
  hygiene: Droplet,
  perfume: Droplet,
  "skin-hair-care": Droplet,

  // پوشاک محلی و زیرمجموعه‌هایش
  "hazaragi-clothing": Shirt,
  "local-dress": Shirt,
  "hazaragi-chador": Shirt,

  // متفرقه
  misc: Package,
};

// آیکون‌ها ثابت‌اند؛ متن‌ها از دیکشنری زبان گرفته می‌شوند (پایین، داخل
// کامپوننت، چون t() به زبان انتخابی نیاز دارد).
const TRUST_BADGE_DEFS = [
  { Icon: Truck, titleKey: "trustShippingTitle", textKey: "trustShippingText" },
  { Icon: ShieldCheck, titleKey: "trustAuthenticTitle", textKey: "trustAuthenticText" },
  { Icon: Bot, titleKey: "trustSupportTitle", textKey: "trustSupportText" },
  { Icon: CreditCard, titleKey: "trustPaymentTitle", textKey: "trustPaymentText" },
] as const;

interface RatingInfo {
  avg: number;
  count: number;
}

interface ProductStats {
  view_count: number;
  sold_count: number;
  comment_count: number;
  wishlist_count: number;
}

interface BlogPostPreview {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string;
}

export default function Home() {
  const supabase = createClient();
  const { format } = useCurrency();
  const { language } = useLanguage();
  const { isInWishlist, add: addToWishlist, remove: removeFromWishlist } = useWishlist();
  const { productIds: compareIds, clear: clearCompare } = useCompareStore();
  const { promoVideoUrl, promoVideoEnabled, promoSocialLink, storeImageDayUrl, storeImageNightUrl, storeGalleryUrls } = useSiteSettings();

  // نکته: قبلا فقط یک عکس دوکان (همان که در فوتر بود) وجود داشت. حالا
  // طبق درخواست، دو عکس هم‌زمان در صفحه اصلی نمایش داده می‌شود — اگر
  // ادمین گالری چند-عکسی (تنظیمات → برندینگ) پر کرده باشد از همان دو
  // عکس اول استفاده می‌شود، وگرنه از جفت عکس روز/شب.
  const storeShowcasePhotos = (
    storeGalleryUrls.length >= 2
      ? storeGalleryUrls.slice(0, 2)
      : [storeImageDayUrl, storeImageNightUrl].filter(Boolean)
  ) as string[];

  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostPreview[]>([]);
  const [ratingsMap, setRatingsMap] = useState<Record<number, RatingInfo>>({});
  const [statsMap, setStatsMap] = useState<Record<number, ProductStats>>({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  useEffect(() => {
    loadHomeData();
  }, []);

  async function loadHomeData() {
    setInitialLoading(true);

    await Promise.all([
      loadNewProducts(),
      loadFeaturedProducts(),
      loadDealProducts(),
      loadBestsellers(),
      loadCategories(),
      loadBrands(),
      loadReviews(),
      loadStats(),
      loadBlogPosts(),
      loadRecentlyViewed(),
    ]);

    setInitialLoading(false);
  }

  async function loadNewProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_available", true)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      console.log("HOME NEW PRODUCTS ERROR:", error);
      setNewProducts([]);
      return;
    }
    setNewProducts(data || []);
  }

  async function loadFeaturedProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_available", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      console.log("HOME FEATURED PRODUCTS ERROR:", error);
      setFeaturedProducts([]);
      return;
    }
    setFeaturedProducts(data || []);
  }

  async function loadDealProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_available", true)
      .gt("discount", 0)
      .order("discount", { ascending: false })
      .limit(8);

    if (error) {
      console.log("HOME DEAL PRODUCTS ERROR:", error);
      setDealProducts([]);
      return;
    }
    setDealProducts(data || []);
  }

  async function loadBestsellers() {
    const { data: stats, error } = await supabase
      .from("public_bestsellers")
      .select("product_id, total_sold")
      .order("total_sold", { ascending: false })
      .limit(8);

    if (error || !stats || stats.length === 0) {
      if (error) console.log("HOME BESTSELLERS ERROR (migration اجرا نشده؟):", error.message);
      setBestsellers([]);
      return;
    }

    const ids = stats.map((s: any) => s.product_id);

    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("*")
      .in("id", ids)
      .eq("is_available", true);

    if (productsError || !productsData) {
      setBestsellers([]);
      return;
    }

    const orderIndex = new Map<number, number>(ids.map((id: number, i: number) => [id, i]));
    const sorted = [...productsData].sort(
      (a: Product, b: Product) =>
        (orderIndex.get(a.id) ?? 999) - (orderIndex.get(b.id) ?? 999)
    );

    setBestsellers(sorted);
  }

  async function loadCategories() {
    // باگ قبلی: با .is("parent_id", null) فقط ۳ دسته‌بندی خیلی کلی
    // (زیورآلات / آرایشی-بهداشتی / پوشاک محلی) نشان داده می‌شد. ولی
    // چیزی که مشتری واقعا روی آن کلیک می‌کند همان زیرمجموعه‌های مشخص
    // است (انگشتر، دستبند، گردنبند، ...) — دقیقا مثل طرح مرجع. حالا
    // همه دسته‌بندی‌ها (چه اصلی چه زیرمجموعه) خوانده می‌شوند و فقط
    // آن‌هایی که واقعا محصول دارند در گرید نمایش داده می‌شوند.
    const { data, error } = await supabase
      .from("categories")
      .select("*, products(count)")
      .order("title")
      .limit(24);

    if (error) {
      console.log("HOME CATEGORIES ERROR:", error);
      setCategories([]);
      return;
    }

    const withProducts = (data || []).filter((c) => (c.products?.[0]?.count ?? 0) > 0);
    setCategories((withProducts.length > 0 ? withProducts : data || []).slice(0, 8));
  }

  async function loadBrands() {
    const { data, error } = await supabase.from("brands").select("*").order("title").limit(12);

    if (error) {
      console.log("HOME BRANDS ERROR:", error.message);
      setBrands([]);
      return;
    }
    setBrands(data || []);
  }

  async function loadReviews() {
    const { data, error } = await supabase
      .from("public_reviews")
      .select("*")
      .gte("rating", 4)
      .order("created_at", { ascending: false })
      .limit(60);

    if (error || !data) {
      if (error) console.log("HOME REVIEWS ERROR (migration اجرا نشده؟):", error.message);
      setReviews([]);
      setRatingsMap({});
      return;
    }

    setReviews(data.slice(0, 6));

    const map: Record<number, RatingInfo> = {};
    data.forEach((r: any) => {
      if (!r.product_id || !r.rating) return;
      const current = map[r.product_id] || { avg: 0, count: 0 };
      const nextCount = current.count + 1;
      const nextAvg = (current.avg * current.count + r.rating) / nextCount;
      map[r.product_id] = { avg: nextAvg, count: nextCount };
    });
    setRatingsMap(map);
  }

  async function loadStats() {
    const { data, error } = await supabase.from("public_product_stats").select("*");

    if (error || !data) {
      if (error) console.log("HOME STATS ERROR (migration اجرا نشده؟):", error.message);
      setStatsMap({});
      return;
    }

    const map: Record<number, ProductStats> = {};
    data.forEach((row: any) => {
      map[row.product_id] = {
        view_count: row.view_count,
        sold_count: row.sold_count,
        comment_count: row.comment_count,
        wishlist_count: row.wishlist_count,
      };
    });
    setStatsMap(map);
  }

  async function loadBlogPosts() {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.log("HOME BLOG ERROR (migration اجرا نشده؟):", error.message);
      setBlogPosts([]);
      return;
    }
    setBlogPosts(data || []);
  }

  async function loadRecentlyViewed() {
    const ids = getRecentlyViewed();
    if (ids.length === 0) {
      setRecentlyViewed([]);
      return;
    }

    const { data, error } = await supabase.from("products").select("*").in("id", ids);

    if (error || !data) {
      setRecentlyViewed([]);
      return;
    }

    const orderIndex = new Map<number, number>(ids.map((id, i) => [id, i]));
    const sorted = [...data].sort(
      (a: Product, b: Product) => (orderIndex.get(a.id) ?? 999) - (orderIndex.get(b.id) ?? 999)
    );

    setRecentlyViewed(sorted.slice(0, 8));
  }

  async function toggleWishlist(productId: number) {
    if (isInWishlist(String(productId))) {
      await removeFromWishlist(String(productId));
      return;
    }

    const result = await addToWishlist(String(productId));
    if (result?.error) toast.error(result.error);
  }

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();

    const email = newsletterEmail.trim();
    if (!email || !email.includes("@")) {
      toast.error(t("newsletterInvalidEmail", language));
      return;
    }

    setNewsletterSubmitting(true);

    const { error } = await supabase.from("newsletter_subscribers").insert({ email });

    setNewsletterSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.info(t("newsletterAlreadySubscribed", language));
      } else {
        console.log("NEWSLETTER ERROR (migration اجرا نشده؟):", error.message);
        toast.error(t("newsletterError", language));
      }
      return;
    }

    toast.success(t("newsletterSuccess", language));
    setNewsletterEmail("");
  }

  return (
    <main className="home-page fade">
      {/*======================
      HERO SLIDER
      =======================*/}

      <HeroSlider />

      {/*======================
      TRUST BADGES
      =======================*/}

      <Reveal>
        <section className="trust-strip">
          {TRUST_BADGE_DEFS.map(({ Icon, titleKey, textKey }) => (
            <div key={titleKey} className="trust-item">
              <span className="trust-icon">
                <Icon size={22} />
              </span>
              <div>
                <strong>{t(titleKey, language)}</strong>
                <p>{t(textKey, language)}</p>
              </div>
            </div>
          ))}
        </section>
      </Reveal>

      {/*======================
      STORE SHOWCASE — دو عکس دوکان هم‌زمان در صفحه اصلی
      =======================*/}

      {storeShowcasePhotos.length > 0 && (
        <Reveal>
          <section className="home-section-v2">
            <SectionHeader
              eyebrow={t("storeShowcaseEyebrow", language)}
              title={t("storeShowcaseTitle", language)}
            />
            <div className="store-showcase-grid">
              {storeShowcasePhotos.map((url, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={index} src={url} alt={t("storeShowcaseTitle", language)} className="store-showcase-photo" />
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/*======================
      PROMO VIDEO — از پنل مدیریت (تنظیمات → برندینگ) قابل تنظیم/تعویض
      =======================*/}

      {promoVideoEnabled && (promoVideoUrl || promoSocialLink) && (
        <Reveal>
          <section className="home-section-v2">
            <div className="promo-video-wrap">
              {promoSocialLink ? (
                // شبکه‌های اجتماعی معمولا اجازه‌ی پخش مستقیم ویدیو در
                // سایت دیگری را نمی‌دهند؛ به‌جای iframe ناموفق، یک
                // کارت قابل‌کلیک نمایش داده می‌شود که کاربر را به
                // همان پست/ریلز می‌برد.
                <a
                  href={promoSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="promo-social-card"
                >
                  <Play size={48} />
                  <span>{t("promoSocialWatchLabel", language)}</span>
                </a>
              ) : promoVideoUrl!.includes("youtube.com") || promoVideoUrl!.includes("youtu.be") || promoVideoUrl!.includes("aparat.com") ? (
                <iframe
                  src={promoVideoUrl}
                  className="promo-video-frame"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <video
                  src={promoVideoUrl}
                  className="promo-video-frame"
                  controls
                  playsInline
                  preload="metadata"
                />
              )}
            </div>
          </section>
        </Reveal>
      )}

      {/*======================
      CATEGORIES
      =======================*/}

      {(initialLoading || categories.length > 0) && (
        <Reveal>
          <section className="home-section-v2">
            <SectionHeader
              eyebrow={t("categoriesEyebrow", language)}
              title={t("categoriesTitle", language)}
              subtitle={t("categoriesSubtitle", language)}
              viewAllHref="/categories"
              viewAllLabel={t("viewAll", language)}
            />

            {initialLoading ? (
              <CategoryGridSkeleton />
            ) : (
              <div className="category-grid">
                {categories.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.slug] || Package;
                  const count = cat.products?.[0]?.count ?? 0;
                  const catTitle = resolveTranslated(cat.title, cat.title_translations, language);

                  return (
                    <Link key={cat.id} href={`/categories/${cat.slug}`} className="category-card">
                      {cat.image_url ? (
                        <span className="category-photo">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={cat.image_url} alt={catTitle} />
                        </span>
                      ) : (
                        <span className="category-icon">
                          <Icon size={26} />
                        </span>
                      )}
                      <strong>{catTitle}</strong>
                      <span className="category-count">{count} {t("products", language)}</span>
                    </Link>
                  );
                })}

                <Link href="/categories" className="category-card category-card-more">
                  <span className="category-icon">
                    <Package size={26} />
                  </span>
                  <strong>{t("viewAll", language)}</strong>
                </Link>
              </div>
            )}
          </section>
        </Reveal>
      )}

      {/*======================
      DEALS + COUNTDOWN
      =======================*/}

      {(initialLoading || dealProducts.length > 0) && (
        <Reveal>
          <section className="home-section-v2 deals-section" id="deals">
            <div className="deals-banner">
              <div>
                <span className="section-eyebrow">{t("dealsEyebrow", language)}</span>
                <h2 className="section-title2">{t("dealsTitle", language)}</h2>
                <p className="section-subtitle">{t("dealsSubtitle", language)}</p>
              </div>
              <CountdownTimer />
            </div>

            {initialLoading ? (
              <ProductGridSkeleton />
            ) : (
              <div className="products-grid-v2">
                {dealProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    format={format}
                    isFavorite={isInWishlist(String(product.id))}
                    onToggleFavorite={() => toggleWishlist(product.id)}
                    rating={ratingsMap[product.id]}
                    stats={statsMap[product.id]}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </section>
        </Reveal>
      )}

      {/* بنر بین محصولات — چک‌لیست بخش ۱۱، مدیریت از /dashboard/banners.
          اگر ادمین بنری برای این zone نساخته باشد، چیزی نشان داده
          نمی‌شود. */}
      <PromoBannerStrip zone="middle" />

      {/*======================
      FEATURED PRODUCTS
      =======================*/}

      {(initialLoading || featuredProducts.length > 0) && (
        <Reveal>
          <section className="home-section-v2">
            <SectionHeader
              eyebrow={t("featuredEyebrow", language)}
              title={t("featuredTitle", language)}
              subtitle={t("featuredSubtitle", language)}
              viewAllHref="/categories"
              viewAllLabel={t("viewAll", language)}
            />
            {initialLoading ? (
              <ProductGridSkeleton />
            ) : (
              <div className="products-grid-v2">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    format={format}
                    isFavorite={isInWishlist(String(product.id))}
                    onToggleFavorite={() => toggleWishlist(product.id)}
                    rating={ratingsMap[product.id]}
                    stats={statsMap[product.id]}
                    badgeLabel={t("featuredBadge", language)}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </section>
        </Reveal>
      )}

      {/*======================
      NEW ARRIVALS
      =======================*/}

      <Reveal>
        <section className="home-section-v2" id="new-arrivals">
          <SectionHeader
            eyebrow={t("newEyebrow", language)}
            title={t("newTitle", language)}
            subtitle={t("newSubtitle", language)}
            viewAllHref="/categories"
            viewAllLabel={t("viewAll", language)}
          />

          {initialLoading ? (
            <ProductGridSkeleton />
          ) : newProducts.length === 0 ? (
            <p className="empty-state">{t("noProducts", language)}</p>
          ) : (
            <div className="products-grid-v2">
              {newProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  format={format}
                  isFavorite={isInWishlist(String(product.id))}
                  onToggleFavorite={() => toggleWishlist(product.id)}
                  rating={ratingsMap[product.id]}
                  stats={statsMap[product.id]}
                  badgeLabel={t("newBadge", language)}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </section>
      </Reveal>

      {/*======================
      BESTSELLERS
      =======================*/}

      {(initialLoading || bestsellers.length > 0) && (
        <Reveal>
          <section className="home-section-v2">
            <SectionHeader
              eyebrow={t("bestsellersEyebrow", language)}
              title={t("bestsellersTitle", language)}
              subtitle={t("bestsellersSubtitle", language)}
              viewAllHref="/categories"
              viewAllLabel={t("viewAll", language)}
            />
            {initialLoading ? (
              <ProductGridSkeleton />
            ) : (
              <div className="products-grid-v2">
                {bestsellers.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    format={format}
                    isFavorite={isInWishlist(String(product.id))}
                    onToggleFavorite={() => toggleWishlist(product.id)}
                    rating={ratingsMap[product.id]}
                    stats={statsMap[product.id]}
                    badgeLabel={t("bestsellerBadge", language)}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </section>
        </Reveal>
      )}

      {/*======================
      RECENTLY VIEWED
      =======================*/}

      {recentlyViewed.length > 0 && (
        <Reveal>
          <section className="home-section-v2">
            <SectionHeader title={t("recentlyViewedTitle", language)} />
            <div className="products-grid-v2">
              {recentlyViewed.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  format={format}
                  isFavorite={isInWishlist(String(product.id))}
                  onToggleFavorite={() => toggleWishlist(product.id)}
                  rating={ratingsMap[product.id]}
                  stats={statsMap[product.id]}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/*======================
      BRANDS
      =======================*/}

      {(initialLoading || brands.length > 0) && (
        <Reveal>
          <section className="home-section-v2">
            <SectionHeader title={t("brandsTitle", language)} />
            {initialLoading ? (
              <ChipsSkeleton />
            ) : (
              <div className="brand-strip">
                {brands.map((brand) => (
                  <span key={brand.id} className="brand-chip">
                    {brand.title}
                  </span>
                ))}
              </div>
            )}
          </section>
        </Reveal>
      )}

      {/*======================
      BLOG
      =======================*/}

      {(initialLoading || blogPosts.length > 0) && (
        <Reveal>
          <section className="home-section-v2">
            <SectionHeader
              eyebrow={t("blogEyebrow", language)}
              title={t("blogTitle", language)}
              viewAllHref="/blog"
              viewAllLabel={t("viewAll", language)}
            />
            {initialLoading ? (
              <ProductGridSkeleton count={3} />
            ) : (
              <div className="blog-grid">
                {blogPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
                    <div className="blog-card-media">
                      {post.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.cover_image} alt={post.title} />
                      ) : (
                        <span>نوربند</span>
                      )}
                    </div>
                    <div className="blog-card-body">
                      <h3>{post.title}</h3>
                      {post.excerpt && <p>{post.excerpt}</p>}
                      <span className="blog-card-date">
                        {formatLocalDate(post.created_at, language)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </Reveal>
      )}

      {/*======================
      AI ASSISTANT
      =======================*/}

      <Reveal>
        <section className="home-section-v2 ai-banner">
          <span className="ai-banner-icon">
            <Bot size={30} />
          </span>
          <div>
            <h2 className="section-title2">{t("aiTitle", language)}</h2>
            <p>{t("aiText", language)}</p>
          </div>
          <Link href="/site/search" className="primary-btn">
            {t("startChat", language)}
          </Link>
        </section>
      </Reveal>

      {/*======================
      ORDER TRACKING
      =======================*/}

      <Reveal>
        <section className="home-section-v2 track-banner">
          <div>
            <h2 className="section-title2">{t("orderTrackingTitle", language)}</h2>
            <p>{t("orderTrackingText", language)}</p>
          </div>
          <Link href="/site/orders" className="outline-btn">
            {t("viewOrders", language)}
          </Link>
        </section>
      </Reveal>

      {/*======================
      NEWSLETTER
      =======================*/}

      <Reveal>
        <section className="home-section-v2 newsletter-section">
          <div>
            <h2>{t("newsletterTitle", language)}</h2>
            <p>{t("newsletterText", language)}</p>
          </div>

          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder={t("emailPlaceholder", language)}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button type="submit" className="primary-btn" disabled={newsletterSubmitting}>
              <Mail size={16} />
              {newsletterSubmitting ? t("submitting", language) : t("subscribe", language)}
            </button>
          </form>
        </section>
      </Reveal>

      {/*======================
      TESTIMONIALS
      =======================*/}

      <Reveal>
        <section className="home-section-v2">
          <SectionHeader eyebrow={t("reviewsEyebrow", language)} title={t("reviewsTitle", language)} />

          {initialLoading ? (
            <TestimonialGridSkeleton />
          ) : reviews.length > 0 ? (
            <div className="testimonial-grid">
              {reviews.map((review) => (
                <div key={review.id} className="testimonial-card">
                  <Quote size={20} className="testimonial-quote-icon" />
                  <div className="testimonial-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? "#FBBF24" : "none"}
                        color="#FBBF24"
                      />
                    ))}
                  </div>
                  <p className="testimonial-text">{review.content}</p>
                  <div className="testimonial-author">
                    <strong>{review.author_name}</strong>
                    {review.product_title && <span> • {review.product_title}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">{t("noReviews", language)}</p>
          )}
        </section>
      </Reveal>

      {/*======================
      COMPARE FLOATING BAR
      =======================*/}

      {compareIds.length > 0 && (
        <div className="compare-bar">
          <strong>{compareIds.length} {t("compareBarSelected", language)}</strong>
          <div className="compare-bar-actions">
            <Link href="/site/compare" className="compare-bar-view">
              {t("compareBarView", language)}
            </Link>
            <button type="button" className="compare-bar-clear" onClick={clearCompare}>
              {t("compareBarClear", language)}
            </button>
          </div>
        </div>
      )}

      {/*======================
      QUICK VIEW MODAL
      =======================*/}

      <QuickViewModal
        product={quickViewProduct}
        format={format}
        isFavorite={quickViewProduct ? isInWishlist(String(quickViewProduct.id)) : false}
        onToggleFavorite={() => quickViewProduct && toggleWishlist(quickViewProduct.id)}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* دکمه‌های شناور (چت‌بات، واتساپ، تماس، بازگشت به بالا) حالا
          سراسری‌اند و در layout.tsx مونت می‌شوند، نه فقط اینجا — قبلا
          هم چت‌بات به‌اشتباه داخل یک دایره ۷۰ پیکسلی (floating-ai) فشرده
          شده بود که کاملا غیرقابل استفاده بود. */}

      {/* بنر پایین صفحه — چک‌لیست بخش ۱۱ */}
      <PromoBannerStrip zone="footer" />
    </main>
  );
}

// جایگزین قبلی: فقط متن «در حال بارگذاری...» — که باعث می‌شد صفحه هنگام
// لود اول تقریبا خالی به‌نظر برسد. حالا هر بخش شکل نهایی خودش را با
// حالت shimmer نشان می‌دهد تا پرش چیدمان (layout shift) هم کم شود.

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="products-grid-v2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton shimmer skeleton-card-media" />
          <div className="skeleton-card-body">
            <div className="skeleton shimmer skeleton-line" style={{ width: "80%" }} />
            <div className="skeleton shimmer skeleton-line" style={{ width: "50%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="category-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-category">
          <div className="skeleton shimmer skeleton-circle" />
          <div className="skeleton shimmer skeleton-line" style={{ width: "70%" }} />
        </div>
      ))}
    </div>
  );
}

export function ChipsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="brand-strip">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton shimmer skeleton-chip" />
      ))}
    </div>
  );
}

export function TestimonialGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="testimonial-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card" style={{ padding: 22, borderRadius: 22 }}>
          <div className="skeleton shimmer skeleton-line" style={{ width: "40%" }} />
          <div className="skeleton shimmer skeleton-line" style={{ width: "100%" }} />
          <div className="skeleton shimmer skeleton-line" style={{ width: "90%" }} />
          <div className="skeleton shimmer skeleton-line" style={{ width: "60%" }} />
        </div>
      ))}
    </div>
  );
}

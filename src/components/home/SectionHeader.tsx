import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

// هدر مشترک بخش‌های صفحه اصلی (دسته‌بندی‌ها، محصولات ویژه، جدیدترین‌ها،
// پرفروش‌ترین‌ها و ...) تا همه یک ظاهر یکسان و حرفه‌ای داشته باشند.
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "مشاهده همه",
}: SectionHeaderProps) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        <h2 className="section-title2">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>

      {viewAllHref && (
        <Link href={viewAllHref} className="section-view-all">
          {viewAllLabel}
          <ChevronLeft size={16} />
        </Link>
      )}
    </div>
  );
}

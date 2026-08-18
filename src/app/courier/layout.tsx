// این layout عمدا ساده و جدا از dashboard/layout.tsx نگه داشته شده —
// مأمور تحویل فقط باید همین یک صفحه (جستجوی سفارش + وارد کردن کد
// تحویل) را ببیند، نه منوی کامل مدیریت فروشگاه.

export default function CourierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="courier-panel">{children}</div>;
}

import { SITE_CONFIG } from "@/constants/site";

export default function ShippingPage() {
  return (
    <div className="container home-page">
      <h1 className="section-title">ارسال و پرداخت</h1>

      <div className="glass-card space-y-6">
        <div>
          <h2>🚚 روش ارسال</h2>
          <p>
            سفارشات از فروشگاه {SITE_CONFIG.name} در {SITE_CONFIG.address} برای
            مشتریان ارسال می‌شود. هزینه ارسال بر اساس مبلغ سبد خرید در
            صفحه پرداخت محاسبه و نمایش داده می‌شود.
          </p>
        </div>

        <div>
          <h2>🔑 تحویل با کد تایید</h2>
          <p>
            بعد از ثبت سفارش، یک کد ۴ رقمی به شما داده می‌شود. این کد را
            نزد خود نگه دارید و فقط هنگام تحویل گرفتن کالا به پیک بدهید؛
            بدون این کد، تحویل در سیستم ثبت نمی‌شود.
          </p>
        </div>

        <div>
          <h2>💳 روش‌های پرداخت</h2>
          <p>پرداخت آنلاین از طریق درگاه بانکی، و در صورت فعال بودن، پرداخت نقدی هنگام تحویل.</p>
        </div>

        <div>
          <h2>☎ تماس</h2>
          <p>{SITE_CONFIG.phones.join(" - ")}</p>
        </div>
      </div>
    </div>
  );
}

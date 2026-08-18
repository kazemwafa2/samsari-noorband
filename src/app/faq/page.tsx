import { SITE_CONFIG } from "@/constants/site";
import { safeJsonLdString } from "@/lib/seo/schema";

const FAQS = [
  {
    q: "چگونه سفارش ثبت کنم؟",
    a: "محصول مورد نظر را به سبد خرید اضافه کنید، وارد صفحه پرداخت شوید، آدرس و اطلاعات خود را وارد کنید و سفارش را نهایی کنید.",
  },
  {
    q: "روش‌های پرداخت کدام‌اند؟",
    a: "پرداخت آنلاین از طریق درگاه بانکی، و در برخی موارد پرداخت در محل (نقدی هنگام تحویل) در دسترس است.",
  },
  {
    q: "هزینه و زمان ارسال چقدر است؟",
    a: `ارسال به سراسر ${SITE_CONFIG.address.split("،")[0]} و مناطق اطراف انجام می‌شود. هزینه ارسال بر اساس مبلغ سبد خرید محاسبه و پیش از پرداخت نمایش داده می‌شود.`,
  },
  {
    q: "چطور می‌توانم سفارشم را پیگیری کنم؟",
    a: "از بخش «سفارشات من» در پروفایل کاربری، وضعیت هر سفارش قابل مشاهده است. همچنین یک کد تحویل به شما داده می‌شود که هنگام دریافت کالا باید به پیک اعلام کنید.",
  },
  {
    q: "آیا امکان مرجوع کردن کالا وجود دارد؟",
    a: "بله، در صورت وجود مشکل در کالا از صفحه سفارش خود می‌توانید درخواست مرجوعی ثبت کنید.",
  },
  {
    q: "چطور با پشتیبانی تماس بگیرم؟",
    a: `از طریق تماس تلفنی (${SITE_CONFIG.phones[0]}) یا واتساپ (${SITE_CONFIG.whatsapp.number}) در دسترس هستیم.`,
  },
];

export default function FaqPage() {
  return (
    <div className="container home-page">
      {/* FAQ Schema.org — برای نمایش بهتر در نتایج گوگل و موتورهای پاسخ‌گوی AI */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdString({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />

      <h1 className="section-title">سوالات متداول</h1>

      <div className="space-y-6">
        {FAQS.map((item) => (
          <div key={item.q} className="glass-card">
            <h2>{item.q}</h2>
            <p>{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

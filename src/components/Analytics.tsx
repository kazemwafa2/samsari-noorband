import Script from "next/script";

// قبلا هیچ Google Analytics یا Microsoft Clarity در پروژه نبود. چون من
// کد واقعی Measurement ID/Project ID شما را ندارم (و نباید یک آی‌دی
// ساختگی بگذارم — چیزی که آمار جعلی/اشتباه جمع کند بدتر از هیچی است)،
// این کامپوننت طوری نوشته شده که کاملا از env می‌خواند: تا وقتی
// NEXT_PUBLIC_GA_MEASUREMENT_ID یا NEXT_PUBLIC_CLARITY_PROJECT_ID را در
// .env.local نگذاری، هیچ اسکریپتی هم لود نمی‌شود (نه یک ID خالی که
// خطای کنسول بدهد).
//
// راه‌اندازی واقعی:
// 1) در Google Analytics یک property بساز → Measurement ID را (چیزی
//    شبیه G-XXXXXXXXXX) در NEXT_PUBLIC_GA_MEASUREMENT_ID بگذار.
// 2) در clarity.microsoft.com یک پروژه بساز → Project ID را در
//    NEXT_PUBLIC_CLARITY_PROJECT_ID بگذار.
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {clarityId && (
        <Script id="ms-clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}
    </>
  );
}

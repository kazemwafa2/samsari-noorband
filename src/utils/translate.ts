// src/utils/translate.ts


type Language =
| "fa"
| "prs"
| "ps"
| "en"
| "de"
| "tr"
| "ar"
| "ur"
| "it"
| "fr";



const DICTIONARY:any = {


en:{


"خوش آمدید":"Welcome",

"مهمان گرامی":"Dear Guest",

"مهمان عزیز":"Dear Guest",

"خانواده بزرگ نوربند جاغوری":"NOORBAND Jaghori Family",

"سیمساری نوربند جاغوری":
"NOORBAND Jaghori Mobile Store",


"از دیدار دوباره شما بسیار خوشحالیم":
"We are very happy to see you again",


"از دیدار شما خوشحالیم":
"We are happy to see you",


"همیشه آماده راهنمایی و پاسخگویی به شما است":
"Always ready to guide and answer you",


"راهنمایی":
"guidance",


"پشتیبانی":
"Support",


"سفارش":
"Order",


"سفارش شما":
"Your order",


"با موفقیت انجام شد":
"completed successfully",


"ثبت شد":
"registered successfully",


"پرداخت":
"Payment",


"تخفیف":
"Discount",


"تخفیف ویژه":
"Special discount",


"محصولات جدید":
"New products",


"محصولات ویژه":
"Special products",


"در حال جستجو":
"Searching",


"لطفاً چند لحظه صبر کنید":
"Please wait a moment",


"سپاسگزاریم":
"Thank you",


"خرید":
"Purchase",


"موفقیت":
"Success"

},





de:{


"خوش آمدید":"Willkommen",

"مهمان گرامی":"Sehr geehrter Gast",

"خانواده بزرگ نوربند جاغوری":
"NOORBAND Jaghori Familie",

"از دیدار شما خوشحالیم":
"Wir freuen uns, Sie zu sehen",

"پشتیبانی":
"Kundensupport",

"سفارش":
"Bestellung",

"پرداخت":
"Zahlung",

"تخفیف":
"Rabatt",

"محصولات جدید":
"Neue Produkte",

"سپاسگزاریم":
"Danke"

},





tr:{


"خوش آمدید":
"Hoş geldiniz",


"خانواده بزرگ نوربند جاغوری":
"NOORBAND Jaghori Ailesi",


"پشتیبانی":
"Destek",


"سفارش":
"Sipariş",


"پرداخت":
"Ödeme",


"تخفیف":
"İndirim",


"محصولات جدید":
"Yeni ürünler",


"سپاسگزاریم":
"Teşekkür ederiz"

},





ar:{


"خوش آمدید":
"أهلاً وسهلاً",


"خانواده بزرگ نوربند جاغوری":
"عائلة نوربند جاغوری الكبيرة",


"پشتیبانی":
"الدعم",


"سفارش":
"الطلب",


"پرداخت":
"الدفع",


"تخفیف":
"خصم",


"محصولات جدید":
"منتجات جديدة",


"سپاسگزاریم":
"شكراً لكم"

},





ps:{


"خوش آمدید":
"ښه راغلاست",


"خانواده بزرگ نوربند جاغوری":
"د نوربند جاغوری لویه کورنۍ",


"پشتیبانی":
"ملاتړ",


"سفارش":
"امر",


"تخفیف":
"تخفیف",


"محصولات جدید":
"نوي محصولات"

}

};






export async function translateMessage(
text:string,
language:string
){



// فارسی و دری بدون تغییر

if(
language==="fa" ||
language==="prs"
){

return text;

}





const lang =
DICTIONARY[language as Language];



if(!lang){

return text;

}




let result=text;



Object.keys(lang)

.forEach((key)=>{


result=result.replaceAll(
key,
lang[key]
);


});



return result;


}
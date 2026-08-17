import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE_CONFIG } from "@/constants/site";

export default async function manifest(): Promise<MetadataRoute.Manifest> {

// نام رسمی از منبع واحد SITE_CONFIG می‌آید تا با بقیه سایت (فوتر،
// فاکتور، SEO) یکسان باشد. قبلا اینجا مستقیم رشته «سمساری نوربند
// جاغوری» (با «س» به‌جای «سی») هارد‌کد شده بود که با نام رسمی سایت در
// همه‌جای دیگر پروژه فرق داشت.
let siteName: string = SITE_CONFIG.name;

// آیکون PWA/نصب روی موبایل (همان مربع آبی‌سرمه‌ای با حرف «N» که در
// تب مرورگر/صفحه اصلی گوشی دیده می‌شود) قبلا همیشه از دو فایل ثابت
// public/icon-192.png و public/icon-512.png خوانده می‌شد — یعنی حتی
// بعد از تغییر لوگو از پنل مدیریت (تنظیمات → برندینگ)، این آیکون خاص
// (favicon/PWA) همچنان همان «N» قدیمی باقی می‌ماند، چون آن صفحه فقط
// روی navbar/footer اثر می‌گذاشت نه روی این فایل. حالا همان logo_url
// که در پنل برندینگ آپلود می‌شود، در صورت وجود، به‌جای فایل‌های ثابت
// استفاده می‌شود؛ اگر ادمین چیزی آپلود نکرده باشد، دقیقا همان آیکون
// قبلی (fallback) نمایش داده می‌شود.
let logoUrl: string | null = null;

try{

const supabase = await createClient();

const { data } = await supabase
  .from("site_settings")
  .select("site_name, logo_url")
  .single();

  if(data?.site_name){

siteName = data.site_name;

}

  if(data?.logo_url){

logoUrl = data.logo_url;

}

}catch(error){

console.log("Manifest Error :",error);

}


return{

name:siteName,

short_name:"نوربند جاغوری",

description:
`سامانه خرید و فروش کالاهای دست دوم و نو - ${SITE_CONFIG.name}`,

start_url:"/",

display:"standalone",

background_color:"#ffffff",

theme_color:"#1e3a5f",

orientation:"portrait",

scope:"/",

id:"/",

categories:[
"shopping",
"business"
],

lang:"fa",

dir:"rtl",

prefer_related_applications:false,

related_applications:[],

icons: logoUrl ? [

{
src: logoUrl,
sizes: "192x192",
type: "image/png",
purpose: "any",
},

{
src: logoUrl,
sizes: "512x512",
type: "image/png",
purpose: "any",
},

] : [

{
src:"/icon-192.png",
sizes:"192x192",
type:"image/png"
},

{
src:"/icon-512.png",
sizes:"512x512",
type:"image/png"
},

{
src:"/favicon.ico",
sizes:"64x64",
type:"image/x-icon"
}

]

};

}

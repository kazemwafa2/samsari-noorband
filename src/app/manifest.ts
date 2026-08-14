import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE_CONFIG } from "@/constants/site";

export default async function manifest(): Promise<MetadataRoute.Manifest> {

// نام رسمی از منبع واحد SITE_CONFIG می‌آید تا با بقیه سایت (فوتر،
// فاکتور، SEO) یکسان باشد. قبلا اینجا مستقیم رشته «سمساری نوربند
// جاغوری» (با «س» به‌جای «سی») هارد‌کد شده بود که با نام رسمی سایت در
// همه‌جای دیگر پروژه فرق داشت.
let siteName: string = SITE_CONFIG.name;

try{

const supabase = await createClient();

const { data } = await supabase
  .from("site_settings")
  .select("site_name")
  .single();

  if(data?.site_name){

siteName = data.site_name;

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

icons:[

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

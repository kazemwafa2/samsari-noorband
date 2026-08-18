"use client";

import { useRouter } from "next/navigation";


export default function DashboardMenu(){

const router = useRouter();


const menu = [

{
title:"📦 محصولات",
path:"/dashboard/products"
},

{
title:"🏷 برندها",
path:"/dashboard/brands"
},

{
title:"📂 دسته‌بندی‌ها",
path:"/dashboard/categories"
},

{
title:"🛒 سفارشات",
path:"/dashboard/orders"
},

{
title:"👥 کاربران",
path:"/dashboard/users"
},

{
title:"🎁 تخفیف‌ها",
path:"/dashboard/discounts"
},

{
title:"🖼 بنرها و تبلیغات",
path:"/dashboard/banners"
},

{
title:"🔔 اعلان‌ها",
path:"/dashboard/notifications"
},

{
title:"📊 گزارشات",
path:"/dashboard/reports"
},

{
title:"📈 آمار",
path:"/dashboard/statistics"
},

{
title:"👁 بازدید سایت",
path:"/dashboard/analytics"
},

{
title:"❓ سوالات محصول",
path:"/dashboard/questions"
},

{
title:"💬 نظرات و امتیازها",
path:"/dashboard/comments"
},

{
title:"🕵️ Audit Log",
path:"/dashboard/audit-log"
},

{
title:"💾 بک‌آپ",
path:"/dashboard/backup"
},

{
title:"🧠 NOORBAND AI",
path:"/dashboard/ai"
},

{
title:"⚙️ تنظیمات",
path:"/dashboard/settings"
}

];


return(

<div
className="
card
backdrop-blur-xl
bg-white/10
border
border-white/20
rounded-3xl
p-5
shadow-lg
"
>


<h2 className="
text-xl
font-bold
mb-5
">
🧭 مدیریت سریع
</h2>



<div
className="
grid
grid-cols-2
md:grid-cols-3
gap-4
"
>


{
menu.map((item,index)=>(

<button

key={index}

onClick={()=>router.push(item.path)}

className="
rounded-2xl
bg-white/10
p-4
hover:bg-white/20
transition
text-center
"

>

{item.title}

</button>

))

}


</div>


</div>

);

}
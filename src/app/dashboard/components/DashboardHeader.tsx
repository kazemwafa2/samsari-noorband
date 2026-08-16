"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";

export default function DashboardHeader(){

const router = useRouter();


// اصلاح شد: قبلا این دکمه فقط یک کلید بی‌ربط در localStorage
// (`"user"`) را پاک می‌کرد که اصلا جایی نوشته/خوانده نمی‌شد؛ نشست
// واقعی Supabase (که در کوکی است) دست‌نخورده باقی می‌ماند، یعنی کاربر
// در واقع خارج نمی‌شد و با مراجعه‌ی بعدی به /dashboard دوباره وارد
// پنل می‌شد. حالا از همان signOut واقعی که در بقیه‌ی پروژه
// (src/components/auth/logout-button.tsx) استفاده می‌شود بهره می‌برد.
async function logout(){

await signOut();

router.replace("/login");
router.refresh();

}


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
flex
flex-col
sm:flex-row
justify-between
items-center
gap-4
"
>


<div>

<h1 className="
text-2xl
font-bold
">
⚙️ پنل مدیریت نوربند جاغوری
</h1>


<p className="
opacity-70
mt-2
">
مدیریت فروشگاه آنلاین NOORBAND Jaghori
</p>

</div>



<div className="
flex
gap-3
">


<button
className="
px-5
py-2
rounded-2xl
bg-white/20
"
onClick={()=>router.push("/")}
>
🏠 سایت
</button>



<button
className="
px-5
py-2
rounded-2xl
bg-red-500/20
"
onClick={logout}
>
🚪 خروج
</button>


</div>


</div>

);

}
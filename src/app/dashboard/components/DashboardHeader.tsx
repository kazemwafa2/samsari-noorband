"use client";

import { useRouter } from "next/navigation";

export default function DashboardHeader(){

const router = useRouter();


function logout(){

localStorage.removeItem("user");

router.push("/login");

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
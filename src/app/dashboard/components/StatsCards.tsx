"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/dashboard-stats";


export default function StatsCards(){


const [stats,setStats]=useState({

products:0,
orders:0,
users:0,
income:0

});



useEffect(()=>{

loadStats();

},[]);



async function loadStats(){

const data = await getDashboardStats();

setStats(data);

}



const cards=[

{
title:"📦 محصولات",
value:stats.products
},

{
title:"🛒 سفارشات",
value:stats.orders
},

{
title:"👥 کاربران",
value:stats.users
},

{
title:"💰 درآمد",
value:`${stats.income} افغانی`
}

];



return(

<div
className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-4
"
>


{

cards.map((card,index)=>(


<div

key={index}

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
text-lg
font-bold
">

{card.title}

</h2>



<p className="
text-3xl
font-bold
mt-3
">

{card.value}

</p>


</div>


))


}


</div>

);

}
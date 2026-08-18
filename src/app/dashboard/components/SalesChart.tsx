"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";


export default function SalesChart(){
  const supabase = createClient();


const [sales,setSales]=useState<any[]>([]);



useEffect(()=>{

loadSales();

},[]);



async function loadSales(){

// اصلاح شد: ستون "total" در جدول orders وجود ندارد (نام واقعی
// total_amount است) — قبلا این کوئری همیشه با خطا مواجه می‌شد و
// نمودار فروش همیشه خالی/صفر نشان داده می‌شد.
const {data,error}=await supabase

.from("orders")

.select("total_amount,created_at")

.order("created_at",{ascending:true});



if(error){

console.log(error);
return;

}



const months:any={};



data?.forEach((order:any)=>{


const date=new Date(order.created_at);

const month=date.getMonth()+1;


if(!months[month]){

months[month]=0;

}


months[month]+=Number(order.total_amount || 0);


});



const result=Object.keys(months).map((month)=>({

month:`ماه ${month}`,

value:months[month]

}));



setSales(result);


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
"
>


<h2 className="
text-xl
font-bold
mb-5
">
📊 نمودار فروش
</h2>



{

sales.length === 0 ? (

<p>
هنوز فروش ثبت نشده است
</p>

)

:

(

<div className="space-y-4">


{

sales.map((item,index)=>(


<div key={index}>


<div className="
flex
justify-between
mb-2
">

<span>
{item.month}
</span>


<span>
{item.value} افغانی
</span>


</div>



<div className="
h-3
rounded-full
bg-white/20
overflow-hidden
">

<div

className="
h-full
rounded-full
bg-purple-500
"

style={{

width:`${Math.min(item.value / 100,100)}%`

}}

>

</div>


</div>


</div>


))


}


</div>

)


}



</div>

);

}
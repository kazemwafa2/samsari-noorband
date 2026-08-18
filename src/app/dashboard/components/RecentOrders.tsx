"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";


export default function RecentOrders(){
  const supabase = createClient();

const [orders,setOrders]=useState<any[]>([]);


useEffect(()=>{

loadOrders();

},[]);



async function loadOrders(){


const {data,error}=await supabase

.from("orders")

.select("*")

.order("created_at",{ascending:false})

.limit(5);



if(error){

console.log(error);
return;

}


setOrders(data || []);


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
mb-4
">
🛒 آخرین سفارش‌ها
</h2>



{

orders.length === 0 ? (

<p>
هنوز سفارشی ثبت نشده است
</p>

)

:(

<div className="space-y-3">


{

orders.map((order,index)=>(


<div

key={index}

className="
rounded-2xl
bg-white/10
p-4
"

>


<div className="
flex
justify-between
">

<span>
کد سفارش:
{order.id}
</span>


<span>
{order.status || "در انتظار"}
</span>


</div>



<p className="mt-2">
💰 مبلغ:
{order.total || 0} افغانی
</p>



<p>
📅 تاریخ:
{order.created_at}
</p>


</div>


))


}


</div>

)


}


</div>

);


}
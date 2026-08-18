"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";


export default function ProductOverview(){
  const supabase = createClient();


const [products,setProducts]=useState<any[]>([]);



useEffect(()=>{

loadProducts();

},[]);



async function loadProducts(){

// اصلاح شد: ستون "name" در جدول products وجود ندارد (نام واقعی
// title است) — قبلا این کوئری همیشه خطا می‌داد و این ویجت پنل
// مدیریت همیشه پیام «محصولی ثبت نشده است» را نشان می‌داد، حتی وقتی
// محصول موجود بود.
const {data,error}=await supabase

.from("products")

.select("title,category,stock")

.order("created_at",{ascending:false})

.limit(5);



if(error){

console.log(error);
return;

}


setProducts(data || []);


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
📦 وضعیت محصولات
</h2>



{

products.length === 0 ? (

<p>
محصولی ثبت نشده است
</p>

)

:

(

<div className="space-y-3">


{

products.map((product,index)=>(


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
{product.title}
</span>


<span>
موجودی:
{product.stock || 0}
</span>


</div>



<p className="mt-2 opacity-70">

دسته:
{product.category || "بدون دسته"}

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
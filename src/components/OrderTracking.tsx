"use client";

import {useState} from "react";

export default function OrderTracking(){


const [trackingCode,setTrackingCode]=useState("");


const handleTracking=()=>{

if(!trackingCode.trim()) return;

alert("در نسخه نهایی پروژه، وضعیت سفارش از Supabase دریافت خواهد شد.");

};


return(

<div className="glass contact-page">


<h2>

📦 رهگیری سفارش

</h2>


<input

type="text"

placeholder="کد رهگیری سفارش را وارد کنید..."

value={trackingCode}

onChange={(e)=>

setTrackingCode(

e.target.value

)

}

/>


<button

className="primary-btn"
onClick={handleTracking}

>

رهگیری سفارش

</button>


<p>

وضعیت سفارش شما پس از اتصال به Supabase به صورت لحظه‌اى نمایش داده خواهد شد.

</p>


</div>

);


}
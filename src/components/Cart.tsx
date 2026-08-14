"use client";

import {useState} from "react";


export default function Cart(){


const [total]=useState(0);

const [discount]=useState(0);

const [delivery]=useState(0);



return(


<div className="glass cart-container">


<h2>

🛒 سبد خرید

</h2>



<div className="cart-info">


<p>

تعداد محصولات : 0

</p>


<p>

تخفیف : {discount}

</p>


<p>

هزینه ارسال : {delivery}

</p>


<p>

جمع کل : {total}

</p>



</div>




<div className="cart-buttons">


<button className="primary-btn">

ادامه خرید

</button>



<button className="primary-btn">

ثبت سفارش

</button>



<button className="primary-btn">

پرداخت

</button>


</div>



</div>


);


}
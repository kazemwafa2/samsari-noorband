import { supabase } from "./supabase";


export async function getDashboardStats(){


/* تعداد محصولات */

const {
count: productsCount
}= await supabase

.from("products")

.select("*", {
count:"exact",
head:true
});



/* تعداد کاربران */

const {
count: usersCount
}= await supabase

.from("profiles")

.select("*", {
count:"exact",
head:true
});



/* تعداد سفارشات */

const {
count: ordersCount
}= await supabase

.from("orders")

.select("*", {
count:"exact",
head:true
});



/* محاسبه درآمد — اصلاح شد: قبلا ستون "total" کوئری می‌شد که اصلا در
   جدول orders وجود ندارد (نام واقعی ستون total_amount است)، یعنی این
   کوئری همیشه با خطا مواجه می‌شد و درآمد صفحه‌ی مدیریت همیشه صفر
   نشان داده می‌شد. */

const {
data:orders
}= await supabase

.from("orders")

.select("total_amount");



let income = 0;


orders?.forEach((order:any)=>{

income += Number(order.total_amount || 0);

});




return {

products: productsCount || 0,

users: usersCount || 0,

orders: ordersCount || 0,

income

};


}
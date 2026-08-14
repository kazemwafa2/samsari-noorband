//==================================
// NOORBAND SUPABASE SYSTEM
//==================================

import {createClient}
from "@supabase/supabase-js";


//==================================
// ENV
//==================================

const supabaseUrl=

process.env
.NEXT_PUBLIC_SUPABASE_URL || "";


const supabaseKey=

process.env
.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";



//==================================
// CLIENT
//==================================

export const supabase=

createClient(

supabaseUrl,

supabaseKey

);


//==================================
// PRODUCTS
//==================================

export async function getProducts(){

return await supabase

.from("products")

.select("*");

}



//==================================
// PRODUCT
//==================================

export async function getProduct(

id:string

){

return await supabase

.from("products")

.select("*")

.eq("id",id)

.single();

}



//==================================
// SEARCH
//==================================

export async function searchProducts(

text:string

){

return await supabase

.from("products")

.select("*")

.ilike(

"title",

`%${text}%`

);

}



//==================================
// DISCOUNT
//==================================

export async function getDiscounts(){

// اصلاح شد: قبلا discount=true بود، ولی discount عدد درصد است نه
// بولین، پس این کوئری هیچ‌وقت نتیجه نمی‌داد.
return await supabase

.from("products")

.select("*")

.gt(

"discount",

0

);

}



//==================================
// ORDERS
//==================================

export async function getOrders(

id:string

){

return await supabase

.from("orders")

.select("*")

.eq(

"user_id",

id

);

}



//==================================
// USERS
//==================================

export async function getUser(

id:string

){

return await supabase

.from("profiles")

.select("*")

.eq("id",id)

.single();

}



//==================================
// LOGIN
//==================================

export async function signIn(

email:string,

password:string

){

return await supabase.auth

.signInWithPassword({

email,

password

});

}



//==================================
// REGISTER
//==================================

export async function signUp(

email:string,

password:string

){

return await supabase.auth

.signUp({

email,

password

});

}



//==================================
// LOGOUT
//==================================

export async function signOut(){

return await supabase.auth

.signOut();

}



//==================================
// SESSION
//==================================

export async function getSession(){

return await supabase.auth

.getSession();

}



//==================================
// WISHLIST
//==================================

export async function getWishlist(

id:string

){

return await supabase

.from("wishlist")

.select("*")

.eq(

"user_id",

id

);

}



//==================================
// NOTIFICATIONS
//==================================

export async function getNotifications(

id:string

){

return await supabase

.from("notifications")

.select("*")

.eq(

"user_id",

id

);

}

// نکته: بخش‌های قدیمی «CHATBOT» (جدول chat) و «AI SEARCH» (جدول
// search) از اینجا حذف شدند — نه در این فایل جایی صدا زده می‌شدند و
// نه جدولشان اصلا در schema.sql وجود داشت (کد مرده‌ای که هیچ‌وقت کار
// نمی‌کرد). چت واقعی هوش مصنوعی از src/ai/* و جستجوی واقعی از
// src/ai/search.ts انجام می‌شود.
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import { useCartStore } from '@/store/cart'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

import { toast } from 'sonner'

import Image from 'next/image'
import Link from 'next/link'

import {
ShoppingCart,
Plus,
Minus,
Loader2,
MapPin,
Phone,
Mail,
Truck,
ShieldCheck,
CreditCard
} from 'lucide-react'

import {
generateOrderNumber,
generateOrderCode
} from '@/lib/utils/order'

import {
formatPrice
} from '@/lib/utils/helpers'

import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { t } from '@/lib/i18n/dictionaries'
import { useSiteSettings } from '@/lib/site-settings'


function getCheckoutSchema(language: string){

return z.object({

shipping_name:
z.string()
.min(
2,
t('nameMinLengthError', language as any)
),

shipping_phone:
z.string()
.min(
10,
t('invalidPhoneError', language as any)
),

shipping_email:
z.string()
.email()
.optional()
.or(z.literal('')),

province_id:
z.string()
.uuid(
t('selectProvinceError', language as any)
),

district_id:
z.string()
.uuid(
t('selectDistrictError', language as any)
),

shipping_address:
z.string()
.min(
10,
t('fullAddressRequiredError', language as any)
),

shipping_postal_code:
z.string()
.optional(),

user_note:
z.string()
.optional()

})

}


type CheckoutForm =
z.infer<
ReturnType<typeof getCheckoutSchema>
>


interface Province{

id:string

name:string

country_id:string

}


interface District{

id:string

name:string

province_id:string

}


export default function CheckoutPage(){

const router =
useRouter()

const supabase =
createClient()

const { language } = useLanguage()


const {

items,
getSubtotal,
getDiscountAmount,
getTotal,
updateQuantity,
clearCart

} = useCartStore()


const [
loading,
setLoading
] = useState(false)


const [
user,
setUser
] = useState<any>(null)


const [
provinces,
setProvinces
] = useState<Province[]>([])


const [
districts,
setDistricts
] = useState<District[]>([])


const [
shippingPrice,
setShippingPrice
] = useState(0)

// نکته اصلاح‌شده: قبلا هزینه ارسال (۲۰۰ افغانی، رایگان بالای ۵۰۰۰) در
// همین فایل هارد‌کد بود. حالا از پنل مدیریت (تنظیمات → برندینگ) خوانده
// می‌شود تا ادمین بتواند بدون نیاز به تغییر کد، هزینه ارسال یا آستانه
// ارسال رایگان را عوض کند.
const { shippingFlatRate, shippingFreeThreshold } = useSiteSettings()


const [
coupon,
setCoupon
] = useState('')

const [
appliedDiscount,
setAppliedDiscount
] = useState<{ id: number; title: string; percent: number } | null>(null)

const [
couponError,
setCouponError
] = useState('')

const [
applyingCoupon,
setApplyingCoupon
] = useState(false)


//==================================
// روش پرداخت — قبلا اصلا وجود نداشت؛ سفارش همیشه بدون هیچ پرداختی
// (نه آنلاین نه نقدی) مستقیم "موفق" اعلام می‌شد و کاربر هیچ‌وقت به
// درگاه پرداخت (که در src/app/site/payment و src/app/api/payment از
// قبل کامل ساخته شده بود) هدایت نمی‌شد.
//==================================

const [
paymentMethod,
setPaymentMethod
] = useState<'cod'|'online'>('online')

const [
codEnabled,
setCodEnabled
] = useState(false)

const [
minOrderAmount,
setMinOrderAmount
] = useState(0)


const form =
useForm<CheckoutForm>({

resolver:
zodResolver(
getCheckoutSchema(language)
)

})



useEffect(()=>{

async function init(){

try{

const {

data:{
user
}

} = await
supabase
.auth
.getUser()


if(!user){

router.push(
'/login?redirect=/site/checkout'
)

return

}


setUser(user)


const {

data:country

} = await
supabase
.from('countries')
.select('id')
.eq(
'code',
'AF'
)
.single()


if(!country?.id){

return

}


const {

data:provinceData,

error

} = await
supabase
.from('provinces')
.select('*')
.eq(
'country_id',
country.id
)
.order('name')


if(error){

throw error

}


setProvinces(

provinceData || []

)


//==================================
// تنظیمات پرداخت (پرداخت در محل فعال است؟ حداقل مبلغ سفارش؟)
//==================================

const {

data:settings

} = await
supabase
.from('site_settings')
.select('cod_enabled, min_order_amount')
.eq('id', 1)
.single()


if(settings){

setCodEnabled(!!settings.cod_enabled)
setMinOrderAmount(Number(settings.min_order_amount) || 0)

if(!settings.cod_enabled){
setPaymentMethod('online')
}

}


}catch(error:any){

toast.error(

error.message ||

t('fetchInfoError', language)

)

}


}


init()

},[
router,
supabase
])
//==================================
// گرفتن ولسوالی ها
//==================================

async function loadDistricts(

provinceId:string

){

try{

const {

data,
error

}=await supabase
.from('districts')
.select('*')
.eq(
'province_id',
provinceId
)
.order('name')


if(error){

throw error

}


setDistricts(

data || []

)

}catch(error:any){

toast.error(

error.message ||

t('fetchDistrictError', language)

)

}


}



//==================================
// محاسبه هزینه ارسال
//==================================

useEffect(()=>{


if(

getSubtotal()

>=

shippingFreeThreshold

){

setShippingPrice(0)

}else{

setShippingPrice(shippingFlatRate)

}


},[
items,
getSubtotal,
shippingFlatRate,
shippingFreeThreshold
])




//==================================
// ثبت سفارش
//==================================

//==================================
// اعمال کد تخفیف — قبلا این state تعریف شده بود ولی هیچ‌جا استفاده
// نمی‌شد؛ یعنی جدول discounts و پنل مدیریتش کار می‌کرد ولی مشتری
// هیچ‌وقت نمی‌توانست واقعا از تخفیف در پرداخت استفاده کند.
//==================================

async function applyCoupon(){

setCouponError('')

if(!coupon.trim()){
setCouponError(t('enterCouponCodeError', language))
return
}

setApplyingCoupon(true)

const { data, error } = await supabase
.from('discounts')
.select('id, title, percent, status, expire')
.ilike('title', coupon.trim())
.eq('status', true)
.maybeSingle()

setApplyingCoupon(false)

if(error || !data){
setCouponError(t('invalidCouponError', language))
setAppliedDiscount(null)
return
}

if(data.expire && new Date(data.expire) < new Date()){
setCouponError(t('expiredCouponError', language))
setAppliedDiscount(null)
return
}

setAppliedDiscount({ id: data.id, title: data.title, percent: data.percent })
toast.success(t('couponAppliedMessage', language).replace('{title}', data.title).replace('{percent}', String(data.percent)))
}

function getCouponDiscountAmount(){
if(!appliedDiscount) return 0
return Math.round((getSubtotal() * appliedDiscount.percent) / 100)
}

async function onSubmit(

data:CheckoutForm

){


if(!user){

toast.error(

t('loginFirstError', language)

)

return

}



if(

items.length===0

){

toast.error(

t('checkoutCartEmptyError', language)

)

return

}


//==================================
// حداقل مبلغ سفارش — قبلا اصلا بررسی نمی‌شد
//==================================

if(

minOrderAmount > 0 &&
getTotal() + shippingPrice - getCouponDiscountAmount() < minOrderAmount

){

toast.error(
t('minOrderAmountError', language).replace('{amount}', formatPrice(minOrderAmount))
)

return

}



setLoading(true)


try{


// بررسی موجودی واقعی قبل از ثبت سفارش — قبلا این‌جا هیچ چکی نبود؛
// یعنی می‌شد محصولی که در همین لحظه توسط کس دیگری خریداری شده یا
// اصلا موجودی‌اش صفر شده را هم خرید. موجودی «تازه» از دیتابیس خوانده
// می‌شود، نه چیزی که در سبد خرید کش شده (که ممکن است قدیمی باشد).
const productIds = items.map((item) => Number(item.product_id))

const { data: freshProducts, error: stockCheckError } = await supabase
  .from("products")
  .select("id, title, stock")
  .in("id", productIds)

if (stockCheckError) {
  throw new Error(t('stockCheckErrorMsg', language))
}

const stockByProductId = new Map<number, { title: string; stock: number }>(
  (freshProducts || []).map((p: any) => [p.id, { title: p.title, stock: p.stock }])
)

const insufficientItems = items.filter((item) => {
  const fresh = stockByProductId.get(Number(item.product_id))
  return !fresh || fresh.stock < item.quantity
})

if (insufficientItems.length > 0) {
  const names = insufficientItems
    .map((item) => {
      const fresh = stockByProductId.get(Number(item.product_id))
      return t('stockInsufficientItemText', language)
        .replace('{title}', item.title)
        .replace('{stock}', String(fresh?.stock ?? 0))
    })
    .join("، ")

  toast.error(t('insufficientStockErrorMsg', language).replace('{names}', names))
  setLoading(false)
  return
}


const{

data:status

}=await supabase
.from(
'order_statuses'
)
.select('id')
.eq(
'name',
'pending'
)
.single()



if(!status?.id){

throw new Error(

t('orderStatusNotFoundError', language)

)

}



const subtotal=

getSubtotal()


const total=

getTotal()

+

shippingPrice

-

getCouponDiscountAmount()



const orderNumber=

generateOrderNumber()


const orderCode=

generateOrderCode()




//==================================
// ساخت سفارش
//==================================


const{

data:order,

error:orderError

}=await supabase
.from('orders')
.insert({

order_number:
orderNumber,

order_code:
orderCode,

user_id:
user.id,

...data,

subtotal,

shipping_cost:
shippingPrice,

total_amount:
total,

status_id:
status.id,

discount_id:
appliedDiscount?.id ?? null,

coupon_code:
appliedDiscount?.title ?? null,

payment_method:
paymentMethod


})
.select()
.single()



if(orderError){

throw orderError

}




//==================================
// آیتم های سفارش
//==================================


const orderItems=

items.map(item=>({

order_id:
order.id,

product_id:
item.product_id,

product_name:
item.title,

product_image:
item.image,

product_price:
item.price,

final_price:
item.final_price,

quantity:
item.quantity,

total_price:

item.final_price*

item.quantity


}))



const{

error:itemError

}=await supabase
.from(
'order_items'
)
.insert(
orderItems
)


if(itemError){

throw itemError

}
//==================================
// ثبت تاریخچه سفارش
//==================================

await supabase
.from(
'order_status_history'
)
.insert({

order_id:
order.id,

to_status_id:
status.id,

changed_by:
user.id

})


//==================================
// کاهش موجودی — قبلا این مرحله اصلا وجود نداشت؛ سفارش ثبت می‌شد ولی
// موجودی محصول هیچ‌وقت کم نمی‌شد. از تابع اتمیک decrement_product_stock
// (بخش ۱۴ در db/schema.sql) استفاده می‌شود تا حتی در خرید هم‌زمان چند
// نفر، موجودی هرگز منفی نشود. اگر برای یک قلم موجودی به‌اندازه کافی
// نبود (مثلا رقیب لحظه‌ای همون تعداد آخر را خرید)، آن یک قلم را لاگ
// می‌کنیم و پیام هشدار می‌دهیم، ولی چون سفارش و پرداخت قبلا با موفقیت
// ثبت شده، کل سفارش را لغو نمی‌کنیم — این مورد باید توسط ادمین از
// داشبورد سفارش‌ها بررسی و برای مشتری حل شود (رفاند/جایگزینی).
const stockWarnings: string[] = []

for (const item of items) {
  const { error: stockError } = await supabase.rpc("decrement_product_stock", {
    p_product_id: Number(item.product_id),
    p_quantity: item.quantity,
  })

  if (stockError) {
    console.log("STOCK DECREMENT ERROR:", item.title, stockError.message)
    stockWarnings.push(item.title)
  }
}

if (stockWarnings.length > 0) {
  toast.warning(
    t('stockRaceConditionWarning', language).replace('{names}', stockWarnings.join("، "))
  )
}


clearCart()


//==================================
// هدایت بر اساس روش پرداخت — قبلا اینجا صرف‌نظر از روش پرداخت،
// مستقیم به صفحه موفقیت هدایت می‌شد؛ یعنی حتی برای پرداخت آنلاین هم
// کاربر هیچ‌وقت واقعا به درگاه (زرین‌پال) نمی‌رفت و سفارش بدون پرداخت
// واقعی "ثبت‌شده" حساب می‌شد. حالا فقط سفارش‌های پرداخت‌درمحل مستقیم
// به صفحه موفقیت می‌روند؛ سفارش‌های آنلاین به /site/payment هدایت
// می‌شوند تا واقعا پرداخت انجام شود (صفحه موفقیت نهایی بعد از تایید
// پرداخت توسط api/payment/callback نشان داده خواهد شد).
//==================================

if(paymentMethod === 'online'){

toast.success(
t('orderPlacedRedirectingPayment', language)
)

router.push(
`/site/payment?order_id=${order.id}`
)

}else{

toast.success(

t('orderPlacedSuccessMessage', language)

)

router.push(

`/orders/${order.id}/success`

)

}


}catch(error:any){


toast.error(

error.message ||

t('orderPlacementError', language)

)


}finally{


setLoading(false)


}


}



//==================================
// سبد خرید خالی
//==================================

if(

items.length===0

){

return(

<div
className="
max-w-4xl
mx-auto
p-6
text-center
"
>

<ShoppingCart
className="
w-20
h-20
mx-auto
text-gray-400
mb-5
"
/>


<h1
className="
text-3xl
font-bold
mb-4
"
>

{t('checkoutCartEmptyError', language)}

</h1>


<p
className="
text-gray-500
mb-5
"
>

{t('checkoutCartEmptyText', language)}

</p>


<Link
href="/"
>

<Button>

{t('viewProductsLink', language)}

</Button>

</Link>


</div>

)

}



//==================================
// صفحه اصلی پرداخت
//==================================

return(

<div
className="
max-w-7xl
mx-auto
p-6
"
>

<h1
className="
text-3xl
font-bold
mb-8
"
>

{t('completeOrderTitle', language)}

</h1>


<div
className="
mb-6
grid
grid-cols-1
md:grid-cols-3
gap-4
"
>

<div
className="
rounded-xl
border
p-5
text-center
"
>

<Truck
className="
mx-auto
mb-3
"
/>

{t('fastShippingBadge', language)}

</div>


<div
className="
rounded-xl
border
p-5
text-center
"
>

<ShieldCheck
className="
mx-auto
mb-3
"
/>

{t('secureTransactionBadge', language)}

</div>


<div
className="
rounded-xl
border
p-5
text-center
"
>

<CreditCard
className="
mx-auto
mb-3
"
/>

{t('purchaseGuaranteeBadge', language)}

</div>

</div>


<form

onSubmit={

form.handleSubmit(
onSubmit
)

}

>

<div
className="
grid
grid-cols-1
lg:grid-cols-3
gap-6
"
>
{/*========================
فرم اطلاعات مشتری
========================*/}

<div className="lg:col-span-2">

<div
className="
bg-white
rounded-2xl
shadow-lg
p-6
space-y-5
"
>

<h2
className="
text-xl
font-bold
"
>

{t('deliveryInfoTitle', language)}

</h2>


<div
className="
grid
md:grid-cols-2
gap-4
"
>

{/* نام */}

<div>

<label>

{t('fullNameLabel', language)}

</label>

<Input

placeholder={t('fullNamePlaceholder', language)}

{...form.register(
"shipping_name"
)}

/>

</div>


{/* شماره تماس */}

<div>

<label>

{t('phoneNumberLabel', language)}

</label>

<Input

placeholder="
07xxxxxxxx
"

{...form.register(
"shipping_phone"
)}

/>

</div>


{/* ایمیل */}

<div>

<label>

{t('emailLabel', language)}

</label>

<Input

type="email"

placeholder="
example@gmail.com
"

{...form.register(
"shipping_email"
)}

/>

</div>



{/* کد پستی */}

<div>

<label>

{t('postalCodeLabel', language)}

</label>

<Input

placeholder="
1001
"

{...form.register(
"shipping_postal_code"
)}

/>

</div>



{/* ولایت */}

<div>

<label>

{t('provinceLabel', language)}

</label>

<select

className="
w-full
rounded-xl
border
p-3
"

{...form.register(
"province_id"
)}

onChange={(e)=>{

loadDistricts(
e.target.value
)

}}

>

<option value="">

{t('selectProvincePlaceholder', language)}

</option>


{

provinces.map(

(item)=>(

<option

key={item.id}

value={item.id}

>

{item.name}

</option>

)

)

}

</select>

</div>



{/* ولسوالی */}

<div>

<label>

{t('districtLabel', language)}

</label>

<select

className="
w-full
rounded-xl
border
p-3
"

{...form.register(
"district_id"
)}

>

<option value="">

{t('selectDistrictPlaceholder', language)}

</option>


{

districts.map(

(item)=>(

<option

key={item.id}

value={item.id}

>

{item.name}

</option>

)

)

}

</select>

</div>


</div>


{/* آدرس */}

<div>

<label>

{t('fullAddressLabel', language)}

</label>

<Textarea

rows={4}

placeholder={t('fullAddressPlaceholder', language)}

{...form.register(
"shipping_address"
)}

/>

</div>



{/* یادداشت */}

<div>

<label>

{t('orderNotesLabel', language)}

</label>

<Textarea

rows={3}

placeholder={t('orderNotesPlaceholder', language)}

{...form.register(
"user_note"
)}

/>

</div>

</div>

</div>
{/*=========================
خلاصه سفارش
=========================*/}

<div className="space-y-6">

<div
className="
bg-white
rounded-2xl
shadow-lg
p-6
"
>

<h2
className="
text-xl
font-bold
mb-5
"
>

{t('orderSummaryTitle', language)}

</h2>


<div className="space-y-4">

{

items.map((item)=>(

<div

key={item.product_id}

className="
flex
items-center
gap-3
border-b
pb-4
"

>

<div
className="
relative
w-20
h-20
rounded-xl
overflow-hidden
bg-gray-100
"
>

{

item.image && (

<Image

src={item.image}

alt={item.title}

fill

className="
object-cover
"

/>

)

}

</div>



<div className="flex-1">

<p
className="
font-bold
truncate
"
>

{item.title}

</p>


<p
className="
text-sm
text-gray-500
"
>

{t('quantityLabel', language)} :

{item.quantity}

</p>


<p
className="
text-green-600
font-bold
"
>

{formatPrice(
item.final_price
)}

</p>

</div>




<div
className="
flex
items-center
gap-2
"
>

<button

type="button"

className="
p-2
rounded-lg
hover:bg-gray-100
"

onClick={()=>{

updateQuantity(

item.product_id,

item.quantity-1

)

}}

>

<Minus size={16}/>

</button>


<span>

{item.quantity}

</span>


<button

type="button"

className="
p-2
rounded-lg
hover:bg-gray-100
"

onClick={()=>{

updateQuantity(

item.product_id,

item.quantity+1

)

}}

>

<Plus size={16}/>

</button>


</div>

</div>

))

}


</div>



<Separator className="my-6"/>


<div className="space-y-4">

<div
className="
flex
justify-between
"
>

<span>

{t('itemsSubtotalLabel', language)}

</span>


<span>

{formatPrice(

getSubtotal()

)}

</span>

</div>


{/* روش پرداخت — قبلا این بخش اصلا در UI وجود نداشت؛ سفارش همیشه
بدون انتخاب روش پرداخت و بدون رفتن به درگاه ثبت می‌شد */}
<div className="space-y-2">

<p className="font-bold">{t('paymentMethodLabel', language)}</p>

<label
className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer"
>
<input
type="radio"
name="paymentMethod"
value="online"
checked={paymentMethod === 'online'}
onChange={() => setPaymentMethod('online')}
/>
{t('onlinePaymentOption', language)}
</label>

{codEnabled && (
<label
className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer"
>
<input
type="radio"
name="paymentMethod"
value="cod"
checked={paymentMethod === 'cod'}
onChange={() => setPaymentMethod('cod')}
/>
{t('codPaymentOption', language)}
</label>
)}

</div>


{/* کد تخفیف — قبلا این بخش اصلا در UI وجود نداشت */}
<div style={{ display: "flex", gap: "8px" }}>
<input
type="text"
placeholder={t('couponCodeLabel', language)}
value={coupon}
onChange={(e)=>setCoupon(e.target.value)}
disabled={!!appliedDiscount}
/>
{!appliedDiscount ? (
<Button type="button" onClick={applyCoupon} disabled={applyingCoupon}>
{applyingCoupon ? t('checkingText', language) : t('applyButtonLabel', language)}
</Button>
) : (
<Button type="button" onClick={()=>{ setAppliedDiscount(null); setCoupon(''); }}>
{t('removeCouponButton', language)}
</Button>
)}
</div>

{couponError && <p style={{ color: "red" }}>{couponError}</p>}

{appliedDiscount && (
<div className="flex justify-between text-green-600">
<span>{t('appliedCouponDisplay', language).replace('{title}', appliedDiscount.title).replace('{percent}', String(appliedDiscount.percent))}</span>
<span>-{formatPrice(getCouponDiscountAmount())}</span>
</div>
)}



{

getDiscountAmount()>0 && (

<div
className="
flex
justify-between
text-green-600
"
>

<span>

{t('discountLabel', language)}

</span>


<span>

-

{formatPrice(

getDiscountAmount()

)}

</span>

</div>

)

}



<div
className="
flex
justify-between
"
>

<span>

{t('shippingCostLabel', language)}

</span>


<span>

{
shippingPrice === 0
?
t('freeLabel', language)
:
formatPrice(shippingPrice)
}

</span>

</div>


<Separator/>


<div
className="
flex
justify-between
text-xl
font-bold
"
>

<span>

{t('finalAmountLabel', language)}

</span>


<span
className="
text-primary
"
>

{formatPrice(

getTotal() + shippingPrice - getCouponDiscountAmount()

)}

</span>

</div>

</div>



<Button

type="submit"

disabled={loading}

className="
w-full
mt-6
py-6
text-lg
"

>

{

loading

?

<>

<Loader2
className="
animate-spin
ml-2
"
/>

{t('placingOrderText', language)}

</>

:

t('placeOrderButton', language)

}


</Button>


</div>

</div>


</div>

</form>

</div>

)

}
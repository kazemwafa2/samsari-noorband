import Link from "next/link";

export default function NotFound() {

return(

<div className="glass contact-page">

<h1>

<span className="not-found-icon">404</span>

</h1>


<h2>

صفحه مورد نظر پیدا نشد.

</h2>


<p>

ممکن است آدرس صفحه اشتباه باشد یا حذف شده باشد.

</p>


<Link href="/">

بازگشت به صفحه اصلی

</Link>


</div>

);

}
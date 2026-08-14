import { supabase } from "./client";

// این تابع هیچ‌جای پروژه صدا زده نمی‌شود (dead code) و callback‌اش
// فقط payload را console.log می‌کرد بدون این‌که واقعا کاری با آن انجام
// دهد (مثلا رفرش لیست محصولات). برای اینکه واقعا مفید باشد، حالا یک
// callback از بیرون می‌گیرد — مثال استفاده:
//
//   useEffect(() => {
//     const channel = realtimeProducts((payload) => {
//       // مثلا: setProducts(prev => ...)
//     });
//     return () => { channel.unsubscribe(); };
//   }, []);
export function realtimeProducts(onChange: (payload: unknown) => void) {
  return supabase
    .channel("products")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products" },
      (payload) => {
        onChange(payload);
      }
    )
    .subscribe();
}

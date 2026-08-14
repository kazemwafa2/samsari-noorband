import { supabase } from "@/lib/supabase";
import { SITE_CONFIG } from "@/constants/site";

// فید محصولات برای Google Merchant Center (که پیش‌نیاز نمایش محصولات
// در Google Shopping است). قبلا چنین فایلی اصلا وجود نداشت. این فید
// کاملا از داده واقعی محصولات ساخته می‌شود — هیچ محصول یا قیمت
// ساختگی در آن نیست.
//
// آدرس این فید: /feed/google-merchant.xml
// در Merchant Center: Products → Feeds → Scheduled fetch → همین آدرس

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samsari-noorband.com";

  const { data: products, error } = await supabase
    .from("products")
    .select("id, title, description, price, discount, stock, image, category, is_available")
    .eq("is_available", true)
    .limit(5000);

  if (error) {
    console.log("GOOGLE MERCHANT FEED ERROR:", error.message);
  }

  const items = (products || [])
    .filter((p: any) => p.image) // گوگل مرچنت بدون تصویر محصول را قبول نمی‌کند
    .map((p: any) => {
      const finalPrice = p.discount > 0 ? p.price - (p.price * p.discount) / 100 : p.price;

      return `
    <item>
      <g:id>${p.id}</g:id>
      <g:title>${escapeXml(p.title)}</g:title>
      <g:description>${escapeXml(p.description || p.title)}</g:description>
      <g:link>${baseUrl}/products/${p.id}</g:link>
      <g:image_link>${escapeXml(p.image)}</g:image_link>
      <g:availability>${p.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${p.price.toFixed(0)} AFN</g:price>
      ${p.discount > 0 ? `<g:sale_price>${finalPrice.toFixed(0)} AFN</g:sale_price>` : ""}
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(SITE_CONFIG.name)}</g:brand>
      ${p.category ? `<g:product_type>${escapeXml(p.category)}</g:product_type>` : ""}
      <g:identifier_exists>false</g:identifier_exists>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)}</title>
    <link>${baseUrl}</link>
    <description>فید محصولات ${escapeXml(SITE_CONFIG.name)} برای Google Merchant Center</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

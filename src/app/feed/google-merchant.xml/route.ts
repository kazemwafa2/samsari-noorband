import { createClient } from "@/lib/supabase/server";
import { SITE_CONFIG } from "@/constants/site";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://samsari-noorband.com";

  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, title, description, price, discount, stock, image, category, is_available"
    )
    .eq("is_available", true)
    .limit(5000);

  if (error) {
    console.error(
      "GOOGLE MERCHANT FEED ERROR:",
      error.message
    );
  }

  const items = (products || [])
    .filter((p: any) => p.image)
    .map((p: any) => {
      const price = Number(p.price) || 0;
      const discount = Number(p.discount) || 0;
      const stock = Number(p.stock) || 0;

      const finalPrice =
        discount > 0
          ? price - (price * discount) / 100
          : price;

      return `
    <item>
      <g:id>${escapeXml(String(p.id))}</g:id>
      <g:title>${escapeXml(p.title || "")}</g:title>
      <g:description>${escapeXml(
        p.description || p.title || ""
      )}</g:description>
      <g:link>${escapeXml(
        `${baseUrl}/products/${p.id}`
      )}</g:link>
      <g:image_link>${escapeXml(p.image)}</g:image_link>
      <g:availability>${
        stock > 0 ? "in_stock" : "out_of_stock"
      }</g:availability>
      <g:price>${price.toFixed(0)} AFN</g:price>
      ${
        discount > 0
          ? `<g:sale_price>${finalPrice.toFixed(0)} AFN</g:sale_price>`
          : ""
      }
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(SITE_CONFIG.name)}</g:brand>
      ${
        p.category
          ? `<g:product_type>${escapeXml(p.category)}</g:product_type>`
          : ""
      }
      <g:identifier_exists>false</g:identifier_exists>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>فید محصولات ${escapeXml(
      SITE_CONFIG.name
    )} برای Google Merchant Center</description>
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

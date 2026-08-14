"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function CreateProduct() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("0");
  const [image, setImage] = useState("");
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // شناسه کاربر را زودتر (قبل از submit) لازم داریم چون به آن برای
  // مسیر آپلود عکس هم نیاز است — Policy جدید باکت images برای seller
  // فقط مسیر products/{uid}/... خودش را قبول می‌کند.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title || !price || !stock) {
      setError("عنوان، قیمت و موجودی الزامی هستند.");
      return;
    }

    setLoading(true);

    // مشخصات فنی (برند، حجم، مناسب برای و...) به‌صورت جفت کلید-مقدار
    // — چک‌لیست: جدول «مشخصات» در تب صفحه محصول که قبلا وجود نداشت.
    const specifications = Object.fromEntries(
      specs.filter((s) => s.key.trim() && s.value.trim()).map((s) => [s.key.trim(), s.value.trim()])
    );

    // seller_id باید ست شود چون Policy جدید در دیتابیس (seller فقط
    // محصول خودش را می‌تواند بسازد/ویرایش/حذف کند) دقیقا همین ستون را
    // چک می‌کند؛ بدون این، INSERT برای نقش seller با خطای RLS رد می‌شود.
    const { error: insertError } = await supabase.from("products").insert({
      title,
      price: Number(price),
      stock: Number(stock),
      category,
      description,
      discount: Number(discount) || 0,
      image,
      specifications,
      is_available: true,
      seller_id: userId,
    });

    setLoading(false);

    if (insertError) {
      setError("ثبت محصول با خطا مواجه شد: " + insertError.message);
      return;
    }

    router.push("/dashboard/products");
  }

  return (
    <main className="home-page">
      <h1 className="section-title">➕ افزودن محصول جدید</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label>عنوان محصول</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <label>قیمت (افغانی)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>موجودی</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        <div>
          <label>درصد تخفیف</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>

        <div>
          <label>دسته‌بندی</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        <div>
          <label>تصویر اصلی محصول</label>
          <ImageUploader value={image} onUploaded={setImage} folder={`products/${userId ?? "shared"}`} />
        </div>

        <div>
          <label>توضیحات</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* مشخصات فنی — جفت‌های کلید/مقدار قابل‌افزودن، دقیقا مثل
            «برند / حجم / مناسب برای / نوع رایحه» در طرح مرجع */}
        <div>
          <label>مشخصات فنی (مثلا برند، حجم، ساخت کشور)</label>

          {specs.map((s, i) => (
            <div key={i} className="flex" style={{ gap: 8, marginBottom: 8 }}>
              <input
                placeholder="عنوان (مثلا برند)"
                value={s.key}
                onChange={(e) => {
                  const next = [...specs];
                  next[i] = { ...next[i], key: e.target.value };
                  setSpecs(next);
                }}
              />
              <input
                placeholder="مقدار (مثلا Chanel)"
                value={s.value}
                onChange={(e) => {
                  const next = [...specs];
                  next[i] = { ...next[i], value: e.target.value };
                  setSpecs(next);
                }}
              />
              <button
                type="button"
                className="icon-btn"
                onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            className="outline-btn"
            onClick={() => setSpecs([...specs, { key: "", value: "" }])}
          >
            ➕ افزودن ردیف مشخصات
          </button>
        </div>

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "در حال ثبت..." : "ثبت محصول"}
        </button>
      </form>
    </main>
  );
}

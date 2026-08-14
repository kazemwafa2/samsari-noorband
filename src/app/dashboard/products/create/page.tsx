"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface Category {
  id: number;
  title: string;
  slug: string;
}

export default function CreateProduct() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("0");
  const [image, setImage] = useState("");
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [{ data: userData }, { data: categoryData, error: categoryError }] =
        await Promise.all([
          supabase.auth.getUser(),
          supabase
            .from("categories")
            .select("id, title, slug")
            .order("title"),
        ]);

      setUserId(userData.user?.id ?? null);
      setCategories(categoryData || []);

      if (categoryError) {
        setError(
          "دریافت دسته‌بندی‌ها با خطا مواجه شد: " +
            categoryError.message
        );
      }

      setCategoriesLoading(false);
    }

    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !price || !stock) {
      setError("عنوان، قیمت و موجودی الزامی هستند.");
      return;
    }

    if (!categoryId) {
      setError("لطفاً یک دسته‌بندی انتخاب کنید.");
      return;
    }

    const selectedCategory = categories.find(
      (category) => String(category.id) === categoryId
    );

    if (!selectedCategory) {
      setError("دسته‌بندی انتخاب‌شده معتبر نیست.");
      return;
    }

    setLoading(true);

    const specifications = Object.fromEntries(
      specs
        .filter((s) => s.key.trim() && s.value.trim())
        .map((s) => [s.key.trim(), s.value.trim()])
    );

    const { error: insertError } = await supabase.from("products").insert({
      title: title.trim(),
      price: Number(price),
      stock: Number(stock),
      category_id: Number(selectedCategory.id),
      category: selectedCategory.title,
      description: description.trim(),
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
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>قیمت (افغانی)</label>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>موجودی</label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        <div>
          <label>درصد تخفیف</label>
          <input
            type="number"
            min="0"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>

        <div>
          <label>دسته‌بندی</label>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            disabled={categoriesLoading}
          >
            <option value="">
              {categoriesLoading
                ? "در حال بارگذاری دسته‌بندی‌ها..."
                : "انتخاب دسته‌بندی"}
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>

          {!categoriesLoading && categories.length === 0 && (
            <p style={{ color: "red", marginTop: 6 }}>
              هیچ دسته‌بندی‌ای ثبت نشده است.
            </p>
          )}
        </div>

        <div>
          <label>تصویر اصلی محصول</label>
          <ImageUploader
            value={image}
            onUploaded={setImage}
            folder={`products/${userId ?? "shared"}`}
          />
        </div>

        <div>
          <label>توضیحات</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>مشخصات فنی</label>

          {specs.map((s, i) => (
            <div
              key={i}
              className="flex"
              style={{ gap: 8, marginBottom: 8 }}
            >
              <input
                placeholder="عنوان (مثلا برند)"
                value={s.key}
                onChange={(e) => {
                  const next = [...specs];
                  next[i] = {
                    ...next[i],
                    key: e.target.value,
                  };
                  setSpecs(next);
                }}
              />

              <input
                placeholder="مقدار (مثلا Chanel)"
                value={s.value}
                onChange={(e) => {
                  const next = [...specs];
                  next[i] = {
                    ...next[i],
                    value: e.target.value,
                  };
                  setSpecs(next);
                }}
              />

              <button
                type="button"
                className="icon-btn"
                onClick={() =>
                  setSpecs(specs.filter((_, idx) => idx !== i))
                }
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            className="outline-btn"
            onClick={() =>
              setSpecs([...specs, { key: "", value: "" }])
            }
          >
            ➕ افزودن ردیف مشخصات
          </button>
        </div>

        <button
          className="primary-btn"
          type="submit"
          disabled={loading || categories.length === 0}
        >
          {loading ? "در حال ثبت..." : "ثبت محصول"}
        </button>
      </form>
    </main>
  );
}

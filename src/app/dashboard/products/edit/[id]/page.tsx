"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function EditProduct() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // اطلاعات پایه محصول
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("0");
  const [image, setImage] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  // گالری تصاویر (جدول product_images)
  const [gallery, setGallery] = useState<any[]>([]);

  // اطلاعات ویژه سمساری (جدول product_pawn_details)
  const [condition, setCondition] = useState("used");
  const [color, setColor] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [imei, setImei] = useState("");
  const [previousOwnerName, setPreviousOwnerName] = useState("");
  const [previousOwnerPhone, setPreviousOwnerPhone] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyUntil, setWarrantyUntil] = useState("");
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ownerFolder, setOwnerFolder] = useState("shared");
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (id) loadAll();
  }, [id]);

  async function loadAll() {
    setLoading(true);

    const [{ data: product, error: productError }, { data: images }, { data: pawn }] =
      await Promise.all([
        supabase.from("products").select("*").eq("id", id).single(),
        supabase.from("product_images").select("*").eq("product_id", id).order("sort_order"),
        supabase.from("product_pawn_details").select("*").eq("product_id", id).single(),
      ]);

    if (productError || !product) {
      setError("محصول پیدا نشد.");
      setLoading(false);
      return;
    }

    // این صفحه فقط از لیست داشبورد (که برای seller فیلترشده) قابل
    // دسترسیه، ولی با یک لینک مستقیم بازم می‌شد اومد اینجا — قبلا در
    // اون حالت seller با فرم پر از اطلاعات محصول یکی دیگه روبه‌رو
    // می‌شد و فقط موقع ذخیره/آپلود عکس، با یک خطای فنی نامفهوم رد
    // می‌شد (چون Policy دیتابیس مالکیت رو چک می‌کنه). حالا یک پیغام
    // روشن نشون داده می‌شه، به‌جای اینکه فرم اصلا لود بشه.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

      if (profile?.role === "seller" && product.seller_id !== user.id) {
        setBlocked(true);
        setLoading(false);
        return;
      }
    }

    setTitle(product.title);
    setPrice(String(product.price));
    setStock(String(product.stock));
    setCategory(product.category || "");
    setDescription(product.description || "");
    setDiscount(String(product.discount || 0));
    setImage(product.image || "");
    setIsAvailable(product.is_available);
    setIsFeatured(!!product.is_featured);
    setIsUrgent(!!product.is_urgent);
    setIsArchived(!!product.is_archived);

    const specEntries = Object.entries(product.specifications || {});
    setSpecs(specEntries.length > 0 ? specEntries.map(([key, value]) => ({ key, value: String(value) })) : [{ key: "", value: "" }]);

    setGallery(images || []);

    // مسیر آپلود عکس باید زیر پوشه‌ی خود صاحب محصول باشد — Policy جدید
    // باکت images برای seller فقط products/{uid}/... خودش را قبول
    // می‌کند. محصولات قدیمی‌تر که seller_id ندارند (قبل از این ستون)
    // زیر یک پوشه‌ی مشترک می‌مانند که فقط ادمین به آن دسترسی نوشتن
    // دارد — و چون گارد بالا هر seller را قبل از رسیدن به اینجا رد
    // می‌کند، این مسیر فقط توسط ادمین استفاده می‌شود.
    setOwnerFolder(product.seller_id || "shared");

    if (pawn) {
      setCondition(pawn.condition || "used");
      setColor(pawn.color || "");
      setSerialNumber(pawn.serial_number || "");
      setImei(pawn.imei || "");
      setPreviousOwnerName(pawn.previous_owner_name || "");
      setPreviousOwnerPhone(pawn.previous_owner_phone || "");
      setPurchasePrice(pawn.purchase_price ? String(pawn.purchase_price) : "");
      setPurchaseDate(pawn.purchase_date || "");
      setWarrantyUntil(pawn.warranty_until || "");
    }

    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const specifications = Object.fromEntries(
      specs.filter((s) => s.key.trim() && s.value.trim()).map((s) => [s.key.trim(), s.value.trim()])
    );

    const { error: updateError } = await supabase
      .from("products")
      .update({
        title,
        price: Number(price),
        stock: Number(stock),
        category,
        description,
        discount: Number(discount) || 0,
        image,
        specifications,
        is_available: isAvailable,
        is_featured: isFeatured,
        is_urgent: isUrgent,
        is_archived: isArchived,
        sold_at: isArchived ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      setSaving(false);
      setError("ذخیره اطلاعات محصول با خطا مواجه شد: " + updateError.message);
      return;
    }

    if (condition || color || serialNumber || imei || previousOwnerName) {
      const { error: pawnError } = await supabase.from("product_pawn_details").upsert({
        product_id: Number(id),
        condition,
        color,
        serial_number: serialNumber,
        imei,
        previous_owner_name: previousOwnerName,
        previous_owner_phone: previousOwnerPhone,
        purchase_price: purchasePrice ? Number(purchasePrice) : null,
        purchase_date: purchaseDate || null,
        warranty_until: warrantyUntil || null,
      });

      if (pawnError) {
        setSaving(false);
        setError("ذخیره اطلاعات سمساری با خطا مواجه شد: " + pawnError.message);
        return;
      }
    }

    setSaving(false);
    router.push("/dashboard/products");
  }

  async function handleGalleryUpload(url: string) {
    const { data, error: insertError } = await supabase
      .from("product_images")
      .insert({ product_id: Number(id), url, sort_order: gallery.length })
      .select()
      .single();

    if (!insertError && data) {
      setGallery((prev) => [...prev, data]);
    }
  }

  async function handleGalleryDelete(imageId: number) {
    const { error: deleteError } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);

    if (!deleteError) {
      setGallery((prev) => prev.filter((img) => img.id !== imageId));
    }
  }

  if (loading) {
    return (
      <main className="home-page">
        <p>در حال بارگذاری...</p>
      </main>
    );
  }

  if (blocked) {
    return (
      <main className="home-page">
        <div className="glass rounded-3xl p-8 text-center space-y-4">
          <h1 className="section-title">این محصول مال شما نیست</h1>
          <p>این محصول به فروشنده‌ی دیگری تعلق دارد و امکان ویرایش آن برای شما وجود ندارد.</p>
          <button className="primary-btn" onClick={() => router.push("/dashboard/products")}>
            بازگشت به لیست محصولات
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">✏️ ویرایش محصول</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <h2>اطلاعات پایه</h2>

        <div>
          <label>عنوان محصول</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <label>قیمت (افغانی)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div>
          <label>موجودی</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>

        <div>
          <label>درصد تخفیف</label>
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </div>

        <div>
          <label>دسته‌بندی</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        <div>
          <label>تصویر اصلی</label>
          <ImageUploader value={image} onUploaded={setImage} folder={`products/${ownerFolder}`} />
        </div>

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

        <div>
          <label>توضیحات</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="flex">
          <label>
            <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
            فعال / قابل نمایش در فروشگاه
          </label>
        </div>

        <div className="flex">
          <label>
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            کالای ویژه
          </label>
          <label>
            <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} />
            کالای فوری
          </label>
          <label>
            <input type="checkbox" checked={isArchived} onChange={(e) => setIsArchived(e.target.checked)} />
            فروخته‌شده / بایگانی
          </label>
        </div>

        <h2>🖼 گالری تصاویر</h2>

        <div className="flex" style={{ flexWrap: "wrap" }}>
          {gallery.map((img) => (
            <div key={img.id} style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" width={100} height={100} />
              <button type="button" className="icon-btn" onClick={() => handleGalleryDelete(img.id)} title="حذف تصویر">
                <Trash2 size={16} color="#EF4444" />
              </button>
            </div>
          ))}
        </div>

        <ImageUploader onUploaded={handleGalleryUpload} folder={`products/${ownerFolder}/gallery`} />

        <h2>🔧 اطلاعات ویژه سمساری</h2>

        <div>
          <label>وضعیت کالا</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="new">نو</option>
            <option value="used">کارکرده</option>
            <option value="refurbished">تعمیرشده</option>
          </select>
        </div>

        <div>
          <label>رنگ</label>
          <input value={color} onChange={(e) => setColor(e.target.value)} />
        </div>

        <div>
          <label>شماره سریال</label>
          <input value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
        </div>

        <div>
          <label>IMEI (برای موبایل)</label>
          <input value={imei} onChange={(e) => setImei(e.target.value)} />
        </div>

        <div>
          <label>نام فروشنده قبلی</label>
          <input value={previousOwnerName} onChange={(e) => setPreviousOwnerName(e.target.value)} />
        </div>

        <div>
          <label>شماره تماس فروشنده قبلی</label>
          <input value={previousOwnerPhone} onChange={(e) => setPreviousOwnerPhone(e.target.value)} />
        </div>

        <div>
          <label>قیمت خرید از فروشنده</label>
          <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
        </div>

        <div>
          <label>تاریخ خرید</label>
          <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
        </div>

        <div>
          <label>پایان ضمانت / مهلت تست</label>
          <input type="date" value={warrantyUntil} onChange={(e) => setWarrantyUntil(e.target.value)} />
        </div>

        <button className="primary-btn" type="submit" disabled={saving}>
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </form>
    </main>
  );
}

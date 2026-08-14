"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Power, Pencil, Share2, Copy, X } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { logAction } from "@/lib/audit";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface Banner {
  id: number;
  zone: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  link_url: string | null;
  button_label: string | null;
  is_active: boolean;
  sort_order: number;
  starts_at: string | null;
  ends_at: string | null;
}

const ZONES = [
  { value: "announcement", label: "نوار اعلان بالای سایت" },
  { value: "hero", label: "اسلایدر اصلی" },
  { value: "deal", label: "بنر پیشنهاد ویژه" },
  { value: "middle", label: "بنر بین محصولات" },
  { value: "product", label: "بنر صفحه محصول" },
  { value: "footer", label: "بنر پایین صفحه" },
];

const emptyForm = {
  id: 0,
  zone: "hero",
  title: "",
  subtitle: "",
  image: "",
  linkUrl: "",
  buttonLabel: "",
  sortOrder: "1",
  startsAt: "",
  endsAt: "",
};

// این صفحه قبلا فقط یک لیست ساده کارت‌ها بود، بدون: آپلود واقعی عکس
// (فقط input متن برای URL)، ویرایش بنر موجود، جدول با ستون‌های مشخص،
// جستجو، و مودال اشتراک‌گذاری با QR Code — دقیقا همان چیزی که در طرح
// مرجع (پنل مدیریت بنرها) دیده می‌شود.
export default function BannersPage() {
  const supabase = createClient();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [shareBanner, setShareBanner] = useState<Banner | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!shareBanner) {
      setQrDataUrl("");
      return;
    }
    (async () => {
      const QRCode = (await import("qrcode")).default;
      const url = `${window.location.origin}${shareBanner.link_url || "/"}`;
      setQrDataUrl(await QRCode.toDataURL(url, { width: 220 }));
    })();
  }, [shareBanner]);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("zone")
      .order("sort_order");

    if (error) console.log("BANNERS ERROR:", error);
    setBanners(data || []);
    setLoading(false);
  }

  function openCreate() {
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(b: Banner) {
    setForm({
      id: b.id,
      zone: b.zone,
      title: b.title,
      subtitle: b.subtitle || "",
      image: b.image || "",
      linkUrl: b.link_url || "",
      buttonLabel: b.button_label || "",
      sortOrder: String(b.sort_order),
      startsAt: b.starts_at ? b.starts_at.slice(0, 16) : "",
      endsAt: b.ends_at ? b.ends_at.slice(0, 16) : "",
    });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;

    setSaving(true);

    const payload = {
      zone: form.zone,
      title: form.title,
      subtitle: form.subtitle || null,
      image: form.image || null,
      link_url: form.linkUrl || null,
      button_label: form.buttonLabel || null,
      sort_order: Number(form.sortOrder) || 1,
      starts_at: form.startsAt || null,
      ends_at: form.endsAt || null,
    };

    const { error } = form.id
      ? await supabase.from("banners").update(payload).eq("id", form.id)
      : await supabase.from("banners").insert({ ...payload, is_active: true });

    setSaving(false);

    if (error) {
      alert("ذخیره بنر با خطا مواجه شد: " + error.message);
      return;
    }

    logAction(form.id ? "update" : "create", "banner", form.title);
    setShowForm(false);
    setForm(emptyForm);
    load();
  }

  async function toggleActive(banner: Banner) {
    const { error } = await supabase
      .from("banners")
      .update({ is_active: !banner.is_active })
      .eq("id", banner.id);

    if (error) {
      alert("خطا: " + error.message);
      return;
    }

    logAction(banner.is_active ? "deactivate" : "activate", "banner", banner.id);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("این بنر حذف شود؟")) return;

    const { error } = await supabase.from("banners").delete().eq("id", id);

    if (error) {
      alert("خطا در حذف: " + error.message);
      return;
    }

    logAction("delete", "banner", id);
    load();
  }

  const filtered = banners.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <main className="home-page">
        <h1>در حال بارگذاری بنرها...</h1>
      </main>
    );
  }

  return (
    <main className="home-page">
      <h1 className="section-title">🖼 پنل مدیریت - بنرها</h1>

      <div className="flex" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <input
          placeholder="🔍 جستجو..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />

        <button type="button" className="primary-btn" onClick={openCreate}>
          <Plus size={16} /> افزودن بنر جدید
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>تصویر</th>
              <th>عنوان</th>
              <th>منطقه</th>
              <th>اولویت</th>
              <th>پایان</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((banner) => (
              <tr key={banner.id}>
                <td>
                  {banner.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={banner.image} alt={banner.title} className="admin-table-thumb" />
                  ) : (
                    <span className="admin-table-thumb admin-table-thumb-empty" />
                  )}
                </td>
                <td>{banner.title}</td>
                <td>{ZONES.find((z) => z.value === banner.zone)?.label || banner.zone}</td>
                <td>{banner.sort_order}</td>
                <td>{banner.ends_at ? new Date(banner.ends_at).toLocaleDateString("fa-AF") : "—"}</td>
                <td>
                  <span className={banner.is_active ? "status-badge status-active" : "status-badge status-inactive"}>
                    {banner.is_active ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <button type="button" className="icon-btn" title="ویرایش" onClick={() => openEdit(banner)}>
                      <Pencil size={16} />
                    </button>
                    <button type="button" className="icon-btn" title="فعال/غیرفعال" onClick={() => toggleActive(banner)}>
                      <Power size={16} />
                    </button>
                    <button type="button" className="icon-btn" title="اشتراک‌گذاری" onClick={() => setShareBanner(banner)}>
                      <Share2 size={16} />
                    </button>
                    <button type="button" className="icon-btn" title="حذف" onClick={() => handleDelete(banner.id)}>
                      <Trash2 size={16} color="#EF4444" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
                  هنوز بنری ثبت نشده.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* فرم افزودن/ویرایش بنر */}
      {showForm && (
        <div className="admin-modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex" style={{ justifyContent: "space-between" }}>
              <h2>{form.id ? "ویرایش بنر" : "افزودن بنر جدید"}</h2>
              <button type="button" className="icon-btn" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <select value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })}>
                {ZONES.map((z) => (
                  <option key={z.value} value={z.value}>{z.label}</option>
                ))}
              </select>

              <input placeholder="عنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <input placeholder="زیرعنوان (اختیاری)" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />

              <label>تصویر بنر</label>
              <ImageUploader value={form.image} onUploaded={(url) => setForm({ ...form, image: url })} folder="banners" />

              <input placeholder="لینک مقصد (مثلا /categories)" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} />
              <input placeholder="متن دکمه (اختیاری)" value={form.buttonLabel} onChange={(e) => setForm({ ...form, buttonLabel: e.target.value })} />

              <label>
                اولویت نمایش (عدد کوچک‌تر = جلوتر)
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
              </label>

              <label>
                زمان شروع نمایش (اختیاری)
                <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
              </label>

              <label>
                زمان پایان نمایش (اختیاری)
                <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
              </label>

              <button type="submit" className="primary-btn" disabled={saving}>
                <Plus size={16} /> {saving ? "در حال ذخیره..." : "ذخیره بنر"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* مودال اشتراک‌گذاری با QR Code — چک‌لیست: دقیقا مثل طرح مرجع */}
      {shareBanner && (
        <div className="admin-modal-backdrop" onClick={() => setShareBanner(null)}>
          <div className="admin-modal admin-modal-share" onClick={(e) => e.stopPropagation()}>
            <div className="flex" style={{ justifyContent: "space-between" }}>
              <h2>اشتراک‌گذاری</h2>
              <button type="button" className="icon-btn" onClick={() => setShareBanner(null)}>
                <X size={18} />
              </button>
            </div>

            <p>این QR را اسکن کنید یا لینک را کپی کنید.</p>

            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="QR Code" width={200} height={200} style={{ margin: "0 auto", display: "block" }} />
            )}

            <div className="flex" style={{ gap: 8 }}>
              <input readOnly value={`${typeof window !== "undefined" ? window.location.origin : ""}${shareBanner.link_url || "/"}`} />
              <button
                type="button"
                className="primary-btn"
                onClick={async () => {
                  await navigator.clipboard.writeText(`${window.location.origin}${shareBanner.link_url || "/"}`);
                  alert("لینک کپی شد.");
                }}
              >
                <Copy size={16} /> کپی لینک
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

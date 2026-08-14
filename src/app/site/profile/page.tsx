"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { getMessage } from "@/constants/messages";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";

export default function Profile() {
  const supabase = createClient();
  const { language } = useLanguage();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, email, phone, avatar, vip, premium, role, is_active, created_at")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setProfile({ ...data, email: data?.email ?? user.email });
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function logoutUser() {
    // alert() یک دیالوگ خام و مسدودکننده مرورگر است که با ظاهر جدید
    // چت‌بات/toast های سایت هماهنگ نیست؛ به toast (که قبلا در پروژه
    // نصب و در layout.tsx وصل شده بود ولی اینجا استفاده نمی‌شد) تغییر
    // کرد. چون window.location.href بلافاصله کل صفحه را رفرش می‌کند،
    // یک تاخیر کوتاه گذاشته شد تا toast واقعا دیده شود.
    toast(getMessage("GOODBYE_MESSAGE", language));
    await supabase.auth.signOut();
    setTimeout(() => {
      window.location.href = "/";
    }, 900);
  }

  if (loading) {
    return (
      <main className="home-page">
        <h1>{t("fetchingInfoText", language)}</h1>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="home-page">
        <h1>{t("profileNotFoundTitle", language)}</h1>

        <Link href="/login" className="primary-btn">
          {t("loginSubmitButton", language)}
        </Link>
      </main>
    );
  }

  return (
    <main className="home-page">
      <h1 className="section-title">{t("profilePageTitle", language)}</h1>

      <div className="card">
        <div style={{ textAlign: "center", fontSize: "90px" }}>
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar}
              alt="avatar"
              width={120}
              height={120}
              style={{ borderRadius: "50%", margin: "auto" }}
            />
          ) : (
            "👤"
          )}
        </div>

        <h2>{t("welcomeFamilyTitle", language)}</h2>

        <p>{t("nameLabel", language)}: {profile.full_name || t("notRegisteredText", language)}</p>
        <p>{t("emailLabel", language)}: {profile.email}</p>
        <p>{t("phoneNumberLabel", language)}: {profile.phone || t("notRegisteredText", language)}</p>
        <p>{t("accountLevelLabel", language)}: {profile.role}</p>
        <p>VIP: {profile.vip ? `${t("activeStatusText", language)} 💎` : t("inactiveStatusText", language)}</p>
        <p>Premium: {profile.premium ? `${t("activeStatusText", language)} ⭐` : t("inactiveStatusText", language)}</p>
        <p>
          {t("accountStatusLabel", language)}:{" "}
          {profile.is_active ? `${t("activeStatusText", language)} ✅` : `${t("inactiveStatusText", language)} ❌`}
        </p>
        <p>
          {t("joinDateLabel", language)}:{" "}
          {profile.created_at ? new Date(profile.created_at).toLocaleDateString(language === "en" ? "en-US" : "fa-AF") : "-"}
        </p>
      </div>

      <div className="card">
        <h2>{t("accountFeaturesTitle", language)}</h2>

        <p>• {t("featureViewOrders", language)}</p>
        <p>• {t("featureManageAddresses", language)}</p>
        <p>• {t("wishlist", language)}</p>
        <p>• {t("featureExclusiveDiscounts", language)}</p>
        <p>• {t("notifications", language)}</p>
        <p>• NOORBAND AI</p>
      </div>

      <div className="flex">
        <Link href="/site/profile/edit" className="primary-btn">
          {t("editProfileLink", language)}
        </Link>

        <Link href="/site/orders" className="primary-btn">
          {t("myOrdersLink", language)}
        </Link>
      </div>

      <br />

      <button className="primary-btn" onClick={logoutUser}>
        {t("logoutButton", language)}
      </button>
    </main>
  );
}

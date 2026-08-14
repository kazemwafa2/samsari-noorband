"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Eye, EyeOff, Mail, Lock, User, Phone, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/translate-auth-error";
import { Captcha } from "@/components/auth/Captcha";
import { LocationSelector } from "@/components/location/LocationSelector";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { getMessage } from "@/constants/messages";
import { useGuestOnly } from "@/hooks/use-guest-only";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  // اصلاح: مثل صفحه لاگین — کاربر لاگین‌شده نباید فرم ثبت‌نام ببیند.
  useGuestOnly();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [location, setLocation] = useState<{
    countryId?: string;
    provinceId?: string;
    districtId?: string;
  }>({});
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  async function registerUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError(t("fillAllFieldsRegisterError", language));
      return;
    }

    if (!captchaValid) {
      setError(t("captchaInvalidError", language));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("passwordsMismatchError", language));
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone,
        },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(translateAuthError(signUpError.message));
      return;
    }

    // نکته مهم: اگر روی جدول profiles یک DB trigger برای ساخت خودکار
    // پروفایل بعد از signUp نداری، این upsert یک شبکه‌ی ایمنی است.
    // اگر trigger داری، این بخش را حذف کن تا داده تکراری درج نشود.
    if (data?.user) {
      const [{ data: province }, { data: district }] = await Promise.all([
        location.provinceId
          ? supabase.from("provinces").select("name").eq("id", location.provinceId).single()
          : Promise.resolve({ data: null }),
        location.districtId
          ? supabase.from("districts").select("name").eq("id", location.districtId).single()
          : Promise.resolve({ data: null }),
      ]);

      await supabase.from("profiles").upsert({
        id: data.user.id,
        name,
        email,
        phone,
        role: "customer",
        is_active: true,
        province_id: location.provinceId || null,
        district_id: location.districtId || null,
        province: province?.name || null,
        district: district?.name || null,
        address: address || null,
      });
    }

    setLoading(false);

    // REGISTER_MESSAGE در messages.ts از قبل تعریف شده بود ولی هیچ‌جای
    // کد صدایش نمی‌زد — کاربر بعد از ثبت‌نام موفق هیچ تاییدی نمی‌دید.
    toast.success(getMessage("REGISTER_MESSAGE", language));

    if (data?.session) {
      // ایمیل تایید غیرفعال است و کاربر مستقیم لاگین شده
      router.push("/");
      router.refresh();
    } else {
      // تایید ایمیل فعال است، کاربر باید ایمیلش را چک کند
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen center relative overflow-hidden">
      <div className="auth-page-decor" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="glass-card" style={{ position: "relative", zIndex: 1 }}>
        <h1 className="section-title">{t("registerPageTitle", language)}</h1>

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        )}

        <form onSubmit={registerUser}>
          <div>
            <label>{t("fullNameLabel", language)}</label>
            <div className="input-box">
              <User size={20} />
              <input
                type="text"
                placeholder={t("yourNamePlaceholder", language)}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <br />

          <div>
            <label>{t("emailLabel", language)}</label>
            <div className="input-box">
              <Mail size={20} />
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <br />

          <div>
            <label>{t("phoneLabel", language)}</label>
            <div className="input-box">
              <Phone size={20} />
              <input
                type="tel"
                // نکته: قبلا اینجا "09xxxxxxxxx" (فرمت شماره موبایل ایران)
                // نوشته شده بود، در حالی که سیمساری نوربند جاغوری در
                // افغانستان است و شماره‌های افغانستانی با ۰۷ شروع می‌شوند
                // (نه ۰۹) و ۱۰ رقمی‌اند (نه ۱۱ رقمی مثل ایران).
                placeholder="07xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <br />

          <LocationSelector
            countryId={location.countryId}
            provinceId={location.provinceId}
            districtId={location.districtId}
            onChange={setLocation}
            showCountry
          />

          <br />

          <div>
            <label>{t("fullAddressOptionalLabel", language)}</label>
            <input
              type="text"
              placeholder={t("exactAddressPlaceholder", language)}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <br />

          <div>
            <label>{t("passwordLabel", language)}</label>
            <div className="input-box">
              <Lock size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <br />

          <div>
            <label>{t("confirmPasswordLabel", language)}</label>
            <div className="input-box">
              <Lock size={20} />
              <input
                type={showPassword2 ? "text" : "password"}
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword2(!showPassword2)}>
                {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <br />

          <Captcha onValidChange={setCaptchaValid} />

          <br />

          <div className="flex">
            <Link href="/login">{t("alreadyRegisteredLink", language)}</Link>
          </div>

          <br />

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="loading" /> : t("registerSubmitButton", language)}
          </button>
        </form>
      </div>
    </div>
  );
}

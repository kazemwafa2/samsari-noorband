"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  LoaderCircle,
  Camera,
  RefreshCw,
  CalendarDays,
  MapPin,
  Home,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/translate-auth-error";
import { Captcha } from "@/components/auth/Captcha";
import { LocationSelector } from "@/components/location/LocationSelector";
import { useLocation } from "@/hooks/useLocation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { t } from "@/lib/i18n/dictionaries";
import { getMessage } from "@/constants/messages";
import { useGuestOnly } from "@/hooks/use-guest-only";
import {
  uploadImage,
  getImagePublicUrl,
} from "@/lib/supabase/storage";

function generateStrongPassword() {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const special = "!@#$%&*?";

  const all = upper + lower + numbers + special;

  function randomChar(chars: string) {
    return chars[Math.floor(Math.random() * chars.length)];
  }

  const required = [
    randomChar(upper),
    randomChar(lower),
    randomChar(numbers),
    randomChar(special),
  ];

  while (required.length < 12) {
    required.push(randomChar(all));
  }

  return required
    .sort(() => Math.random() - 0.5)
    .join("");
}

function getPasswordStrength(password: string) {
  if (!password) {
    return {
      score: 0,
      label: "رمز وارد نشده",
    };
  }

  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "ضعیف" };
  if (score <= 4) return { score, label: "متوسط" };
  return { score, label: "قوی" };
}

function normalizePhone(phone: string, phoneCode: string) {
  let value = phone.trim().replace(/[^\d+]/g, "");

  if (value.startsWith("+")) {
    return value;
  }

  if (value.startsWith("00")) {
    return `+${value.slice(2)}`;
  }

  const code = phoneCode.startsWith("+")
    ? phoneCode
    : `+${phoneCode}`;

  if (value.startsWith("0")) {
    value = value.slice(1);
  }

  return `${code}${value}`;
}

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();
  const { countries } = useLocation();

  useGuestOnly();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [captchaValid, setCaptchaValid] = useState(false);

  const [location, setLocation] = useState<{
    countryId?: string;
    provinceId?: string;
    districtId?: string;
    cityId?: string;
  }>({});

  const [village, setVillage] = useState("");
  const [address, setAddress] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function setFieldError(field: string, message: string) {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  }

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function fieldError(field: string) {
    return fieldErrors[field] ? (
      <small
        style={{
          display: "block",
          marginTop: 6,
          color: "#dc2626",
          fontWeight: 600,
          lineHeight: 1.6,
        }}
      >
        ⚠️ {fieldErrors[field]}
      </small>
    ) : null;
  }

  function setRegisterServerError(message: string) {
    const text = message.toLowerCase();

    if (
      text.includes("email") ||
      text.includes("ایمیل") ||
      text.includes("already registered") ||
      text.includes("already exists")
    ) {
      setFieldError("email", message);
      return;
    }

    if (
      text.includes("password") ||
      text.includes("رمز") ||
      text.includes("password")
    ) {
      setFieldError("password", message);
      return;
    }

    if (
      text.includes("phone") ||
      text.includes("شماره") ||
      text.includes("تلفن")
    ) {
      setFieldError("phone", message);
      return;
    }

    setError(message);
  }

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password]
  );

  function handleAvatarChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowed.includes(file.type)) {
      setFieldError("avatar", "فقط تصاویر JPG، PNG، WEBP یا GIF مجاز است.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFieldError("avatar", "حجم عکس نباید بیشتر از ۵ مگابایت باشد.");
      return;
    }

    setError("");
    setAvatarFile(file);

    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
  }

  function handleLocationChange(data: {
    countryId?: string;
    provinceId?: string;
    districtId?: string;
    cityId?: string;
  }) {
    setLocation(data);

    if (data.countryId) {
      const country = countries.find(
        (item) => item.id === data.countryId
      );

      setPhoneCode(country?.phone_code || "");
    } else {
      setPhoneCode("");
    }
  }

  function validateBirthDate() {
    if (!birthDate) return true;

    const selected = new Date(`${birthDate}T00:00:00`);
    const today = new Date();

    if (Number.isNaN(selected.getTime())) return false;

    if (selected > today) return false;

    const age =
      today.getFullYear() -
      selected.getFullYear() -
      (
        today.getMonth() < selected.getMonth() ||
        (
          today.getMonth() === selected.getMonth() &&
          today.getDate() < selected.getDate()
        )
          ? 1
          : 0
      );

    return age >= 13;
  }

  async function uploadAvatar(userId: string) {
    if (!avatarFile) return null;

    const extension =
      avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";

    const path =
      `${userId}/profile-${Date.now()}.${extension}`;

    const result = await uploadImage(
      avatarFile,
      path,
      "avatars"
    );

    if (result.error) {
      throw new Error(result.error.message);
    }

    return getImagePublicUrl(path, "avatars");
  }

  async function registerUser(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!name.trim()) {
      setFieldError("name", "لطفاً نام خود را وارد کنید.");
      return;
    }

    if (!surname.trim()) {
      setFieldError("surname", "لطفاً تخلص خود را وارد کنید.");
      return;
    }

    if (!validateBirthDate()) {
      setFieldError(
        "birthDate",
        "تاریخ تولد معتبر نیست. حداقل سن ثبت‌نام ۱۳ سال است."
      );
      return;
    }

    if (!location.countryId) {
      setFieldError("country", "لطفاً کشور خود را انتخاب کنید.");
      return;
    }

    if (!location.provinceId) {
      setFieldError("province", "لطفاً ولایت / استان خود را انتخاب کنید.");
      return;
    }

    if (!location.districtId) {
      setFieldError("district", "لطفاً ولسوالی / شهرستان خود را انتخاب کنید.");
      return;
    }

    if (!village.trim()) {
      setFieldError("village", "لطفاً نام قریه یا محل را وارد کنید.");
      return;
    }

    if (!email.trim()) {
      setFieldError("email", "لطفاً ایمیل خود را وارد کنید.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError("email", "فرمت ایمیل معتبر نیست؛ مانند example@gmail.com وارد کنید.");
      return;
    }

    if (!phone.trim()) {
      setFieldError("phone", "لطفاً شماره تماس خود را وارد کنید.");
      return;
    }

    if (!password) {
      setFieldError("password", "لطفاً رمز عبور خود را وارد کنید.");
      return;
    }

    if (password.length < 6 || password.length > 12) {
      setFieldError("password", "رمز عبور باید بین ۶ تا ۱۲ کاراکتر باشد.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setFieldError("password", "رمز باید حداقل یک حرف بزرگ انگلیسی داشته باشد.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setFieldError("password", "رمز باید حداقل یک حرف کوچک انگلیسی داشته باشد.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setFieldError("password", "رمز باید حداقل یک عدد داشته باشد.");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setFieldError("password", "رمز باید حداقل یک کاراکتر ویژه مانند @ یا # داشته باشد.");
      return;
    }

    if (!confirmPassword) {
      setFieldError("confirmPassword", "لطفاً رمز عبور را دوباره وارد کنید.");
      return;
    }

    if (password !== confirmPassword) {
      setFieldError("confirmPassword", "رمز عبور و تأیید رمز یکسان نیستند.");
      return;
    }

    if (!captchaValid) {
      setFieldError("captcha", t("captchaInvalidError", language));
      return;
    }

    setLoading(true);

    const normalizedPhone = normalizePhone(
      phone,
      phoneCode || "+93"
    );

    const { data, error: signUpError } =
      await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            surname: surname.trim(),
            birth_date: birthDate || null,

            phone: normalizedPhone,
            phone_code: phoneCode || null,

            country_id: location.countryId || null,
            province_id: location.provinceId || null,
            district_id: location.districtId || null,
            city_id: location.cityId || null,

            village: village.trim(),
            address: address.trim() || null,
          },
        },
      });

    if (signUpError) {
      setLoading(false);

      const translatedError = translateAuthError(
        signUpError.message
      );

      setRegisterServerError(translatedError);
      return;
    }

    if (!data?.user) {
      setLoading(false);
      setError(
        "ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید."
      );
      return;
    }

    let avatarUrl: string | null = null;

    /*
     * اگر Supabase بلافاصله session بدهد،
     * کاربر احراز هویت شده و اجازه آپلود به Storage دارد.
     */
    if (data.session && avatarFile) {
      try {
        avatarUrl = await uploadAvatar(data.user.id);
      } catch (avatarError) {
        console.error(
          "AVATAR UPLOAD ERROR:",
          avatarError
        );

        toast.error(
          "حساب ساخته شد، اما عکس پروفایل آپلود نشد."
        );
      }
    }

    /*
     * Trigger دیتابیس اطلاعات اصلی را از metadata می‌گیرد.
     * این upsert اطلاعات Location و avatar را نیز تکمیل می‌کند.
     */
    const profileData: Record<string, unknown> = {
      id: data.user.id,

      name: name.trim(),
      full_name: name.trim(),
      surname: surname.trim(),

      email: email.trim(),
      phone: normalizedPhone,
      phone_code: phoneCode || null,

      birth_date: birthDate || null,

      country_id: location.countryId || null,
      province_id: location.provinceId || null,
      district_id: location.districtId || null,
      city_id: location.cityId || null,

      village: village.trim(),
      address: address.trim() || null,

      role: "customer",
      is_active: true,
    };

    if (avatarUrl) {
      profileData.avatar = avatarUrl;
      profileData.avatar_url = avatarUrl;
    }

    /*
     * اگر session وجود داشته باشد، upsert معمولی انجام می‌شود.
     * اگر email confirmation فعال باشد، trigger دیتابیس قبلاً
     * اطلاعات را ساخته است و این مرحله ممکن است توسط RLS رد شود؛
     * در آن حالت ثبت‌نام همچنان موفق محسوب می‌شود.
     */
    if (data.session) {
      const { error: profileError } =
        await supabase
          .from("profiles")
          .upsert(profileData);

      if (profileError) {
        console.error(
          "PROFILE UPSERT ERROR:",
          profileError
        );
      }
    }

    setLoading(false);

    toast.success(
      getMessage("REGISTER_MESSAGE", language)
    );

    if (data.session) {
      router.push("/");
      router.refresh();
    } else {
      toast.info(
        "لطفاً ایمیل خود را بررسی و حساب خود را تأیید کنید."
      );

      router.push("/login");
    }
  }

  function suggestPassword() {
    const strong = generateStrongPassword();

    setPassword(strong);
    setConfirmPassword(strong);
    setShowPassword(true);
    setShowPassword2(true);
    setError("");
  }

  return (
    <div className="min-h-screen center relative overflow-hidden">
      <div
        className="auth-page-decor"
        aria-hidden="true"
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div
        className="glass-card"
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(680px, 94vw)",
        }}
      >
        <h1 className="section-title">
          {t("registerPageTitle", language)}
        </h1>

        <p
          style={{
            textAlign: "center",
            opacity: 0.75,
            marginBottom: 20,
          }}
        >
          لطفاً اطلاعات خود را با دقت وارد کنید.
        </p>

        {error && (
          <p
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: 15,
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={registerUser}>

          {/* PROFILE PHOTO */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <label
              style={{
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px dashed currentColor",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                }}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="پیش‌نمایش عکس پروفایل"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Camera size={35} />
                )}
              </div>

              <span>
                عکس پروفایل
              </span>

              {fieldError("avatar")}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {/* NAME */}
          <div>
            <label>نام</label>

            <div className="input-box">
              <User size={20} />

              <input
                type="text"
                placeholder="نام شما"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearFieldError("name");
                }}
                required
              />
            </div>
            {fieldError("name")}
          </div>

          <br />

          {/* SURNAME */}
          <div>
            <label>تخلص</label>

            <div className="input-box">
              <User size={20} />

              <input
                type="text"
                placeholder="تخلص شما"
                value={surname}
                onChange={(e) => {
                  setSurname(e.target.value);
                  clearFieldError("surname");
                }}
                required
              />
            </div>
            {fieldError("surname")}
          </div>

          <br />

          {/* BIRTH DATE */}
          <div>
            <label>تاریخ تولد</label>

            <div className="input-box">
              <CalendarDays size={20} />

              <input
                type="date"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  clearFieldError("birthDate");
                }}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            {fieldError("birthDate")}
          </div>

          <br />

          {/* LOCATION */}
          <div>
            <LocationSelector
              countryId={location.countryId}
              provinceId={location.provinceId}
              districtId={location.districtId}
              cityId={location.cityId}
              onChange={(data) => {
                handleLocationChange(data);

                const selectedCountry = countries.find(
                  (country) => country.id === data.countryId
                );

                setPhoneCode(
                  selectedCountry?.phone_code || ""
                );
              }}
              showCountry
              showCity
              labels={{
                country: "کشور",
                province: "ولایت / استان",
                district: "ولسوالی / شهرستان",
                city: "ناحیه / شهر",
              }}
            />
            {fieldError("country")}
            {fieldError("province")}
            {fieldError("district")}
          </div>

          <br />

          {/* VILLAGE */}
          <div>
            <label>قریه / محل</label>

            <div className="input-box">
              <MapPin size={20} />

              <input
                type="text"
                placeholder="نام قریه یا محل"
                value={village}
                onChange={(e) => {
                  setVillage(e.target.value);
                  clearFieldError("village");
                }}
                required
              />
            </div>
            {fieldError("village")}
          </div>

          <br />

          {/* LOCAL ADDRESS */}
          <div>
            <label>آدرس محلی</label>

            <div className="input-box">
              <Home size={20} />

              <input
                type="text"
                placeholder="آدرس دقیق محل سکونت"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
              />
            </div>
          </div>

          <br />

          {/* EMAIL */}
          <div>
            <label>{t("emailLabel", language)}</label>

            <div className="input-box">
              <Mail size={20} />

              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                required
              />
            </div>
            {fieldError("email")}
          </div>

          <br />

          {/* PHONE */}
          <div>
            <label>{t("phoneLabel", language)}</label>

            <div
              className="input-box"
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <Phone size={20} />

              <select
                value={phoneCode}
                onChange={(e) =>
                  setPhoneCode(e.target.value)
                }
                style={{
                  maxWidth: 130,
                  border: "none",
                  background: "transparent",
                  outline: "none",
                }}
                aria-label="پیش‌شماره کشور"
              >
                <option value="">
                  پیش‌شماره
                </option>

                {countries.map((country) => (
                  <option
                    key={country.id}
                    value={country.phone_code || ""}
                  >
                    {country.name_fa || country.name}
                    {country.phone_code
                      ? ` (${country.phone_code})`
                      : ""}
                  </option>
                ))}
              </select>

              <input
                type="tel"
                placeholder="07xxxxxxxx"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearFieldError("phone");
                }}
                required
              />
            </div>
            {fieldError("phone")}

            <small
              style={{
                display: "block",
                marginTop: 6,
                opacity: 0.7,
              }}
            >
              پس از انتخاب کشور، پیش‌شماره همان کشور
              استفاده می‌شود.
            </small>
          </div>

          <br />

          {/* PASSWORD */}
          <div>
            <label>رمز عبور</label>

            <div className="input-box">
              <Lock size={20} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="رمز قوی خود را وارد کنید"
                value={password}
                maxLength={12}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                }}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label="نمایش رمز"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 13,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  قدرت رمز:{" "}
                  {passwordStrength.label}
                </span>

                <span>
                  {password.length}/12
                </span>
              </div>

              <div
                style={{
                  height: 6,
                  background: "#ddd",
                  borderRadius: 10,
                  overflow: "hidden",
                  marginTop: 5,
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      (passwordStrength.score / 6) * 100
                    )}%`,
                    height: "100%",
                    transition: "width .2s, background .2s",
                    background:
                      passwordStrength.score <= 2
                        ? "#dc2626"
                        : passwordStrength.score <= 4
                        ? "#f59e0b"
                        : "#16a34a",
                  }}
                />
              </div>
            </div>

            {fieldError("password")}

            <button
              type="button"
              onClick={suggestPassword}
              style={{
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                background: "transparent",
                border: "none",
                textDecoration: "underline",
              }}
            >
              <RefreshCw size={16} />
              پیشنهاد رمز قوی
            </button>

            <small
              style={{
                display: "block",
                marginTop: 7,
                opacity: 0.7,
                lineHeight: 1.8,
              }}
            >
              ۶ تا ۱۲ کاراکتر؛ شامل حرف بزرگ،
              حرف کوچک، عدد و کاراکتر ویژه.
            </small>
          </div>

          <br />

          {/* CONFIRM PASSWORD */}
          <div>
            <label>
              تأیید رمز عبور
            </label>

            <div className="input-box">
              <Lock size={20} />

              <input
                type={
                  showPassword2
                    ? "text"
                    : "password"
                }
                placeholder="رمز عبور را دوباره وارد کنید"
                value={confirmPassword}
                maxLength={12}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearFieldError("confirmPassword");
                }}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword2(
                    !showPassword2
                  )
                }
                aria-label="نمایش رمز تأیید"
              >
                {showPassword2 ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            {fieldError("confirmPassword")}
          </div>

          <br />

          {/* CAPTCHA */}
          <Captcha
            onValidChange={(valid) => {
              setCaptchaValid(valid);
              clearFieldError("captcha");
            }}
          />
          {fieldError("captcha")}

          <br />

          <div className="flex">
            <Link href="/login">
              {t(
                "alreadyRegisteredLink",
                language
              )}
            </Link>
          </div>

          <br />

          <button
            className="primary-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="loading" />
            ) : (
              t(
                "registerSubmitButton",
                language
              )
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

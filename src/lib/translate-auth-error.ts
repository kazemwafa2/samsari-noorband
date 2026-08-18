export function translateAuthError(
  message: string
) {
  switch (message) {
    case "Invalid login credentials":
      return "ایمیل یا رمز عبور اشتباه است.";

    case "Email not confirmed":
      return "ایمیل شما هنوز تایید نشده است.";

    case "User not found":
      return "کاربری با این مشخصات یافت نشد.";

    case "Too many requests":
      return "تعداد درخواست‌ها بیش از حد مجاز است.";

    case "Password should be at least 6 characters":
      return "رمز عبور باید حداقل 6 کاراکتر باشد.";

    default:
      return "خطایی رخ داده است. دوباره تلاش کنید.";
  }
}
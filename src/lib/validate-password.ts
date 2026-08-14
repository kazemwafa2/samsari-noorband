export function validatePassword(
  password: string
) {
  if (password.length < 8) {
    return {
      valid: false,
      message:
        "رمز عبور باید حداقل ۸ کاراکتر باشد.",
    };
  }

  return {
    valid: true,
    message: "",
  };
}
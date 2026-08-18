import { supabase } from "./supabase";

export async function resetPassword(
  email: string
) {
  return await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo:
        `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    }
  );
}
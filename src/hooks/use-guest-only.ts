"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./use-auth";
import { useUserRole } from "./use-user-role";
import { redirectUser } from "@/lib/redirect-user";

// این هوک قبلا فقط user/loading را برمی‌گرداند و هیچ redirect واقعی
// انجام نمی‌داد (برخلاف کامنتی که در login/page.tsx ادعا می‌کرد این
// هوک کاربر لاگین‌شده را به جای دیگری می‌فرستد). یعنی اگر ادمین/
// سوپرادمین/فروشنده‌ای که از قبل لاگین بود دستی وارد /login می‌شد،
// همچنان فرم لاگین را می‌دید. حالا واقعا بر اساس نقش کاربر به پنل
// مخصوص خودش (redirect-user.ts) هدایت می‌شود.
export function useGuestOnly() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!loading && user && !roleLoading) {
      router.replace(redirectUser(role || "customer"));
    }
  }, [user, loading, role, roleLoading, router]);

  return {
    user,
    loading,
  };
}

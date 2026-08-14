"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// قبلا این هوک فقط توابع خالی {add(){}, remove(){}} برمی‌گرداند و هیچ
// کاری انجام نمی‌داد. حالا به جدول واقعی "wishlist" وصل است.
// ساختار فرض‌شده جدول: id, user_id, product_id, created_at
// (بر اساس تابع getWishlist در src/lib/supabase.ts)

export function useWishlist() {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("wishlist")
      .select("*, products(*)")
      .eq("user_id", user.id);

    if (error) {
      console.log("WISHLIST LOAD ERROR:", error);
      setItems([]);
    } else {
      setItems(data || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add(productId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "برای افزودن به علاقه‌مندی‌ها باید وارد شوید." };

    const { error } = await supabase
      .from("wishlist")
      .insert({ user_id: user.id, product_id: productId });

    if (!error) await load();

    return { error: error?.message };
  }

  async function remove(productId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (!error) await load();
  }

  function isInWishlist(productId: string) {
    return items.some((item) => item.product_id === productId);
  }

  return { items, loading, add, remove, isInWishlist, reload: load };
}

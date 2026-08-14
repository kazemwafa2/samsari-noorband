import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareStore {
  productIds: number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
}

// حداکثر ۴ کالا برای مقایسه، مشابه اکثر فروشگاه‌های آنلاین

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      add: (id) => {
        const current = get().productIds;
        if (current.includes(id)) return;
        if (current.length >= 4) return;
        set({ productIds: [...current, id] });
      },
      remove: (id) => set({ productIds: get().productIds.filter((p) => p !== id) }),
      clear: () => set({ productIds: [] }),
    }),
    { name: "noorband-compare" }
  )
);

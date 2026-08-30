"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { InquiryUnit } from "@/lib/inquiry";

export type InquiryItem = {
  id: number;
  slug: string;
  name: string;
  image: string;
  origin: string;
  weight: string;
  /**
   * Buyer-provided requested quantity, kept as the raw string from the
   * input so the form can round-trip it. Optional for backwards
   * compatibility with previously persisted lists (which had no quantity).
   */
  quantity?: string;
  unit?: InquiryUnit;
};

type InquiryState = {
  items: InquiryItem[];
  isOpen: boolean;
  addItem: (item: InquiryItem) => void;
  removeItem: (id: number) => void;
  /** Patch one inquiry-list entry (currently used for quantity/unit). */
  updateItem: (id: number, patch: Partial<InquiryItem>) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

export const useInquiry = create<InquiryState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          if (state.items.find((i) => i.id === item.id)) return state;
          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateItem: (id, patch) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),
      clear: () => set({ items: [] }),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "mrmazafati-inquiry-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function inquiryCount(items: InquiryItem[]): number {
  return items.length;
}

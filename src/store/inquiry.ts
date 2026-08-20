"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type InquiryItem = {
  id: number;
  slug: string;
  name: string;
  image: string;
  origin: string;
  weight: string;
  /** Buyer-defined target volume, collected on the inquiry form. */
  quantity?: string;
};

type InquiryState = {
  items: InquiryItem[];
  isOpen: boolean;
  addItem: (item: InquiryItem) => void;
  removeItem: (id: number) => void;
  setQuantity: (id: number, quantity: string) => void;
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
      setQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })),
      clear: () => set({ items: [] }),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "mazafati-inquiry-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function inquiryCount(items: InquiryItem[]): number {
  return items.length;
}

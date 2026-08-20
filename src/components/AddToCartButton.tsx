"use client";

import { useState } from "react";
import { Check, ClipboardList } from "lucide-react";
import type { Product } from "@/lib/types";
import { useInquiry } from "@/store/cart";
import { cn } from "@/lib/utils";

export function AddToInquiryButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const addItem = useInquiry((s) => s.addItem);
  const items = useInquiry((s) => s.items);
  const openDrawer = useInquiry((s) => s.openDrawer);
  const [added, setAdded] = useState(false);
  const alreadyAdded = items.some((i) => i.id === product.id);

  function handleAdd() {
    if (alreadyAdded || added) {
      openDrawer();
      return;
    }
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      origin: product.origin,
      weight: product.weight,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all",
        added || alreadyAdded
          ? "bg-gold-500 text-date-950"
          : "bg-date-900 text-cream-50 hover:bg-date-800 hover:shadow-lg",
        className
      )}
    >
      {added ? (
        <>
          <Check size={16} /> Added to inquiry
        </>
      ) : alreadyAdded ? (
        <>
          <ClipboardList size={16} /> View inquiry list
        </>
      ) : (
        <>
          <ClipboardList size={16} /> Add to inquiry
        </>
      )}
    </button>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ClipboardList, FileText, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { useInquiry } from "@/store/cart";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";

export function ProductPurchase({ product }: { product: Product }) {
  const { dict, href } = useI18n();
  const addItem = useInquiry((s) => s.addItem);
  const openDrawer = useInquiry((s) => s.openDrawer);
  const items = useInquiry((s) => s.items);
  const [added, setAdded] = useState(false);
  const alreadyAdded = items.some((i) => i.id === product.id);

  function addToInquiry() {
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={addToInquiry}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all sm:flex-none sm:px-8",
            added || alreadyAdded
              ? "bg-gold-500 text-date-950"
              : "bg-date-900 text-cream-50 hover:bg-date-800 hover:shadow-lg",
          )}
        >
          {added ? (
            <>
              <Check size={16} /> {dict.common.addedToInquiry}
            </>
          ) : alreadyAdded ? (
            <>
              <ClipboardList size={16} /> {dict.common.viewInquiryList}
            </>
          ) : (
            <>
              <ClipboardList size={16} /> {dict.common.addToInquiryList}
            </>
          )}
        </button>
      </div>

      <Link
        href={href("/inquiry")}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-date-900 py-3.5 text-sm font-semibold text-date-900 transition-colors hover:bg-date-900 hover:text-cream-50"
      >
        {dict.product.requestFullQuote}
      </Link>

      <div className="flex flex-col gap-2 pt-2 text-sm text-date-600">
        <p className="flex items-center gap-2">
          <Truck size={15} className="text-gold-600" />
          {dict.product.shippingNote}
        </p>
        <p className="flex items-center gap-2">
          <FileText size={15} className="text-gold-600" />
          {dict.product.specsNote}
        </p>
      </div>
    </div>
  );
}

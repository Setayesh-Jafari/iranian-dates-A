"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ClipboardList, Phone, MessageCircle, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { useInquiry } from "@/store/cart";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "+989123456789";

export function ProductPurchase({ product }: { product: Product }) {
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
              : "bg-date-900 text-cream-50 hover:bg-date-800 hover:shadow-lg"
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
              <ClipboardList size={16} /> Add to inquiry list
            </>
          )}
        </button>
      </div>

      <Link
        href="/inquiry"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-date-900 py-3.5 text-sm font-semibold text-date-900 transition-colors hover:bg-date-900 hover:text-cream-50"
      >
        Request a full quote
      </Link>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Can you share pricing and MOQ?`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-600 py-3.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
      >
        <MessageCircle size={16} /> Chat on WhatsApp
      </a>

      <div className="flex flex-col gap-2 pt-2 text-sm text-date-600">
        <p className="flex items-center gap-2">
          <Truck size={15} className="text-gold-600" />
          FOB Bandar Abbas · Worldwide shipping
        </p>
        <p className="flex items-center gap-2">
          <Phone size={15} className="text-gold-600" />
          Response within 24 hours
        </p>
      </div>
    </div>
  );
}

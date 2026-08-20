"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, ClipboardList } from "lucide-react";
import type { Product } from "@/lib/types";
import { useInquiry } from "@/store/cart";
import { cn } from "@/lib/utils";
import { categoryLabel } from "@/lib/types";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const addItem = useInquiry((s) => s.addItem);
  const openDrawer = useInquiry((s) => s.openDrawer);
  const [added, setAdded] = useState(false);
  const alreadyAdded = useInquiry((s) =>
    s.items.some((i) => i.id === product.id)
  );

  function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
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
    setTimeout(() => setAdded(false), 1300);
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col focus-visible:outline-none"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-cream-200 shadow-[inset_0_0_0_1px_rgba(23,14,6,0.05)]">
        <Image
          src={product.images[0] ?? ""}
          alt={product.name}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
          priority={priority}
        />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-date-950 shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to inquiry`}
          className={cn(
            "absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full shadow-lg transition-all duration-300",
            added || alreadyAdded
              ? "bg-gold-500 text-date-950"
              : "bg-cream-50 text-date-900 hover:bg-date-900 hover:text-cream-50"
          )}
        >
          {added || alreadyAdded ? (
            <Check size={18} strokeWidth={2.5} />
          ) : (
            <ClipboardList size={18} strokeWidth={2} />
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-600">
          {categoryLabel(product.category)}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-date-900 transition-colors group-hover:text-gold-700">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-date-500">{product.origin}</p>
        <p className="mt-2 text-sm text-date-600 line-clamp-2">
          {product.tagline}
        </p>
        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-date-900/10 bg-cream-100 px-3 py-1.5 text-xs font-medium text-date-700 transition-colors group-hover:border-gold-500/30 group-hover:bg-gold-50">
            <ClipboardList size={12} /> Request pricing
          </span>
        </div>
      </div>
    </Link>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { discountPercent, formatINR } from "@/lib/format";
import { Rating } from "@/components/Rating";
import { cn } from "@/lib/utils";
import { categoryLabel } from "@/lib/types";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const [added, setAdded] = useState(false);

  const pct = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock <= 0;
  const badge = product.badge ?? (product.isNew ? "New" : null);

  function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut || added) return;
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.images[0] ?? "",
      weight: product.weight,
      unit: product.unit,
    });
    openCart();
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
          className={cn(
            "object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]",
            soldOut && "opacity-60 saturate-50"
          )}
          priority={priority}
        />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {badge && (
            <span className="rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-date-950 shadow-sm">
              {badge}
            </span>
          )}
          {pct && (
            <span className="rounded-full bg-date-950/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cream-50 backdrop-blur">
              -{pct}%
            </span>
          )}
        </div>

        {soldOut && (
          <div className="absolute inset-0 grid place-items-center">
            <span className="rounded-full bg-date-950/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cream-50">
              Sold out
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          aria-label={`Add ${product.name} to cart`}
          className={cn(
            "absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full shadow-lg transition-all duration-300",
            added
              ? "bg-emerald-600 text-white"
              : "bg-cream-50 text-date-900 hover:bg-date-900 hover:text-cream-50",
            soldOut && "pointer-events-none opacity-0"
          )}
        >
          {added ? <Check size={18} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-600">
          {categoryLabel(product.category)}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-date-900 transition-colors group-hover:text-gold-700">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-center gap-2">
          <Rating value={product.rating} />
          <span className="text-xs text-date-500">
            {product.rating.toFixed(1)} · {product.reviewCount} reviews
          </span>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-date-900">{formatINR(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-date-400 line-through">
              {formatINR(product.compareAtPrice)}
            </span>
          )}
          <span className="ml-auto text-xs text-date-500">{product.unit}</span>
        </div>
      </div>
    </Link>
  );
}

"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  function add() {
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
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={add}
      disabled={soldOut}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all",
        added
          ? "bg-emerald-600 text-white"
          : soldOut
            ? "cursor-not-allowed bg-date-900/10 text-date-400"
            : "bg-date-900 text-cream-50 hover:bg-date-800 hover:shadow-lg",
        className
      )}
    >
      {soldOut ? (
        "Sold out"
      ) : added ? (
        <>
          <Check size={16} /> Added to cart
        </>
      ) : (
        <>
          <ShoppingBag size={16} /> Add to cart
        </>
      )}
    </button>
  );
}

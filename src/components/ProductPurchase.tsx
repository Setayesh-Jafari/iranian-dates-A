"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag, Truck, Zap } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { QuantityPicker } from "@/components/QuantityPicker";
import { cn } from "@/lib/utils";

export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const soldOut = product.stock <= 0;
  const low = !soldOut && product.stock <= 15;

  function base() {
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.images[0] ?? "",
      weight: product.weight,
      unit: product.unit,
    };
  }

  function addToCart() {
    if (soldOut || added) return;
    addItem(base(), qty);
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  function buyNow() {
    if (soldOut) return;
    addItem(base(), qty);
    router.push("/checkout");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {!soldOut && <QuantityPicker value={qty} onChange={setQty} />}
        <button
          type="button"
          onClick={addToCart}
          disabled={soldOut}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all sm:flex-none sm:px-8",
            added
              ? "bg-emerald-600 text-white"
              : soldOut
                ? "cursor-not-allowed bg-date-900/10 text-date-400"
                : "bg-date-900 text-cream-50 hover:bg-date-800 hover:shadow-lg"
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
      </div>

      <button
        type="button"
        onClick={buyNow}
        disabled={soldOut}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-date-900 py-3.5 text-sm font-semibold text-date-900 transition-colors hover:bg-date-900 hover:text-cream-50 disabled:cursor-not-allowed disabled:border-date-900/10 disabled:text-date-400"
      >
        <Zap size={16} /> Buy it now
      </button>

      <div className="flex flex-col gap-1.5 pt-1 text-sm text-date-600">
        <p className="flex items-center gap-2">
          <Truck size={15} className="text-gold-600" />
          Free express shipping on orders over ₹2,999
        </p>
        <p className={cn("flex items-center gap-2", low ? "text-gold-700" : "text-emerald-700")}>
          <span className={cn("h-2 w-2 rounded-full", low ? "bg-gold-500" : "bg-emerald-500")} />
          {soldOut
            ? "Temporarily out of stock"
            : low
              ? `Only ${product.stock} cartons left in stock`
              : "In stock — ships within 24 hours"}
        </p>
      </div>
    </div>
  );
}

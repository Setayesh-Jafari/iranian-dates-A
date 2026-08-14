"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart, cartSubtotal, FREE_SHIPPING_THRESHOLD } from "@/store/cart";
import { formatINR } from "@/lib/format";
import { QuantityPicker } from "@/components/QuantityPicker";
import { EASE } from "@/lib/motion";

export function CartDrawer() {
  const items = useCart((s) => s.items);
  const isOpen = useCart((s) => s.isOpen);
  const closeCart = useCart((s) => s.closeCart);
  const removeItem = useCart((s) => s.removeItem);
  const setQty = useCart((s) => s.setQty);

  const subtotal = cartSubtotal(items);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-[70] bg-date-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col bg-cream-50 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-date-900/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-gold-600" />
                <h2 className="font-display text-xl font-semibold text-date-900">Your Cart</h2>
                <span className="text-sm text-date-500">({items.reduce((s, i) => s + i.qty, 0)})</span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="grid h-10 w-10 place-items-center rounded-full text-date-600 transition-colors hover:bg-date-900/5"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-cream-200/70 text-date-400">
                  <ShoppingBag size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-date-900">Your cart is empty</p>
                  <p className="mt-1.5 text-sm text-date-500">
                    Discover single-origin dates from the palm gardens of Iran.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 rounded-full bg-date-900 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
                >
                  Browse the shop <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-date-900/10 px-6 py-4">
                  {remaining > 0 ? (
                    <p className="text-sm text-date-600">
                      Add <span className="font-semibold text-gold-700">{formatINR(remaining)}</span> more for{" "}
                      <span className="font-semibold text-date-900">free shipping</span>
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-emerald-700">
                      ✓ You've unlocked free express shipping
                    </p>
                  )}
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-date-900/8">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-date-900/8 overflow-y-auto px-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-5">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={closeCart}
                              className="font-display text-[15px] font-semibold leading-snug text-date-900 hover:text-gold-700"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-0.5 text-xs text-date-500">
                              {item.weight} · {item.unit}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-date-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <QuantityPicker
                            size="sm"
                            value={item.qty}
                            onChange={(q) => setQty(item.id, q)}
                          />
                          <p className="font-semibold text-date-900">{formatINR(item.price * item.qty)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-date-900/10 bg-white/60 px-6 py-5">
                  <div className="flex items-center justify-between text-sm text-date-600">
                    <span>Subtotal</span>
                    <span className="font-display text-xl font-semibold text-date-900">
                      {formatINR(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-date-400">GST and shipping calculated at checkout.</p>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-date-900 py-4 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
                  >
                    Proceed to checkout <ArrowRight size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-2 w-full rounded-full py-2.5 text-sm font-medium text-date-600 transition-colors hover:text-date-900"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

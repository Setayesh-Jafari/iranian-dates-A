"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ClipboardList, X, Trash2 } from "lucide-react";
import { useInquiry, inquiryCount } from "@/store/cart";
import { EASE } from "@/lib/motion";

export function CartDrawer() {
  const items = useInquiry((s) => s.items);
  const isOpen = useInquiry((s) => s.isOpen);
  const closeDrawer = useInquiry((s) => s.closeDrawer);
  const removeItem = useInquiry((s) => s.removeItem);
  const count = inquiryCount(items);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[70] bg-date-950/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed bottom-0 right-0 top-0 z-[80] flex w-full max-w-md flex-col bg-cream-50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-date-900/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <ClipboardList size={20} className="text-gold-600" />
                <h2 className="font-display text-lg font-semibold text-date-900">
                  Inquiry List
                </h2>
                {count > 0 && (
                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-gold-100 px-1.5 text-xs font-bold text-gold-700">
                    {count}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-full text-date-600 transition-colors hover:bg-date-900/5"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-cream-200 text-date-400">
                  <ClipboardList size={28} strokeWidth={1.5} />
                </div>
                <p className="mt-5 font-display text-xl font-semibold text-date-900">
                  No products selected
                </p>
                <p className="mt-2 max-w-xs text-sm text-date-500">
                  Browse our catalog and add products you&apos;re interested in.
                  Then submit an inquiry for a custom quote.
                </p>
                <Link
                  href="/products"
                  onClick={closeDrawer}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-date-900 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
                >
                  Browse products <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
                    >
                      <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <p className="text-sm font-medium text-date-900 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-date-500">
                          {item.weight} · {item.origin}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-date-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="border-t border-date-900/10 px-6 py-5">
                  <p className="text-xs text-date-500 mb-4">
                    Select products and submit your inquiry. Our team will
                    respond with pricing within 24 hours.
                  </p>
                  <Link
                    href="/inquiry"
                    onClick={closeDrawer}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-4 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400"
                  >
                    Submit Inquiry <ArrowRight size={16} />
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

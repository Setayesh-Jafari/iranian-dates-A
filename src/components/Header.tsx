"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useCart, cartCount } from "@/store/cart";
import { useMounted } from "@/lib/useMounted";
import { CATEGORIES } from "@/lib/types";
import { EASE } from "@/lib/motion";

const NAV = [
  { label: "Shop All", href: "/products" },
  { label: "Premium", href: "/products?category=premium" },
  { label: "Wholesale", href: "/products?category=wholesale" },
  { label: "Our Story", href: "/#story" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.openCart);
  const mounted = useMounted();
  const count = cartCount(items);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const solid = scrolled || !isHome || menuOpen;

  return (
    <>
      <div className="relative z-[60] bg-date-950 text-cream-50">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-4 py-2 text-center text-[11px] tracking-wide sm:text-xs">
          <span className="hidden sm:inline text-cream-100/70">Direct from Iranian palm gardens</span>
          <span className="text-gold-400">✦</span>
          <span className="text-cream-100/90">Shipped from our Kolkata warehouse</span>
          <span className="hidden text-gold-400 sm:inline">✦</span>
          <span className="hidden font-medium text-gold-300 sm:inline">Free shipping over ₹2,999</span>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          solid
            ? "border-b border-date-900/10 bg-cream-50/90 shadow-[0_1px_0_0_rgba(23,14,6,0.03)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[76px] lg:px-8">
          <Logo tone={solid ? "dark" : "light"} />

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group relative text-sm font-medium tracking-wide transition-colors",
                  solid ? "text-date-700 hover:text-date-950" : "text-cream-100/85 hover:text-cream-50"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px w-0 bg-gold-500 transition-all duration-300 group-hover:w-full",
                    solid ? "bg-gold-600" : "bg-gold-300"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={openCart}
              aria-label="Open cart"
              className={cn(
                "relative grid h-11 w-11 place-items-center rounded-full transition-colors",
                solid ? "text-date-900 hover:bg-date-900/5" : "text-cream-50 hover:bg-cream-50/10"
              )}
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              {mounted && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[11px] font-bold leading-none text-date-950 ring-2 ring-cream-50">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full transition-colors lg:hidden",
                solid ? "text-date-900 hover:bg-date-900/5" : "text-cream-50 hover:bg-cream-50/10"
              )}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden border-t border-date-900/8 bg-cream-50 lg:hidden"
            >
              <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:px-6">
                {NAV.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded-xl px-3 py-3 text-base font-medium text-date-800 transition-colors hover:bg-cream-100"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-date-900/8" />
                <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-date-400">
                  Collections
                </p>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/products?category=${c.slug}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-date-700 transition-colors hover:bg-cream-100"
                  >
                    <span>{c.label}</span>
                    <span className="text-xs text-date-400">{c.short}</span>
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

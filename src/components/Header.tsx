"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ClipboardList, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { cn } from "@/lib/utils";
import { useInquiry, inquiryCount } from "@/store/inquiry";
import { useMounted } from "@/lib/useMounted";
import { CATEGORY_SLUGS } from "@/lib/types";
import { EASE } from "@/lib/motion";
import { useI18n } from "@/i18n/I18nProvider";

export function Header() {
  const { dict, href, locale } = useI18n();
  const pathname = usePathname();
  const isHome = pathname === href("/");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useInquiry((s) => s.items);
  const openDrawer = useInquiry((s) => s.openDrawer);
  const mounted = useMounted();
  const count = inquiryCount(items);

  const nav = [
    { label: dict.nav.products, href: href("/products") },
    { label: dict.nav.premium, href: href("/products?category=premium") },
    { label: dict.nav.wholesale, href: href("/products?category=wholesale") },
    { label: dict.nav.certifications, href: href("/certifications") },
    { label: dict.nav.blog, href: href("/blog") },
    { label: dict.nav.story, href: href("/#story") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !isHome || menuOpen;

  return (
    <>
      <div className="relative z-[60] bg-date-950 text-cream-50">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-4 py-2 text-center text-[11px] tracking-wide sm:text-xs">
          <span className="hidden text-cream-100/70 sm:inline">
            {dict.announcement.left}
          </span>
          <span className="text-gold-400">✦</span>
          <span className="text-cream-100/90">{dict.announcement.center}</span>
          <span className="hidden text-gold-400 sm:inline">✦</span>
          <span className="hidden font-medium text-gold-300 sm:inline">
            {dict.announcement.right}
          </span>
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

          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group relative text-sm font-medium tracking-wide transition-colors",
                  solid
                    ? "text-date-700 hover:text-date-950"
                    : "text-cream-100/85 hover:text-cream-50"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 start-0 h-px w-0 transition-all duration-300 group-hover:w-full",
                    solid ? "bg-gold-600" : "bg-gold-300"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <LocaleSwitcher
              tone={solid ? "dark" : "light"}
              className="hidden sm:flex"
            />

            {/* Inquiry list button */}
            <button
              type="button"
              onClick={openDrawer}
              aria-label={dict.header.openInquiry}
              className={cn(
                "relative grid h-11 w-11 place-items-center rounded-full transition-colors",
                solid
                  ? "text-date-900 hover:bg-date-900/5"
                  : "text-cream-50 hover:bg-cream-50/10"
              )}
            >
              <ClipboardList size={20} strokeWidth={1.8} />
              {mounted && count > 0 && (
                <span className="absolute -top-0.5 -end-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[11px] font-bold leading-none text-date-950 ring-2 ring-cream-50">
                  {locale === "fa"
                    ? new Intl.NumberFormat("fa-IR").format(Math.min(count, 9))
                    : count > 9
                      ? "9+"
                      : count}
                </span>
              )}
            </button>

            {/* CTA → inquiry system */}
            <Link
              href={href("/inquiry")}
              className={cn(
                "hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors sm:inline-flex",
                solid
                  ? "bg-gold-500 text-date-950 hover:bg-gold-400"
                  : "bg-cream-50/15 text-cream-50 backdrop-blur hover:bg-cream-50/25"
              )}
            >
              {dict.common.getQuote}
            </Link>

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={dict.header.toggleMenu}
              aria-expanded={menuOpen}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full transition-colors lg:hidden",
                solid
                  ? "text-date-900 hover:bg-date-900/5"
                  : "text-cream-50 hover:bg-cream-50/10"
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
                {nav.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium text-date-800 transition-colors hover:bg-cream-100"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-date-900/8" />
                <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-date-400">
                  {dict.header.collections}
                </p>
                {CATEGORY_SLUGS.map((slug) => (
                  <Link
                    key={slug}
                    href={href(`/products?category=${slug}`)}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-date-700 transition-colors hover:bg-cream-100"
                  >
                    <span>{dict.categories[slug].label}</span>
                    <span className="text-xs text-date-400">
                      {dict.categories[slug].short}
                    </span>
                  </Link>
                ))}
                <div className="my-2 h-px bg-date-900/8" />
                <LocaleSwitcher className="mx-3 my-1 w-fit sm:hidden" />
                <Link
                  href={href("/inquiry")}
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 flex items-center justify-center rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400"
                >
                  {dict.common.getQuote}
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

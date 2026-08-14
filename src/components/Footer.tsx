import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Newsletter } from "@/components/Newsletter";
import { CATEGORIES } from "@/lib/types";

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-cream-100/70 transition-colors hover:text-cream-50"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-date-950 text-cream-50">
      <div className="border-b border-cream-50/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream-100/60">
              Since 2009, Mr.Mazafati has imported single-origin Iranian dates for India&apos;s
              finest grocers, hotels and wholesalers — direct from the grove, cold-chained to
              your door.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-cream-100/70">
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-gold-500" /> 14 Merchant Street, Kolkata 700001
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold-500" /> +91 98300 00000
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold-500" /> hello@mrmazafati.in
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <FooterCol
              title="Shop"
              links={CATEGORIES.map((c) => ({
                label: c.label,
                href: `/products?category=${c.slug}`,
              }))}
            />
            <FooterCol
              title="Company"
              links={[
                { label: "Our Story", href: "/#story" },
                { label: "Wholesale", href: "/products?category=wholesale" },
                { label: "The Grove", href: "/#sourcing" },
                { label: "Contact", href: "/#contact" },
              ]}
            />
            <FooterCol
              title="Support"
              links={[
                { label: "Shipping & Delivery", href: "/#shipping" },
                { label: "Returns & Refunds", href: "/#returns" },
                { label: "FAQs", href: "/#faq" },
                { label: "Terms & Privacy", href: "/#terms" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-cream-50/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-cream-100/45 sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} Mr.Mazafati · Importers of Iranian Dates</p>
          <p className="flex items-center gap-1.5">
            Grown in Iran <span className="text-gold-500">✦</span> Loved across India
          </p>
        </div>
      </div>
    </footer>
  );
}

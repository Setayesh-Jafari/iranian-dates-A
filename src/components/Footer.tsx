import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
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
      <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">
        {title}
      </h4>
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
      {/* CTA banner */}
      <div className="border-b border-cream-50/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h3 className="font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
              Ready to import?
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream-100/70">
              Get in touch for pricing, MOQ and shipping options.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/inquiry"
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400"
              >
                Submit an inquiry
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream-100/60">
              Mr.Mazafati supplies Iranian dates for export &amp; wholesale —
              contact our team for product and export information.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-cream-100/70">
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-gold-500" />
                Iran — exact office address to be published after business
                verification
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold-500" />
                Phone / WhatsApp: contact details pending verification
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold-500" />
                Email: contact details pending verification — use the
                inquiry form to reach our team
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <FooterCol
              title="Products"
              links={CATEGORIES.map((c) => ({
                label: c.label,
                href: `/products?category=${c.slug}`,
              }))}
            />
            <FooterCol
              title="Company"
              links={[
                { label: "Our Story", href: "/#story" },
                { label: "Certifications", href: "/certifications" },
                { label: "Request a Quote", href: "/inquiry" },
                { label: "Contact", href: "/inquiry" },
              ]}
            />
            <FooterCol
              title="Export Info"
              links={[
                { label: "Shipping & Logistics", href: "/certifications" },
                { label: "Quality Process", href: "/certifications" },
                { label: "Payment Terms", href: "/inquiry" },
                { label: "FAQ", href: "/certifications" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-cream-50/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-cream-100/45 sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} Mr.Mazafati · Exporter of Iranian Dates</p>
          <p className="flex items-center gap-1.5">
            Grown in Iran <span className="text-gold-500">✦</span> Exported
            worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileCheck,
  FlaskConical,
  Globe,
  Leaf,
  ShieldCheck,
  Thermometer,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Export Documentation & Quality",
  description:
    "Overview of export documentation and quality processes for Iranian date shipments. Specifics are confirmed per shipment and destination.",
};

// NOTE (content policy): The items below describe documents that are commonly
// REQUIRED FOR or ARRANGED ON APPLICABLE agricultural export shipments from
// Iran. They are intentionally phrased so they do NOT assert that the company
// currently holds any certification. Company-held certificates and test
// results are pending business verification and must be confirmed before
// being presented as facts.

const CERTIFICATIONS = [
  {
    icon: FlaskConical,
    name: "Health Certificate",
    issuer: "Issued by the competent authority in the exporting country",
    description:
      "A health certificate is commonly requested for food consignments. Where required, laboratory testing details (e.g. microbiological parameters) are specified by the destination market and confirmed per shipment.",
    details: [
      "Requested by some destination authorities",
      "Arranged for applicable shipments",
      "Requirements confirmed per order",
    ],
  },
  {
    icon: Leaf,
    name: "Phytosanitary Certificate",
    issuer: "Issued by the national plant protection organization",
    description:
      "Phytosanitary certificates are generally required for plant products imported into many markets, including India. Requirements and treatment conditions are confirmed with the destination authority per shipment.",
    details: [
      "Commonly required for plant products",
      "Arranged for applicable shipments",
      "Conditions confirmed per order",
    ],
  },
  {
    icon: Globe,
    name: "Certificate of Origin",
    issuer: "Issued by the recognized chamber of commerce",
    description:
      "A certificate of origin confirms where goods were produced. It is commonly required for customs clearance and preferential tariff treatment, and is arranged for applicable shipments.",
    details: [
      "Confirms origin of goods",
      "Commonly required for customs",
      "Arranged for applicable shipments",
    ],
  },
  {
    icon: ShieldCheck,
    name: "Fumigation Certificate",
    issuer: "Issued by licensed treatment providers",
    description:
      "Some destinations require fumigation or treatment of consignments and packaging. Whether it is required, and the method used, depends on the destination's rules and is confirmed per shipment.",
    details: [
      "Required by some destinations",
      "Method per destination rules",
      "Confirmed per shipment",
    ],
  },
  {
    icon: FileCheck,
    name: "Quality / Grading Report",
    issuer: "Provided with the shipment where agreed",
    description:
      "Grading and specification reports (size, moisture, defect counts, etc.) can be agreed and included with a shipment. Exact parameters are defined in the order discussion.",
    details: [
      "Parameters agreed per order",
      "Provided where applicable",
      "Specification sheets on request",
    ],
  },
  {
    icon: Thermometer,
    name: "Temperature-Controlled Transport",
    issuer: "Arranged via carriers where required",
    description:
      "For varieties that benefit from it, temperature-controlled (reefer) transport can be arranged. Whether it is used, and at what setpoint, is confirmed with the carrier and the order terms.",
    details: [
      "Arranged where required",
      "Setpoints per product & route",
      "Confirmed in order terms",
    ],
  },
];

const QUALITY_STEPS = [
  {
    step: "01",
    title: "Sourcing",
    text: "Products are sourced in Iran. Sourcing partners and origin details can be shared on request during the order discussion.",
  },
  {
    step: "02",
    title: "Grading",
    text: "Dates are graded before export. The grading criteria applied to your order are confirmed with our team.",
  },
  {
    step: "03",
    title: "Testing",
    text: "Laboratory testing, where required by the destination market, is arranged before shipment. Test scope is agreed per order.",
  },
  {
    step: "04",
    title: "Packaging",
    text: "Packaging and labelling can be tailored to destination requirements. Available formats are listed on request.",
  },
  {
    step: "05",
    title: "Transport",
    text: "Shipping options — including temperature-controlled transport where applicable — are discussed per order and route.",
  },
  {
    step: "06",
    title: "Documentation",
    text: "Export documents required for your destination (origin, health, phytosanitary, etc.) are arranged for applicable shipments.",
  },
];

export default function CertificationsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-date-950 text-cream-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">
                Quality & compliance
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Export documentation,{" "}
                <span className="italic text-gold-300">explained clearly.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-100/70 sm:text-lg">
                Certification requirements for food imports vary by destination
                and product. The overview below describes documents that are
                commonly required for — and can be arranged on — applicable
                export shipments. Exact requirements are confirmed with our
                export team for every order.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-start gap-3 rounded-2xl border border-gold-500/30 bg-gold-50 px-5 py-4 text-sm text-date-700">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-gold-700" />
            <p>
              This page describes export documentation practices, not a list of
              certifications currently held by the company. Certification
              documents are available for applicable shipments — specifics are
              confirmed per order and destination.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Certifications grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Export documents"
            title="Documents commonly required for shipments"
            description="Whether a document applies to your shipment depends on the destination and the product. Where required, it is arranged as part of the order."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATIONS.map((cert, i) => (
            <Reveal key={cert.name} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-3xl border border-date-900/10 bg-white p-7">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-100">
                  <cert.icon size={22} className="text-gold-700" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-date-900">
                  {cert.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-gold-600">
                  {cert.issuer}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-date-600">
                  {cert.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {cert.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 text-xs text-date-500"
                    >
                      <BadgeCheck
                        size={14}
                        className="mt-0.5 shrink-0 text-gold-500"
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quality process */}
      <section className="bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Our process"
              title="From inquiry to delivery"
              description="Six steps, confirmed with you for each order."
            />
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {QUALITY_STEPS.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.06}>
                <div className="rounded-3xl bg-white p-7">
                  <span className="font-display text-3xl font-semibold text-gold-200">
                    {s.step}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-date-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-date-600">
                    {s.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <div className="rounded-[2rem] bg-gradient-to-br from-date-900 to-date-950 p-8 text-center sm:p-16">
            <h2 className="font-display text-3xl font-semibold text-cream-50 sm:text-4xl">
              Questions about documentation?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-cream-100/70">
              Export information — including which documents apply to your
              destination — is available upon request from our export team.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/inquiry"
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400"
              >
                Contact our export team <ArrowRight size={16} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border border-cream-50/25 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:border-cream-50/60 hover:bg-cream-50/5"
              >
                Browse the catalog
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

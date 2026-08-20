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
  Snowflake,
  Thermometer,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Certifications & Quality",
  description:
    "Our export certifications, lab testing protocols and quality assurance processes for Iranian date exports.",
};

const CERTIFICATIONS = [
  {
    icon: FlaskConical,
    name: "Health Certificate",
    issuer: "Iran Veterinary Organization",
    description:
      "Every batch is tested for microbiological safety — coliforms, E. coli, salmonella, mould and yeast. Issued per shipment.",
    details: [
      "Microbiological lab testing",
      "Issued per shipment",
      "Recognized by FSSAI (India)",
    ],
  },
  {
    icon: Leaf,
    name: "Phytosanitary Certificate",
    issuer: "Plant Protection Organization of Iran",
    description:
      "Confirms our dates are free from quarantine pests and diseases. Required for all agricultural exports from Iran.",
    details: [
      "Pest-free certification",
      "Required by Indian customs",
      "Issued per shipment",
    ],
  },
  {
    icon: Globe,
    name: "Certificate of Origin",
    issuer: "Iran Chamber of Commerce",
    description:
      "Officially certifies that our dates are grown and processed in Iran — specifically Bam, Kerman for Mazafati.",
    details: [
      "Confirms Iranian origin",
      "Required for preferential tariffs",
      "Issued per shipment",
    ],
  },
  {
    icon: ShieldCheck,
    name: "Fumigation Certificate",
    issuer: "Licensed fumigation companies at Bandar Abbas port",
    description:
      "Container and wooden pallets are fumigated with methyl bromide to ensure pest-free transit.",
    details: [
      "Container fumigation",
      "Pallet treatment",
      "Issued per shipment",
    ],
  },
  {
    icon: FileCheck,
    name: "Quality Certificate",
    issuer: "Internal QA + third-party labs",
    description:
      "Detailed grading report covering size, moisture, sugar content, colour uniformity and defect count.",
    details: [
      "Moisture: 15–18% for Mazafati",
      "Sugar: 65–70%",
      "Grade A/B/C classification",
    ],
  },
  {
    icon: Thermometer,
    name: "Cold Chain Protocol",
    issuer: "Internal logistics",
    description:
      "From harvest to delivery — our dates are stored and shipped at +5°C to preserve freshness and extend shelf life.",
    details: [
      "Reefer containers (+5°C)",
      "Cold storage at warehouse",
      "Temperature logging",
    ],
  },
];

const QUALITY_STEPS = [
  {
    step: "01",
    title: "Sourcing",
    text: "We work directly with grower families in Bam, Hormozgan and Bushehr — no middlemen.",
  },
  {
    step: "02",
    title: "Grading",
    text: "Every date is hand-sorted by size, colour and texture. Grade A for export, Grade B for domestic.",
  },
  {
    step: "03",
    title: "Lab Testing",
    text: "Independent labs test for microbiological safety, pesticide residues and heavy metals.",
  },
  {
    step: "04",
    title: "Packaging",
    text: "Vacuum-sealed, food-grade cartons on fumigated pallets. Labels include all nutritional and origin data.",
  },
  {
    step: "05",
    title: "Cold Chain",
    text: "Reefer containers at +5°C from our warehouse to your port. Temperature monitored throughout.",
  },
  {
    step: "06",
    title: "Documentation",
    text: "Full set of export certificates — Health, Phyto, Origin, Fumigation and Quality — accompany every shipment.",
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
                Every carton,{" "}
                <span className="italic text-gold-300">fully certified.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-100/70 sm:text-lg">
                We don&apos;t just export dates — we export trust. Every shipment
                leaves Iran with a complete set of internationally recognized
                certificates, backed by independent lab testing.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Certifications grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Export certificates"
            title="What we provide with every shipment"
            description="All certificates are issued fresh for each export consshipmentment."
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
              title="From grove to your warehouse"
              description="Six steps, zero shortcuts."
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
              Need certificates before ordering?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-cream-100/70">
              We&apos;re happy to share sample certificates and lab reports before
              you commit. Transparency is our standard.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/inquiry"
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400"
              >
                Request samples <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/989123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cream-50/25 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:border-cream-50/60 hover:bg-cream-50/5"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

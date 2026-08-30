import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL once the business verifies its public domain.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Mr.Mazafati — Iranian Dates · Export & Wholesale",
    template: "%s · Mr.Mazafati",
  },
  description:
    "Iranian dates export & wholesale — Mazafati, Piarom, Zahedi and more. Bulk supply inquiries from importers, wholesalers and distributors worldwide.",
  keywords: [
    "Iranian dates export",
    "Mazafati dates wholesale",
    "Piarom dates",
    "date exporter Iran",
    "wholesale dates",
    "bulk dates supplier",
  ],
  openGraph: {
    title: "Mr.Mazafati — Iranian Dates · Export & Wholesale",
    description:
      "Iranian dates for bulk export & wholesale. Request a quote for current availability, specifications and pricing.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#170e06",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-cream-50 font-sans text-date-900 antialiased">
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}

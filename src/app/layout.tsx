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
  metadataBase: new URL("https://mrmazafati.com"),
  title: {
    default: "Mr.Mazafati — Premium Iranian Dates · Export & Wholesale",
    template: "%s · Mr.Mazafati",
  },
  description:
    "Direct exporter of premium Iranian dates — Mazafati, Piarom, Zahedi and more. Bulk supply for importers, wholesalers and distributors worldwide. Cold-chained from Iran.",
  keywords: [
    "Iranian dates export",
    "Mazafati dates wholesale",
    "Piarom dates",
    "date exporter Iran",
    "wholesale dates",
    "bulk dates supplier",
  ],
  openGraph: {
    title: "Mr.Mazafati — Premium Iranian Dates · Export & Wholesale",
    description:
      "Direct exporter of premium Iranian dates. Bulk supply for importers worldwide. Cold-chained from the grove.",
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

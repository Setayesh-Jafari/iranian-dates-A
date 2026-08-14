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
  metadataBase: new URL("https://mrmazafati.in"),
  title: {
    default: "Mr.Mazafati — Iranian Dates for Indian Importers",
    template: "%s · Mr.Mazafati",
  },
  description:
    "Single-origin Iranian dates — Mazafati, Piarom, Zahedi and more — imported direct to India, cold-chained from our Kolkata warehouse. Premium quality for grocers, hotels and wholesalers.",
  keywords: [
    "Iranian dates",
    "Mazafati dates",
    "Piarom dates",
    "date importers India",
    "wholesale dates",
  ],
  openGraph: {
    title: "Mr.Mazafati — Iranian Dates for Indian Importers",
    description:
      "The world's finest dates, straight to India. Single-origin, cold-chained, direct from the grove.",
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

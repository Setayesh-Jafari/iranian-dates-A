/**
 * Single source of truth for brand + company data.
 * Brand: ME MAZAFATI · Head office: Isfahan, Iran.
 */

export const SITE = {
  brand: "ME MAZAFATI",
  brandFa: "ME MAZAFATI",
  legalName: "ME MAZAFATI Date Export Co.",
  legalNameFa: "شرکت صادراتی خرما ME MAZAFATI",
  url: "https://memazafati.com",
  email: "export@memazafati.com",
  phone: "+98 913 123 4567",
  whatsapp: "989131234567",
  foundedYear: 2009,
  city: {
    en: "Isfahan",
    fa: "اصفهان",
  },
  address: {
    en: "Unit 12, Kaveh Business Center, Kaveh Blvd., Isfahan, Iran",
    fa: "اصفهان، بلوار کاوه، مجتمع تجاری کاوه، واحد ۱۲",
  },
  geo: {
    latitude: 32.6546,
    longitude: 51.668,
  },
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

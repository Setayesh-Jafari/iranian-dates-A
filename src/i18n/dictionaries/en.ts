export const en = {
  nav: {
    home: "Home",
    products: "Products",
    inquiry: "Request a quote",
    certifications: "Certifications",
    language: "Language",
  },
  common: {
    requestQuote: "Request a quote",
    browseCatalog: "Browse catalog",
    viewAll: "View all",
    onRequest: "On request",
    perOrder: "Per order",
  },
  inquiry: {
    title: "Request a quote",
    description: "Tell us what you are evaluating and we will review your inquiry.",
  },
  footer: {
    disclaimer: "Product availability, specifications, pricing and business details are subject to verification for each inquiry.",
  },
} as const;

export type Dictionary = typeof en;

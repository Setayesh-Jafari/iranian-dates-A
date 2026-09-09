/**
 * English dictionary.
 *
 * IMPORTANT: this object is deliberately NOT declared `as const`.
 * `Dictionary` is derived from it with `typeof`, and a literal type would
 * force every other locale to repeat the English strings verbatim (the
 * Persian values would not be assignable). Keeping the value type as plain
 * `string` gives exact key parity checking without value-type locking.
 *
 * Content policy: the strings below are the verified, intentionally neutral
 * business wording already present on the site. Translations must carry the
 * same meaning and must not introduce claims, figures, contacts or
 * certifications that are not already stated here.
 */

export const en = {
  meta: {
    siteName: "Mr.Mazafati",
    title: "Mr.Mazafati — Iranian Dates · Export & Wholesale",
    description:
      "Iranian dates export & wholesale — Mazafati, Piarom, Zahedi and more. Bulk supply inquiries from importers, wholesalers and distributors worldwide.",
    template: "%s · Mr.Mazafati",
    productsTitle: "Product Catalog",
    productsDescription:
      "Browse our full range of Iranian dates and date products — Mazafati, Piarom, Zahedi and more. Bulk supply inquiries for importers and wholesalers worldwide.",
    certificationsTitle: "Export Documentation & Quality",
    certificationsDescription:
      "Overview of export documentation and quality processes for Iranian date shipments. Specifics are confirmed per shipment and destination.",
    productNotFound: "Product not found",
  },

  brand: {
    name: "Mr.Mazafati",
    tagline: "Iranian Dates",
  },

  locale: {
    label: "Language",
    en: "English",
    fa: "فارسی",
  },

  nav: {
    home: "Home",
    products: "Products",
    premium: "Premium",
    wholesale: "Wholesale",
    certifications: "Certifications",
    story: "Our Story",
    getQuote: "Get a Quote",
    openInquiryList: "Open inquiry list",
    toggleMenu: "Toggle menu",
    collections: "Collections",
    announcement1: "Iranian dates · Export & wholesale",
    announcement2: "Mazafati & premium date products",
    announcement3: "Bulk inquiries welcome",
  },

  common: {
    requestQuote: "Request a quote",
    browseCatalog: "Browse catalog",
    browseProducts: "Browse products",
    browseAllProducts: "Browse all products",
    continueBrowsing: "Continue browsing",
    viewAll: "View all",
    onRequest: "On request",
    perOrder: "Per order",
    close: "Close",
    filters: "Filters",
    closeFilters: "Close filters",
    clearAllFilters: "Clear all filters",
    searchPlaceholder: "Search dates…",
    allProducts: "All Products",
    category: "Category",
    price: "Price",
    rating: "Rating",
    productOne: "product",
    productMany: "products",
    productCount: "{count} {noun}",
    showProducts: "Show {count} {noun}",
    addToInquiry: "Add to inquiry",
    addToInquiryList: "Add to inquiry list",
    addedToInquiry: "Added to inquiry",
    viewInquiryList: "View inquiry list",
    addToInquiryAria: "Add {name} to inquiry",
    requestPricing: "Request pricing",
    origin: "Origin",
    pack: "Pack",
    quantity: "Quantity",
    contactTeam: "Contact our export team",
  },

  categories: {
    premium: { label: "Premium Dates", short: "Mazafati, Piarom & more" },
    soft: { label: "Soft Dates", short: "Kabkab, Rabbi & moist picks" },
    dry: { label: "Dry & Semi-Dry", short: "Zahedi, Sayer & more" },
    products: { label: "Date Products", short: "Syrup, paste, sugar & more" },
    gifts: { label: "Gifts & Gifting", short: "Curated boxes & stuffed dates" },
    wholesale: { label: "Wholesale", short: "Bulk cartons for importers" },
  },

  units: {
    kg: "kg",
    cartons: "cartons",
    metric_tons: "metric tons",
  },

  countries: {
    India: "India",
    "United Arab Emirates": "United Arab Emirates",
    "Saudi Arabia": "Saudi Arabia",
    Iraq: "Iraq",
    Pakistan: "Pakistan",
    Bangladesh: "Bangladesh",
    "Sri Lanka": "Sri Lanka",
    Turkey: "Turkey",
    Russia: "Russia",
    Germany: "Germany",
    "United Kingdom": "United Kingdom",
    "United States": "United States",
    Canada: "Canada",
    Australia: "Australia",
    Other: "Other",
  },

  sorts: {
    featured: "Featured",
    priceAsc: "Price: Low to High",
    priceDesc: "Price: High to Low",
    rating: "Top Rated",
    newest: "Newest",
  },

  priceBrackets: {
    under500: "Under ₹500",
    from500to1000: "₹500 – ₹1,000",
    from1000to2000: "₹1,000 – ₹2,000",
    over2000: "₹2,000 & up",
  },

  ratingFilters: {
    fourAndHalf: "4.5★ & up",
    four: "4★ & up",
  },

  home: {
    heroBadge: "IRANIAN MAZAFATI DATES",
    heroTitleA: "Iranian Dates, Prepared for",
    heroTitleB: "Global Markets",
    heroText:
      "We source and prepare Iranian Mazafati dates for international buyers, with flexible packaging options and a focus on consistent quality and export-ready supply.",
    heroCtaPrimary: "Request an Export Quote",
    heroCtaSecondary: "Explore Mazafati Dates",
    heroPoint1: "Export information available upon request",
    heroPoint2: "Certification documents available for applicable shipments",
    heroAlt: "Premium Iranian dates in a bowl (placeholder stock imagery)",

    marquee: [
      "Premium Iranian dates",
      "Bulk & wholesale",
      "Mazafati · Piarom · Zahedi",
      "Request a quote",
      "Specs on request",
      "Export inquiries welcome",
      "Worldwide shipping inquiries",
      "Pricing on inquiry",
    ],

    collectionsEyebrow: "The Collections",
    collectionsTitle: "Curated for every market",
    collectionsText:
      "Six collections — from flagship Mazafati to bulk cartons for the trade.",

    signature: "Signature",
    flagshipEyebrow: "The Flagship",
    flagshipTitle: "Mazafati, our signature variety.",
    flagshipText:
      "Mazafati is a classic soft Iranian date variety, offered for wholesale and export. Grade, size and packing specifications are available upon request.",
    flagshipAlt: "Mazafati dates (placeholder stock imagery)",
    fullDetails: "Full details",

    featuredEyebrow: "Export range",
    featuredTitle: "Our product catalog",
    featuredText:
      "Varieties and date products available for bulk and wholesale inquiries.",

    storyEyebrow: "About us",
    storyTitle: "Iranian dates, supplied for export",
    storyText:
      "Mr.Mazafati supplies Iranian dates to importers, wholesalers and distributors. Company background, sourcing details and capacity are available upon request from our export team.",
    storyAlt: "Date palms at golden hour (placeholder stock imagery)",

    chipOriginGrading: "origin & grading details",
    chipSpecifications: "product specifications",
    chipShipping: "shipping & Incoterms",
    chipCollections: "collections listed",

    howEyebrow: "Working with us",
    howTitle: "How an order comes together",
    howSteps: [
      {
        title: "Build an inquiry",
        text: "Add the products you’re evaluating to your inquiry list and submit the form with your destination and volume.",
      },
      {
        title: "Receive a quote",
        text: "We respond with current availability, specifications, packing options and pricing for your order.",
      },
      {
        title: "Confirm the details",
        text: "Incoterms, documentation and shipping options are arranged per order and destination.",
      },
    ],
  },

  products: {
    eyebrowCatalog: "Export catalog",
    eyebrowCollection: "Collection",
    title: "Full Product Catalog",
    resultsFor: "Results for “{q}”",
    text:
      "Add products to your inquiry list and request a custom quote. Specifications and current availability are provided with every quote.",
    emptyTitle: "No products found",
    emptyText:
      "We couldn’t match your search. Try a different keyword or clear the filters.",
  },

  product: {
    breadcrumbHome: "Home",
    breadcrumbProducts: "Products",
    reviewsCount: "{rating} · {count} reviews",
    noReviews: "No customer reviews published yet.",
    originLabel: "Origin: {origin}",
    packLabel: "Pack: {weight} {unit}",
    infoShipping: "Shipping options on request",
    infoPack: "Pack options on request",
    infoSpecs: "Specs on request",
    originGrading: "Origin & grading",
    region: "Region",
    packSize: "Pack size",
    specifications: "Specifications",
    detailsOnRequest: "Details available on request.",
    goodToKnow: "Good to know",
    goodToKnowItems: [
      "Product specifications, grading and packing details are available upon request.",
      "Certification documents are available for applicable shipments — requirements are confirmed per destination.",
      "Shipping options and Incoterms are discussed with our export team for each order.",
    ],
    relatedEyebrow: "Related products",
    relatedTitle: "You may also be interested in",
    relatedText: "From the same collection.",
    requestFullQuote: "Request a full quote",
    shippingNote: "Shipping options and Incoterms are confirmed per order.",
    specsNote: "Product specifications available upon request.",
    galleryAlt: "{name} — image {index}",
    viewImage: "View image {index}",
  },

  certifications: {
    eyebrow: "Quality & compliance",
    titleA: "Export documentation,",
    titleB: "explained clearly.",
    text:
      "Certification requirements for food imports vary by destination and product. The overview below describes documents that are commonly required for — and can be arranged on — applicable export shipments. Exact requirements are confirmed with our export team for every order.",
    disclaimer:
      "This page describes export documentation practices, not a list of certifications currently held by the company. Certification documents are available for applicable shipments — specifics are confirmed per order and destination.",
    gridEyebrow: "Export documents",
    gridTitle: "Documents commonly required for shipments",
    gridText:
      "Whether a document applies to your shipment depends on the destination and the product. Where required, it is arranged as part of the order.",
    processEyebrow: "Our process",
    processTitle: "From inquiry to delivery",
    processText: "Six steps, confirmed with you for each order.",
    ctaTitle: "Questions about documentation?",
    ctaText:
      "Export information — including which documents apply to your destination — is available upon request from our export team.",
    ctaPrimary: "Contact our export team",
    ctaSecondary: "Browse the catalog",
    items: [
      {
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
        name: "Fumigation Certificate",
        issuer: "Issued by licensed treatment providers",
        description:
          "Some destinations require fumigation or treatment of consignments and packaging. Whether it is required, and the method used, depends on the destination’s rules and is confirmed per shipment.",
        details: [
          "Required by some destinations",
          "Method per destination rules",
          "Confirmed per shipment",
        ],
      },
      {
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
    ],
    steps: [
      {
        title: "Sourcing",
        text: "Products are sourced in Iran. Sourcing partners and origin details can be shared on request during the order discussion.",
      },
      {
        title: "Grading",
        text: "Dates are graded before export. The grading criteria applied to your order are confirmed with our team.",
      },
      {
        title: "Testing",
        text: "Laboratory testing, where required by the destination market, is arranged before shipment. Test scope is agreed per order.",
      },
      {
        title: "Packaging",
        text: "Packaging and labelling can be tailored to destination requirements. Available formats are listed on request.",
      },
      {
        title: "Transport",
        text: "Shipping options — including temperature-controlled transport where applicable — are discussed per order and route.",
      },
      {
        title: "Documentation",
        text: "Export documents required for your destination (origin, health, phytosanitary, etc.) are arranged for applicable shipments.",
      },
    ],
  },

  inquiry: {
    eyebrow: "Wholesale inquiry",
    title: "Request a Quote",
    subtitle:
      "Fill in your details and our export team will get back to you with pricing, MOQ and shipping options.",
    continueBrowsing: "Continue browsing",
    contactDetails: "Contact details",
    fullName: "Full name",
    fullNamePlaceholder: "John Smith",
    companyName: "Company name",
    companyNamePlaceholder: "Your company name",
    businessEmail: "Business email",
    businessEmailPlaceholder: "you@company.com",
    phone: "Phone / WhatsApp",
    phonePlaceholder: "+91 98XXX XXXXX",
    shippingDestination: "Shipping destination",
    country: "Country",
    selectCountry: "Select country",
    city: "Destination city / port",
    cityPlaceholder: "Where should the shipment go?",
    additionalRequirements: "Additional requirements",
    message: "Message / Requirements",
    messagePlaceholder:
      "Packaging preferences, documentation needs, quality expectations, delivery timeline — anything we should know (optional).",
    paymentTerms: "Payment & terms",
    termsTitle: "Payment & terms are agreed per order",
    termsBody1:
      "Payment and delivery terms are discussed with our export team on a per-order basis, depending on order volume and destination.",
    termsBody2:
      "Final pricing depends on quantity, packaging requirements, and destination. We’ll include all details in our quote.",
    selectedProducts: "Selected products",
    quantityHint:
      "Quantity / Volume — tell us how much you need per product.",
    quantityAria: "Quantity for {name}",
    unitAria: "Unit for {name}",
    quantityPlaceholder: "Quantity",
    pricingNote:
      "Pricing will be provided based on your required quantity and destination.",
    submit: "Submit inquiry · {count} {noun}",
    submitting: "Sending inquiry…",
    reviewNote: "Your inquiry will be reviewed by our export team",
    errorEmptyList: "Please add at least one product to your inquiry list.",
    errorQuantity:
      "Please enter a requested quantity (a number greater than zero) for every product in your inquiry list.",
    errorGeneric: "Something went wrong — please try again.",
    successTitle: "Inquiry submitted!",
    successBody:
      "Your inquiry {id} has been received and recorded. Please keep your reference number for any follow-up.",
    emptyTitle: "Your inquiry list is empty",
    emptyText:
      "Browse our catalog and add products you’re interested in. Then come back here to submit your inquiry for a custom quote.",
  },

  drawer: {
    title: "Inquiry List",
    emptyTitle: "No products selected",
    emptyText:
      "Browse our catalog and add products you’re interested in. Then submit an inquiry for a custom quote.",
    quantityValue: "Quantity: {quantity} {unit}",
    quantityPending: "Quantity: set on the inquiry form",
    removeItem: "Remove {name}",
    footerNote:
      "Select products and submit your inquiry. Our team will respond with pricing and current availability.",
    submit: "Submit Inquiry",
  },

  reviews: {
    customerReviews: "Customer reviews",
    countReviews: "{count} reviews",
    noReviews: "No customer reviews published yet.",
    writeReview: "Write a review",
    shareExperience: "Share your experience with this harvest.",
    yourRating: "Your rating",
    starLabel: "{count} star",
    starsLabel: "{count} stars",
    name: "Name *",
    namePlaceholder: "Rohit M.",
    city: "City",
    cityPlaceholder: "Mumbai",
    headlinePlaceholder: "Headline (optional)",
    commentPlaceholder:
      "What did you think of the quality, texture and taste? (min. 10 characters)",
    submit: "Submit review",
    thankYou: "Thank you! Your review is live.",
    errorGeneric: "Something went wrong",
    ratedOutOf: "Rated {value} out of 5",
  },

  newsletter: {
    title: "Fresh harvests, before they land",
    text:
      "Join the importers’ list for early access to new-season stock, bulk pricing and tasting notes — straight from the grove.",
    emailPlaceholder: "Your email address",
    subscribe: "Subscribe",
    done: "You’re on the list — shukran!",
  },

  footer: {
    ctaTitle: "Ready to import?",
    ctaText: "Get in touch for pricing, MOQ and shipping options.",
    submitInquiry: "Submit an inquiry",
    about:
      "Mr.Mazafati supplies Iranian dates for export & wholesale — contact our team for product and export information.",
    address:
      "Iran — exact office address to be published after business verification",
    phone: "Phone / WhatsApp: contact details pending verification",
    email:
      "Email: contact details pending verification — use the inquiry form to reach our team",
    colProducts: "Products",
    colCompany: "Company",
    colExportInfo: "Export Info",
    linkStory: "Our Story",
    linkCertifications: "Certifications",
    linkRequestQuote: "Request a Quote",
    linkContact: "Contact",
    linkShipping: "Shipping & Logistics",
    linkQuality: "Quality Process",
    linkPayment: "Payment Terms",
    linkFaq: "FAQ",
    rights: "© {year} Mr.Mazafati · Exporter of Iranian Dates",
    grownInIran: "Grown in Iran",
    exportedWorldwide: "Exported worldwide",
  },

  notFound: {
    title: "Page not found",
    text: "The page you were looking for does not exist or has moved.",
    cta: "Back to home",
  },
};

/** Shape every locale dictionary must match exactly (key parity enforced). */
export type Dictionary = typeof en;

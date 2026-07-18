import mongoose, { Model, Schema } from "mongoose";

export type ImageAsset = {
  id: string;
  title: string;
  alt: string;
  caption?: string;
  url: string;
  mobileUrl?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  page?: string;
  tags?: string[];
  status?: "published" | "hidden" | "draft";
  focalPoint?: { x: number; y: number };
  order?: number;
};

export type ServicePriceTier = {
  label: string;
  priceLabel: string;
};

export type Service = {
  slug: string;
  name: string;
  eyebrow: string;
  summary: string;
  description: string;
  forWhom: string;
  benefits: string[];
  includes: string[];
  process: string[];
  faqs: { question: string; answer: string }[];
  related: string[];
  images: ImageAsset[];
  featured?: boolean;
  status?: "published" | "draft" | "coming-soon";
  priceLabel?: string;
  duration?: string;
  priceTiers?: ServicePriceTier[];
};

export type PageBlock = {
  type: "story" | "imageGrid" | "cards" | "process" | "faq" | "cta" | "gallery" | "shop" | "testimonials";
  eyebrow?: string;
  title: string;
  body?: string;
  items?: { title: string; body: string; image?: ImageAsset; href?: string }[];
  images?: ImageAsset[];
};

export type PageContent = {
  slug: string;
  title: string;
  navTitle: string;
  seoTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    images: ImageAsset[];
  };
  blocks: PageBlock[];
  status?: "published" | "draft";
};

export type PricingPackage = {
  slug: string;
  service: string;
  name: string;
  priceLabel: string;
  duration?: string;
  features: string[];
  featured?: boolean;
  status?: "published" | "hidden";
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  body: string;
  featuredImage: ImageAsset;
  inlineImages: ImageAsset[];
  status?: "published" | "draft";
};

export type Product = {
  slug: string;
  title: string;
  description: string;
  priceLabel: string;
  compareAtPriceLabel?: string;
  status: "published" | "draft" | "inquiry" | "coming-soon";
  images: ImageAsset[];
  sizes: string[];
  colors: string[];
  inventory?: number;
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  credentials: string[];
  image: ImageAsset;
  status?: "published" | "draft";
};

export type Testimonial = {
  slug: string;
  reviewer: string;
  petName?: string;
  service: string;
  rating: number;
  quote: string;
  location?: string;
  image: ImageAsset;
  status?: "published" | "draft";
  sample?: boolean;
};

export type Faq = {
  slug: string;
  question: string;
  answer: string;
  category: string;
  serviceSlug?: string;
  status?: "published" | "draft";
  order?: number;
};

export type BookingRequest = {
  customerName: string;
  email: string;
  phone: string;
  address?: string;
  preferredContact?: string;
  service: string;
  packageSelection?: string;
  addonSelected?: boolean;
  estimatedTotal?: string;
  preferredDate: string;
  preferredTime: string;
  pickupTime?: string;
  dropoffTime?: string;
  shuttleRequested?: string;
  petName: string;
  petType: string;
  breed?: string;
  age?: string;
  weight?: string;
  sex?: string;
  spayNeuterStatus?: string;
  temperament?: string;
  specialNeeds?: string;
  vaccinationStatus?: string;
  fullName?: string;
  medicalDetails?: string;
  allergies?: string;
  feedingInstructions?: string;
  emergencyContact?: string;
  veterinarian?: string;
  behaviouralNotes?: string;
  vaccinationUploadNote?: string;
  giftCardCode?: string;
  paymentNote?: string;
  notes?: string;
  policyAgreement: boolean;
  status?: "New" | "Awaiting Review" | "Awaiting Payment" | "Confirmed" | "In Progress" | "Completed" | "Cancelled" | "Declined" | "Contacted" | "Pending";
  paymentStatus?: "Not Required" | "Payment Pending" | "Deposit Pending" | "Paid" | "Refunded";
  adminNotes?: string;
};

export type GiftCardOrder = {
  denomination: "CAD $50" | "CAD $100";
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  message?: string;
  deliveryDate?: string;
  paymentStatus?: "Payment Pending" | "Paid";
  status?: "New" | "Completed" | "Cancelled";
};

export const brand = {
  name: "DTdogs.ca",
  secondaryName: "Hand & Paw",
  formerly: "Handandpaw.ca and Handandpaw.in",
  formerlyShort: "(Handandpaw.ca / Handandpaw.in)",
  phone: "+1 (437) 937-5112",
  email: "connect@dtdogs.ca",
  hours: "Monday–Sunday, 7:00 AM–9:00 PM",
  boardingNote: "Boarding available 24/7 according to city bylaws and confirmed booking arrangements.",
  tagline: "Professional and structured pet care in Downtown Toronto, serving across the GTA in every season.",
  whatsapp: "https://wa.me/14379375112",
  payments: "Pay online, in store, Interac, Amex, or with a DTdogs.ca gift card after confirmation.",
  locations: [
    "218 Queen Street East, Toronto, ON M5A 1S3",
    "Floor 15, 65 High Park Avenue, Toronto, ON M6P 2R7",
  ],
  lines: [
    "Serving across GTA",
    "Operating all season across GTA",
    "Located in Downtown, Toronto",
    "We are a team of #petpeople and #petparents",
  ],
  palette: {
    forest: "#3D634E",
    coral: "#E89373",
    burgundy: "#993333",
    cream: "#F8F3EA",
    sage: "#DCE7DF",
    ink: "#202522",
  },
};

export const mediaLibrary: ImageAsset[] = [
  {
    id: "hero-caregiver",
    title: "Calm dog with caregiver",
    alt: "Calm dog sitting beside a caring handler in warm natural light",
    caption: "Structured, nurturing care across the Greater Toronto Area.",
    url: "/images/home/hero-caregiver.webp",
    width: 1800,
    height: 1200,
    page: "home",
    tags: ["hero", "care"],
    status: "published",
  },
  {
    id: "floating-pup",
    title: "Happy relaxed dog portrait",
    alt: "Happy relaxed dog portrait against a warm interior background",
    url: "/images/home/floating-pup.webp",
    width: 1200,
    height: 1500,
    page: "home",
    tags: ["portrait"],
    status: "published",
  },
  {
    id: "floating-pup-2",
    title: "Calm dog portrait",
    alt: "Happy relaxed dog sitting calmly in a warm modern indoor space",
    url: "/images/home/floating-pup-2.webp",
    width: 1200,
    height: 1200,
    page: "about",
    tags: ["brand", "portrait"],
    status: "published",
  },
  {
    id: "walk-toronto",
    title: "Neighbourhood dog walk",
    alt: "Dog enjoying a structured neighbourhood walk in Toronto",
    url: "/images/services/serviceswalk-toronto.webp",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["dog-walking"],
    status: "published",
  },
  {
    id: "boarding-home",
    title: "Home style boarding rest",
    alt: "Dog resting comfortably in a clean home style boarding environment",
    url: "/images/services/servicesboarding-home.webp",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["boarding"],
    status: "published",
  },
  {
    id: "daycare-play",
    title: "Supervised daycare play",
    alt: "Dogs enjoying supervised social play in a bright daycare setting",
    url: "/images/services/servicesdaycare-play.webp",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["daycare"],
    status: "published",
  },
  {
    id: "pet-visit",
    title: "In-home pet visit",
    alt: "Caregiver offering gentle attention during an in-home pet visit",
    url: "/images/services/servicespet-visit.webp",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["pet-visits"],
    status: "published",
  },
  {
    id: "house-sitting",
    title: "House sitting comfort",
    alt: "Dog relaxing in a familiar home environment during house sitting",
    url: "/images/services/serviceshouse-sitting.webp",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["house-sitting"],
    status: "published",
  },
  {
    id: "chauffeur",
    title: "Secure pet chauffeur ride",
    alt: "Dog safely seated for a premium pet chauffeur ride",
    url: "/images/services/serviceschauffeur.webp",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["chauffeur"],
    status: "published",
  },
  {
    id: "grooming",
    title: "Grooming detail",
    alt: "Well-groomed dog with a calm confident expression",
    url: "/images/services/servicesgrooming.webp",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["grooming"],
    status: "published",
  },
  {
    id: "nails",
    title: "Gentle paw care",
    alt: "Close-up of a dog paw receiving gentle hygiene care",
    url: "/images/services/servicesnails.webp",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["nail-trimming"],
    status: "published",
  },
  {
    id: "training",
    title: "Calm training moment",
    alt: "Dog responding calmly during a behaviour-informed training moment",
    url: "/images/services/servicestraining.webp",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["training"],
    status: "published",
  },
  {
    id: "excursion",
    title: "Guided outdoor excursion",
    alt: "Dog enjoying a safe guided outdoor adventure on leash",
    url: "/images/services/servicesexcursion.webp",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["excursions"],
    status: "published",
  },
  {
    id: "about-founder",
    title: "Founder care portrait",
    alt: "Pet-care professional connecting with a calm dog",
    url: "/images/about/about-founder.webp",
    width: 1400,
    height: 1600,
    page: "about",
    tags: ["team"],
    status: "published",
  },
  {
    id: "about-1",
    title: "Founder care portrait",
    alt: "Pet-care professional sitting with a happy dog in a bright care space",
    url: "/images/about/about-1.png",
    width: 1024,
    height: 1280,
    page: "about",
    tags: ["story", "team"],
    status: "published",
  },
  {
    id: "about-2",
    title: "Clean care environment",
    alt: "Bright clean dog-care environment with calm dogs resting",
    url: "/images/about/about-2.png",
    width: 1024,
    height: 576,
    page: "about",
    tags: ["story", "facility"],
    status: "published",
  },
  {
    id: "about-3",
    title: "Toronto pet lifestyle",
    alt: "Dog handler walking a happy dog through a leafy neighbourhood",
    url: "/images/about/about-3.png",
    width: 819,
    height: 1024,
    page: "about",
    tags: ["story", "toronto"],
    status: "published",
  },
  {
    id: "structured-routines-card",
    title: "Structured routines",
    alt: "Calm dog receiving gentle structured care in a premium indoor setting",
    url: "/images/about/Structured-Routines-Card.jpg",
    width: 1400,
    height: 1050,
    page: "about",
    tags: ["guides", "routine"],
    status: "published",
  },
  {
    id: "honest-communication-card",
    title: "Honest communication",
    alt: "Happy dog near a smartphone and care notebook for owner updates",
    url: "/images/about/Honest-Communication-Card.jpg",
    width: 1400,
    height: 1050,
    page: "about",
    tags: ["guides", "communication"],
    status: "published",
  },
  {
    id: "clean-environments-card",
    title: "Clean environments",
    alt: "Clean modern pet-care environment with a happy dog and caregiver",
    url: "/images/about/Clean-Environments-Card.jpg",
    width: 1400,
    height: 1050,
    page: "about",
    tags: ["guides", "facility"],
    status: "published",
  },
  {
    id: "facility",
    title: "Clean care environment",
    alt: "Bright clean care environment prepared for pet comfort",
    url: "/images/about/facility.webp",
    width: 1600,
    height: 1000,
    page: "about",
    tags: ["facility"],
    status: "published",
  },
  {
    id: "toronto-lifestyle",
    title: "Toronto pet lifestyle",
    alt: "Dog and caregiver enjoying a Toronto neighbourhood setting",
    url: "/images/about/toronto-lifestyle.webp",
    width: 1600,
    height: 1000,
    page: "about",
    tags: ["toronto"],
    status: "published",
  },
  {
    id: "trust-full",
    title: "Trusted calm routine",
    alt: "Dog relaxing during a calm supervised care routine",
    url: "/images/home/trust-full.webp",
    width: 1800,
    height: 1000,
    page: "home",
    tags: ["trust"],
    status: "published",
  },
  {
    id: "testimonial-pet",
    title: "Happy client dog",
    alt: "Happy client dog looking comfortable and cared for",
    url: "/images/testimonial/testimonial-pet.webp",
    width: 1200,
    height: 1200,
    page: "testimonials",
    tags: ["testimonial"],
    status: "published",
  },
  {
    id: "shop-mom",
    title: "Dog Mom long-sleeve shirt",
    alt: "Dog Mom long-sleeve shirt product photography placeholder",
    url: "/images/shop/shop-mom.webp",
    width: 1200,
    height: 1400,
    page: "shop",
    tags: ["product"],
    status: "published",
  },
  {
    id: "shop-dad",
    title: "Dog Dad long-sleeve shirt",
    alt: "Dog Dad long-sleeve shirt product photography placeholder",
    url: "/images/shop/shop-dad.webp",
    width: 1200,
    height: 1400,
    page: "shop",
    tags: ["product"],
    status: "published",
  },
  {
    id: "shop-hero-1",
    title: "Dog Mom hero apparel",
    alt: "Dog Mom apparel styled for the DTdogs shop hero",
    url: "/images/shop/shop-1.png",
    width: 1400,
    height: 1000,
    page: "shop",
    tags: ["hero", "apparel"],
    status: "published",
  },
  {
    id: "shop-hero-2",
    title: "Dog Dad hero apparel",
    alt: "Dog Dad apparel styled for the DTdogs shop hero",
    url: "/images/shop/shop-2.png",
    width: 1400,
    height: 1000,
    page: "shop",
    tags: ["hero", "apparel"],
    status: "published",
  },
  {
    id: "gift-card-50-image",
    title: "DTdogs $50 gift card",
    alt: "Premium DTdogs digital gift card product image for CAD $50",
    url: "/images/shop/gift50.png",
    width: 1400,
    height: 1050,
    page: "shop",
    tags: ["gift card", "product"],
    status: "published",
  },
  {
    id: "gift-card-100-image",
    title: "DTdogs $100 gift card",
    alt: "Premium DTdogs digital gift card product image for CAD $100",
    url: "/images/shop/gift100.png",
    width: 1400,
    height: 1050,
    page: "shop",
    tags: ["gift card", "product"],
    status: "published",
  },
  {
    id: "booking-bg",
    title: "Booking care moment",
    alt: "Calm dog-care moment used for booking call to action",
    url: "/images/booking/booking-bg.webp",
    width: 1800,
    height: 1100,
    page: "booking",
    tags: ["booking"],
    status: "published",
  },
  {
    id: "booking-bg-2",
    title: "Care planning moment",
    alt: "Calm dog near a neatly arranged care checklist, leash and notebook",
    url: "/images/booking/booking-bg-2.webp",
    width: 1800,
    height: 1100,
    page: "about",
    tags: ["brand", "booking"],
    status: "published",
  },
  {
    id: "contact-dog",
    title: "Friendly contact portrait",
    alt: "Friendly dog portrait inviting pet parents to contact DTdogs",
    url: "/images/contact/contact-dog.webp",
    width: 1400,
    height: 1100,
    page: "contact",
    tags: ["contact"],
    status: "published",
  },
  {
    id: "blog-cover",
    title: "Care guide journal cover",
    alt: "Dog resting while pet-care notes are prepared nearby",
    url: "/images/blog/blog-cover.webp",
    width: 1400,
    height: 1000,
    page: "blog",
    tags: ["journal"],
    status: "published",
  },
  {
    id: "gallery-hero-1",
    title: "Courtyard dog walk",
    alt: "Small happy dog walking calmly through a clean modern outdoor courtyard",
    url: "/images/gallery/gallery-1.png",
    width: 1400,
    height: 1050,
    page: "gallery",
    tags: ["hero", "courtyard"],
    status: "published",
  },
  {
    id: "gallery-hero-2",
    title: "Autumn leash walk",
    alt: "Dog walking safely on leash through a warm autumn park trail",
    url: "/images/gallery/gallery-2.png",
    width: 1400,
    height: 1050,
    page: "gallery",
    tags: ["hero", "adventure"],
    status: "published",
  },
  {
    id: "gallery-hero-3",
    title: "Indoor care moment",
    alt: "Dogs calmly gathered in a cozy modern indoor care lounge",
    url: "/images/gallery/gallery-3.png",
    width: 1200,
    height: 1200,
    page: "gallery",
    tags: ["hero", "indoor care"],
    status: "published",
  },
  {
    id: "policy-care",
    title: "Care policy image",
    alt: "Leash and pet-care details arranged neatly on a warm surface",
    url: "/images/policy/policy-care.webp",
    width: 1400,
    height: 1000,
    page: "policy",
    tags: ["policy"],
    status: "published",
  },
];

const img = (id: string) => mediaLibrary.find((image) => image.id === id) ?? mediaLibrary[0];

const placeholderAnswer = "Editable placeholder: final client-approved answer is pending from the source FAQ material.";

export const galleryImages: ImageAsset[] = [
  ...Array.from({ length: 33 }).map((_, index) => ({
    id: `gallery-slot-${String(index + 1).padStart(2, "0")}`,
    title: `Gallery slot ${index + 1}`,
    alt: `DTdogs gallery image slot ${index + 1}`,
    caption: "Approved DTdogs gallery photography.",
    url: `/images/gallery/gallery-slot-${String(index + 1).padStart(2, "0")}.webp`,
    width: 1400,
    height: 1000,
    page: "gallery",
    tags: ["Gallery"],
    order: index + 1,
  })),
];

export const treatImages: ImageAsset[] = [
  {
    ...img("policy-care"),
    id: "treats-flat-lay",
    title: "Treats flat lay placeholder",
    alt: "Premium dog treats arranged on a warm cream surface",
    caption: "Replace with approved DTdogs treat photography.",
    url: "/images/treats/treat-large.jpg",
    page: "treats",
    tags: ["Treats", "Product"],
    order: 1,
  },
  {
    ...img("floating-pup"),
    id: "happy-dog-treat",
    title: "Happy dog treat moment",
    alt: "Happy dog enjoying a treat moment in warm natural light",
    caption: "Use this slot for a dog enjoying one of the treats.",
    url: "/images/treats/treat-topright.jpg",
    page: "treats",
    tags: ["Treats", "Happy Clients"],
    order: 2,
  },
  {
    ...img("shop-mom"),
    id: "packaged-treat-slot",
    title: "Packaged treat placeholder",
    alt: "Editable product photography slot for packaged dog treats",
    caption: "Upload packaging or product shots here once available.",
    url: "/images/treats/treat-bottomright.jpg",
    page: "treats",
    tags: ["Treats", "Product"],
    order: 3,
  },
];

const faqSeed = (category: string, questions: string[], startOrder: number): Faq[] =>
  questions.map((question, index) => ({
    slug: `${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
    question,
    answer: placeholderAnswer,
    category,
    status: "published",
    order: startOrder + index,
  }));

export const serviceAddOn = {
  name: "Add-On",
  duration: "10 minutes",
  priceLabel: "$5",
  description: "An optional ten-minute add-on that can be included with an eligible pet-care service.",
};

const groomingImages = [img("grooming"), img("nails"), img("facility"), img("testimonial-pet"), img("booking-bg")];
const walkImages = [img("walk-toronto"), img("floating-pup"), img("toronto-lifestyle"), img("trust-full"), img("booking-bg")];
const homeImages = [img("house-sitting"), img("pet-visit"), img("facility"), img("trust-full"), img("booking-bg")];
const daycareImages = [img("daycare-play"), img("facility"), img("floating-pup"), img("trust-full"), img("walk-toronto")];

export const services: Service[] = [
  {
    slug: "bath-and-nails",
    name: "Bath and Nails",
    eyebrow: "Fresh & tidy",
    summary: "A refreshing bath and paw-care package designed to keep dogs clean, healthy and comfortable.",
    description: "A refreshing bath and paw-care package designed to keep dogs clean, healthy and comfortable.",
    forWhom: "Ideal for dogs who need a clean coat, tidy paws and routine hygiene care without a full haircut.",
    benefits: ["Clean coat and skin comfort", "Healthier nails and paws", "Calm spa-style handling", "Size-based transparent pricing"],
    includes: [
      "Bath and dry",
      "Relaxing massage",
      "Brushing and de-shedding",
      "Nail clipping and grinding",
      "Ear cleaning",
      "Teeth brushing",
      "Paw-pad tidy",
      "Optional anal-gland expression",
    ],
    process: ["Share coat and size details", "Confirm appointment timing", "Enjoy the bath and nail package", "Receive after-care notes"],
    faqs: [
      { question: "How is pricing determined?", answer: "Bath and Nails pricing starts at $55 and is based on your dog’s size, from Extra Small to Extra Large." },
      { question: "Is anal-gland expression included?", answer: "It is optional and can be included when appropriate for your dog." },
    ],
    related: ["bath-and-tidy", "full-haircut", "dog-grooming"],
    images: [img("nails"), img("grooming"), img("facility"), img("floating-pup"), img("booking-bg")],
    featured: true,
    duration: "1 hour",
    priceLabel: "Starting at $55",
    priceTiers: [
      { label: "Extra Small", priceLabel: "$55" },
      { label: "Small", priceLabel: "$65" },
      { label: "Medium", priceLabel: "$75" },
      { label: "Large", priceLabel: "$85" },
      { label: "Extra Large", priceLabel: "$95" },
    ],
    status: "published",
  },
  {
    slug: "full-haircut",
    name: "Full Haircut",
    eyebrow: "Deluxe spa",
    summary: "A complete luxury grooming experience designed to keep dogs looking stylish, clean and refreshed.",
    description: "A complete luxury grooming experience designed to keep dogs looking stylish, clean and refreshed.",
    forWhom: "Perfect for dogs who need a full haircut, styling and a complete spa-style refresh.",
    benefits: ["Full styling and finish", "Complete hygiene care", "Premium spa experience", "Breed-aware trimming"],
    includes: [
      "Bath and blow dry",
      "Brushing",
      "Nail clipping and grinding",
      "Ear cleaning",
      "Teeth cleaning",
      "Full haircut and styling",
      "Scissor trimming",
      "Sanitary trim",
      "Optional anal-gland expression",
    ],
    process: ["Request the deluxe package", "Share breed and coat notes", "Confirm the one-hour appointment", "Receive a polished spa finish"],
    faqs: [{ question: "How long is the appointment?", answer: "The Full Haircut package is scheduled for 1 hour." }],
    related: ["bath-and-nails", "bath-and-tidy", "dog-grooming"],
    images: groomingImages,
    featured: true,
    duration: "1 hour",
    priceLabel: "$150",
    status: "published",
  },
  {
    slug: "bath-and-tidy",
    name: "Bath and Tidy",
    eyebrow: "Light maintenance",
    summary: "A maintenance grooming package for dogs that need bathing and light trimming without a complete haircut.",
    description: "A maintenance grooming package for dogs that need bathing and light trimming without a complete haircut.",
    forWhom: "Best for dogs who need bathing and tidy scissor work around the face, feet and bum without a full restyle.",
    benefits: ["Clean and fresh coat", "Light tidy trim", "Routine hygiene care", "Faster maintenance visit"],
    includes: [
      "Bath and blow dry",
      "Brushing",
      "Nail clipping and grinding",
      "Ear cleaning",
      "Teeth cleaning",
      "Scissor trim around the face, feet and bum",
      "Sanitary trim",
      "Optional anal-gland expression",
    ],
    process: ["Book the tidy package", "Share trimming preferences", "Complete the one-hour visit", "Go home fresh and neat"],
    faqs: [{ question: "Is this a full haircut?", answer: "No. Bath and Tidy focuses on bathing and light trimming rather than a complete haircut." }],
    related: ["bath-and-nails", "full-haircut", "dog-grooming"],
    images: [img("grooming"), img("nails"), img("floating-pup"), img("facility"), img("booking-bg")],
    featured: true,
    duration: "1 hour",
    priceLabel: "$65",
    status: "published",
  },
  {
    slug: "meet-and-greet",
    name: "Meet & Greet",
    eyebrow: "Complimentary intro",
    summary: "A complimentary introductory appointment to meet the DTdogs team and discuss your pet’s care needs.",
    description:
      "A complimentary introductory appointment where pet parents can meet the DTdogs team, discuss their pet’s routine, temperament and care requirements, and determine the most suitable daycare, boarding or pet-care service.",
    forWhom: "Recommended for every new family before daycare, boarding or ongoing pet-care services.",
    benefits: ["No cost to book", "Personalized service matching", "Meet the care team", "Discuss temperament and routines"],
    includes: ["20-minute introduction", "Routine and temperament discussion", "Service recommendations", "Next-step guidance"],
    process: ["Book your free Meet & Greet", "Share your pet’s details", "Meet the team", "Choose the right care plan"],
    faqs: [{ question: "Is Meet & Greet required?", answer: "It is strongly recommended for new clients so we can match the safest and best-fitting service." }],
    related: ["dog-half-daycare", "dog-boarding-one-night", "pet-visit"],
    images: [img("about-founder"), img("contact-dog"), img("trust-full"), img("facility"), img("booking-bg")],
    featured: true,
    duration: "20 minutes",
    priceLabel: "Free",
    status: "published",
  },
  {
    slug: "dog-walking-1-hour",
    name: "Dog Walking",
    eyebrow: "Full hour walk",
    summary: "A full one-hour structured walk with exercise, enrichment and personalized attention.",
    description:
      "A full one-hour structured walk providing exercise, outdoor enrichment, bathroom breaks and personalized attention based on the dog’s pace and needs.",
    forWhom: "Ideal for active dogs and busy pet parents who want a complete one-hour outing.",
    benefits: ["Full-hour exercise", "Outdoor enrichment", "Bathroom breaks", "Pace matched to your dog"],
    includes: ["1-hour structured walk", "Outdoor stimulation", "Bathroom opportunities", "Personalized handling"],
    process: ["Share walking preferences", "Confirm timing", "Enjoy the one-hour walk", "Receive a care update"],
    faqs: [{ question: "Is this a group walk?", answer: "Walks are structured around your dog’s needs and compatible arrangements when appropriate." }],
    related: ["dog-walking-30-minutes", "pet-visit", "dog-half-daycare"],
    images: walkImages,
    featured: true,
    duration: "1 hour",
    priceLabel: "$35",
    status: "published",
  },
  {
    slug: "house-sitting-one-night",
    name: "Pet House Sitting",
    eyebrow: "Overnight at home",
    summary: "Overnight pet care in your home to keep feeding, bathroom, play and morning routines consistent.",
    description:
      "Overnight pet care provided in the pet’s own home, helping maintain their regular feeding, bathroom, playtime, evening and morning routines while their family is away.",
    forWhom: "Best for pets who are most comfortable staying in their own home overnight.",
    benefits: ["Familiar home environment", "Overnight presence", "Routine continuity", "Reduced travel stress"],
    includes: ["Overnight in-home care", "Feeding support", "Bathroom routines", "Evening and morning care", "Playtime and companionship"],
    process: ["Share home and pet routines", "Confirm overnight timing", "Receive in-home overnight care", "Get an update in the morning"],
    faqs: [{ question: "Does the sitter stay overnight?", answer: "Yes. This package is designed as one-night overnight care in the pet’s home." }],
    related: ["house-sitting-full-day", "house-sitting-half-day", "pet-visit"],
    images: homeImages,
    featured: true,
    duration: "1 night",
    priceLabel: "$95",
    status: "published",
  },
  {
    slug: "house-sitting-full-day",
    name: "Pet House Sitting",
    eyebrow: "10-hour home care",
    summary: "Ten hours of attentive daytime pet care in the client’s home.",
    description:
      "Ten hours of attentive daytime pet care in the client’s home, including supervision, companionship, feeding, freshwater, playtime and scheduled bathroom breaks.",
    forWhom: "Ideal when you need a full workday of reliable in-home pet supervision.",
    benefits: ["Full-day home supervision", "Companionship and play", "Feeding and freshwater", "Scheduled bathroom breaks"],
    includes: ["10 hours of in-home care", "Supervision and companionship", "Feeding support", "Freshwater refreshes", "Playtime", "Bathroom breaks"],
    process: ["Confirm the full-day schedule", "Share feeding and care notes", "Receive daytime in-home care", "Get an end-of-day update"],
    faqs: [{ question: "How long is a full day?", answer: "Full-day pet house sitting covers 10 hours of in-home care." }],
    related: ["house-sitting-half-day", "house-sitting-one-night", "pet-visit"],
    images: [img("house-sitting"), img("facility"), img("about-founder"), img("trust-full"), img("booking-bg")],
    duration: "10 hours",
    priceLabel: "$80",
    status: "published",
  },
  {
    slug: "pet-visit",
    name: "Pet Visit",
    eyebrow: "In-home check-in",
    summary: "A one-hour in-home visit for feeding, play, companionship and routine support.",
    description:
      "A one-hour visit in the pet’s home that may include feeding, freshwater replacement, playtime, companionship, bathroom care and support with the pet’s normal routine.",
    forWhom: "Great for pets who stay home and need a reliable mid-day or scheduled check-in.",
    benefits: ["Familiar surroundings", "One-hour dedicated visit", "Feeding and freshwater support", "Play and companionship"],
    includes: ["1-hour home visit", "Feeding support as needed", "Freshwater replacement", "Playtime and companionship", "Bathroom care", "Routine support"],
    process: ["Share visit instructions", "Confirm timing", "We complete the home visit", "You receive an update"],
    faqs: [{ question: "What happens during a pet visit?", answer: "Visits can include feeding, freshwater, play, companionship, bathroom care and support with your pet’s normal routine." }],
    related: ["house-sitting-half-day", "dog-walking-30-minutes", "meet-and-greet"],
    images: [img("pet-visit"), img("house-sitting"), img("facility"), img("testimonial-pet"), img("contact-dog")],
    featured: true,
    duration: "1 hour",
    priceLabel: "$30",
    status: "published",
  },
  {
    slug: "guided-pet-excursion",
    name: "Guided Pet Excursion",
    eyebrow: "Coming soon",
    summary: "A full-day supervised pet adventure with outdoor exploration, enrichment and rest.",
    description:
      "A full-day supervised pet adventure offering outdoor exploration, exercise, enrichment, social engagement and scheduled rest periods.",
    forWhom: "For pets who enjoy structured outdoor adventure once this service launches.",
    benefits: ["Full-day enrichment", "Supervised outdoor exploration", "Exercise and social engagement", "Scheduled rest periods"],
    includes: ["12-hour supervised adventure", "Outdoor exploration", "Exercise and enrichment", "Social engagement", "Scheduled rest"],
    process: ["Join the waitlist interest via contact", "Share your pet’s ability notes", "Wait for launch confirmation", "Book once available"],
    faqs: [{ question: "Can I book this now?", answer: "Not yet. Guided Pet Excursion is coming soon and booking stays disabled until launch." }],
    related: ["dog-walking-1-hour", "dog-half-daycare", "meet-and-greet"],
    images: [img("excursion"), img("walk-toronto"), img("toronto-lifestyle"), img("trust-full"), img("booking-bg")],
    duration: "12 hours",
    priceLabel: "$100",
    status: "coming-soon",
  },
  {
    slug: "training-and-classes",
    name: "Training and Classes",
    eyebrow: "Coming soon",
    summary: "Instructor-led classes for positive behaviour, obedience, confidence and socialization.",
    description:
      "Instructor-led dog-training classes designed to support positive behaviour, everyday obedience, communication, confidence and appropriate socialization.",
    forWhom: "For pet parents seeking structured training support once classes officially launch.",
    benefits: ["Positive behaviour support", "Everyday obedience skills", "Confidence building", "Healthy socialization"],
    includes: ["1.5-hour instructor-led class", "Behaviour-focused learning", "Communication practice", "Socialization support"],
    process: ["Express interest", "Share training goals", "Await class schedule launch", "Book when available"],
    faqs: [{ question: "Is booking open?", answer: "Training and Classes is coming soon. The booking button remains disabled until launch." }],
    related: ["meet-and-greet", "dog-half-daycare", "dog-walking-1-hour"],
    images: [img("training"), img("walk-toronto"), img("floating-pup"), img("trust-full"), img("booking-bg")],
    duration: "1.5 hours",
    priceLabel: "$100",
    status: "coming-soon",
  },
  {
    slug: "dog-grooming",
    name: "Dog Grooming",
    eyebrow: "Custom grooming",
    summary: "A professional grooming appointment customized to breed, coat, size and individual needs.",
    description:
      "A professional grooming appointment customized according to the dog’s breed, coat condition, size and individual grooming requirements.",
    forWhom: "For dogs needing a customized grooming appointment beyond a fixed package.",
    benefits: ["Breed and coat customization", "Flexible grooming scope", "Professional handling", "Per-pet appointment"],
    includes: ["Custom grooming consultation", "Breed and coat-based care", "Professional grooming appointment", "Individual requirement planning"],
    process: ["Request grooming", "Share breed and coat details", "Confirm the customized scope", "Complete the appointment"],
    faqs: [
      {
        question: "How is this different from Bath and Nails or Full Haircut?",
        answer: "Dog Grooming is a separate customized option when the appointment needs to be tailored beyond the fixed Bath and Nails, Bath and Tidy, or Full Haircut packages.",
      },
    ],
    related: ["bath-and-nails", "bath-and-tidy", "full-haircut"],
    images: [img("grooming"), img("nails"), img("testimonial-pet"), img("facility"), img("booking-bg")],
    duration: "1 hour",
    priceLabel: "$100",
    status: "published",
  },
  {
    slug: "dog-half-daycare",
    name: "Dog Half Daycare",
    eyebrow: "6-hour daycare",
    summary: "A structured six-hour daycare day with supervised play, enrichment and rest.",
    description:
      "A structured six-hour daycare experience featuring supervised play, safe socialization, enrichment activities, individual attention and scheduled rest periods.",
    forWhom: "Ideal for dogs who thrive with half-day social play and structured enrichment.",
    benefits: ["Supervised play", "Safe socialization", "Enrichment activities", "Scheduled rest"],
    includes: ["6-hour daycare stay", "Supervised play", "Safe socialization", "Enrichment activities", "Individual attention", "Scheduled rest periods"],
    process: ["Complete intake", "Book a half day", "Drop off for structured care", "Pick up after enrichment and rest"],
    faqs: [{ question: "How long is half daycare?", answer: "Dog Half Daycare is a structured 6-hour experience." }],
    related: ["dog-boarding-one-night", "dog-walking-1-hour", "meet-and-greet"],
    images: daycareImages,
    featured: true,
    duration: "6 hours",
    priceLabel: "$40",
    status: "published",
  },
  {
    slug: "dog-boarding-one-night",
    name: "Dog Boarding",
    eyebrow: "Overnight boarding",
    summary: "Comfortable overnight boarding with personalized feeding, rest and care routines.",
    description:
      "Comfortable overnight boarding in a calm and supervised environment, with personalized feeding, bathroom, rest and care routines based on each dog’s needs.",
    forWhom: "For families needing calm overnight boarding while away.",
    benefits: ["Overnight supervision", "Calm environment", "Personalized routines", "Feeding and rest support"],
    includes: ["One-night boarding", "Personalized feeding", "Bathroom support", "Rest routines", "Supervised overnight care"],
    process: ["Request overnight dates", "Complete intake details", "Confirm boarding", "Receive overnight care updates"],
    faqs: [{ question: "Is daycare included?", answer: "Overnight boarding focuses on calm overnight care with personalized routines based on each dog’s needs." }],
    related: ["dog-half-daycare", "house-sitting-one-night", "meet-and-greet"],
    images: [img("boarding-home"), img("daycare-play"), img("facility"), img("testimonial-pet"), img("booking-bg")],
    featured: true,
    duration: "1 night",
    priceLabel: "$50",
    status: "published",
  },
  {
    slug: "house-sitting-half-day",
    name: "Pet House Sitting",
    eyebrow: "6-hour home care",
    summary: "Six hours of in-home pet care, companionship, feeding and bathroom breaks.",
    description:
      "Six hours of in-home pet care and companionship, including supervision, playtime, feeding, freshwater and bathroom breaks while the owner is away.",
    forWhom: "Perfect for half-day absences when pets are happiest at home.",
    benefits: ["Half-day home supervision", "Play and companionship", "Feeding and freshwater", "Bathroom breaks"],
    includes: ["6 hours of in-home care", "Supervision", "Playtime", "Feeding support", "Freshwater", "Bathroom breaks"],
    process: ["Confirm the half-day window", "Share care instructions", "Receive in-home care", "Get an update afterward"],
    faqs: [{ question: "How long is half-day house sitting?", answer: "Half-day pet house sitting covers 6 hours of in-home care." }],
    related: ["house-sitting-full-day", "pet-visit", "house-sitting-one-night"],
    images: [img("house-sitting"), img("pet-visit"), img("about-founder"), img("trust-full"), img("booking-bg")],
    duration: "6 hours",
    priceLabel: "$40",
    status: "published",
  },
  {
    slug: "dog-walking-30-minutes",
    name: "Dog Walking",
    eyebrow: "Quick neighbourhood walk",
    summary: "A focused thirty-minute walk for exercise, fresh air and a bathroom break.",
    description:
      "A focused thirty-minute neighbourhood walk providing exercise, fresh air, outdoor stimulation and a bathroom break.",
    forWhom: "Ideal for shorter outings, puppies, seniors or mid-day bathroom needs.",
    benefits: ["Quick exercise", "Fresh air", "Outdoor stimulation", "Bathroom break"],
    includes: ["30-minute neighbourhood walk", "Exercise", "Outdoor stimulation", "Bathroom break"],
    process: ["Choose a walk window", "Share pace notes", "Enjoy the 30-minute walk", "Receive a quick update"],
    faqs: [{ question: "Is 30 minutes enough for my dog?", answer: "Many dogs benefit from a focused half-hour outing for exercise and a bathroom break; longer walks are also available." }],
    related: ["dog-walking-1-hour", "pet-visit", "dog-half-daycare"],
    images: [img("walk-toronto"), img("toronto-lifestyle"), img("floating-pup"), img("trust-full"), img("booking-bg")],
    featured: true,
    duration: "30 minutes",
    priceLabel: "$20",
    status: "published",
  },
];

export const faqs: Faq[] = [
  ...faqSeed("General Daycare and Boarding FAQs", [
    "How do I get started?",
    "How do I schedule a day of care?",
    "Is there flexibility to the drop-off and pick-up times?",
    "Do you offer boarding or overnight care?",
    "Will my dog be walked during the day?",
    "How old must my dog be to attend?",
    "My dog has not been spayed or neutered. Can I still bring them to daycare?",
    "Does my dog need to be vaccinated?",
    "What happens if I need to cancel my stay?",
    "Do you feed the dogs?",
    "What happens if my dog gets sick at daycare or while being boarded?",
    "How many dogs are usually at daycare?",
    "My dog requires special care. How do you guarantee the instructions are followed properly?",
    "How far in advance do I need to book daycare services?",
  ], 1),
  ...faqSeed("Shuttle Service FAQs", [
    "What is the DTdogs.ca pet shuttle service?",
    "How much does it cost?",
    "When does the shuttle run?",
    "What if I am late for pickup or drop-off?",
    "Is there a minimum number of dogs required?",
    "Do I need to book in advance?",
    "Do I need to sign a waiver?",
    "How far does the shuttle go?",
    "What are the safety requirements?",
  ], 100),
  ...faqSeed("Dog Grooming FAQs", [
    "What grooming services are available?",
    "How do I choose the right grooming package?",
    "How long does grooming take?",
    "Can nervous dogs book grooming?",
    "Are grooming prices confirmed before the appointment?",
  ], 200),
  ...faqSeed("Dog Walking FAQs", [
    "What walk-time options are available?",
    "Do you offer solo walks?",
    "Do you offer group walks?",
    "What areas do you serve?",
    "Is a meet-and-greet required before walking?",
  ], 300),
  ...faqSeed("Booking and Payment FAQs", [
    "How do I book a service?",
    "Is a deposit required?",
    "Can I use a gift card?",
    "What happens if online payment is not configured?",
    "Will I receive a confirmation email?",
  ], 400),
  ...faqSeed("Health, Safety and Vaccination FAQs", [
    "What vaccinations are required?",
    "What happens if my pet becomes unwell?",
    "Can you support pets with medical needs?",
    "What information is required before transport?",
    "What safety measures are used during care?",
  ], 500),
];

export const pricingPackages: PricingPackage[] = [
  {
    slug: "pay-as-you-go-half-day",
    service: "Dog Daycare",
    name: "Pay as you Go",
    priceLabel: "$40",
    duration: "Half Day Play (up to 6 hrs)",
    features: ["Half Day Play (up to 6 hrs)", "Structured Enrichment Activities"],
    featured: false,
    status: "published",
  },
  {
    slug: "pay-as-you-go-full-day",
    service: "Dog Daycare",
    name: "Pay as you Go",
    priceLabel: "$60",
    duration: "Full Day Play (up to 10 hrs)",
    features: ["Full Day Play (up to 10 hrs)", "Structured Enrichment Activities"],
    featured: true,
    status: "published",
  },
  {
    slug: "overnight-boarding",
    service: "Dog Boarding",
    name: "Overnight Boarding",
    priceLabel: "$80",
    duration: "Overnight stay",
    features: ["Boarding from the comfort of home", "Daycare included", "Structured Enrichment Activities"],
    featured: true,
    status: "published",
  },
  {
    slug: "5-half-day-package",
    service: "Dog Daycare",
    name: "5 Half Day Package",
    priceLabel: "$195",
    duration: "Expires 10 days after purchase",
    features: ["5 Half Day (up to 6 hrs) Play", "Package expires 10 days after purchase", "Structured Daycare with Enrichment Activities"],
    featured: false,
    status: "published",
  },
  {
    slug: "5-full-day-package",
    service: "Dog Daycare",
    name: "5 Full Day Package",
    priceLabel: "$270",
    duration: "Expires 10 days after purchase",
    features: ["5 Full Day (up to 10 hrs) Play", "Package expires 10 days after purchase", "Structured Daycare with Enrichment Activities"],
    featured: false,
    status: "published",
  },
  {
    slug: "10-half-day-package",
    service: "Dog Daycare",
    name: "10 Half Day Package",
    priceLabel: "$390",
    duration: "Expires 20 days after purchase",
    features: ["10 Half Day (up to 6 hrs) Play", "Package expires 20 days after purchase", "Structured Daycare with Enrichment Activities"],
    featured: false,
    status: "published",
  },
  {
    slug: "10-full-day-package",
    service: "Dog Daycare",
    name: "10 Full Day Package",
    priceLabel: "$540",
    duration: "Expires 20 days after purchase",
    features: ["10 Full Day (up to 10 hrs) Play", "Package expires 20 days after purchase", "Structured Daycare with Enrichment Activities"],
    featured: false,
    status: "published",
  },
  {
    slug: "20-half-day-package",
    service: "Dog Daycare",
    name: "20 Half Day Package",
    priceLabel: "$780",
    duration: "Expires 40 days after purchase",
    features: ["20 Half Day (up to 6 hrs) Play", "Package expires 40 days after purchase", "Structured Daycare with Enrichment Activities"],
    featured: false,
    status: "published",
  },
  {
    slug: "20-full-day-package",
    service: "Dog Daycare",
    name: "20 Full Day Package",
    priceLabel: "$1,080",
    duration: "Expires 40 days after purchase",
    features: ["20 Full Day (up to 10 hrs) Play", "Package expires 40 days after purchase", "Structured Daycare with Enrichment Activities"],
    featured: false,
    status: "published",
  },
  {
    slug: "28-full-day-package",
    service: "Dog Daycare",
    name: "28 Full Day Package",
    priceLabel: "$1,480",
    duration: "Expires 56 days after purchase",
    features: ["28 Full Day (up to 10 hrs) Play", "Package expires 56 days after purchase", "Structured Daycare with Enrichment Activities"],
    featured: true,
    status: "published",
  },
];

export const testimonials: Testimonial[] = [
  {
    slug: "gta-boarding-calm",
    reviewer: "Aisha R.",
    petName: "Milo",
    service: "Dog Boarding",
    rating: 5,
    quote: "Milo settled in quickly and we got calm updates throughout. It felt like structured home care, not a kennel.",
    location: "Downtown Toronto",
    image: img("boarding-home"),
    status: "published",
    sample: false,
  },
  {
    slug: "gta-walking-routine",
    reviewer: "Jordan K.",
    petName: "Nala",
    service: "Dog Walking",
    rating: 5,
    quote: "Reliable midday walks with clear timing. Nala comes home settled and we trust the routine every workday.",
    location: "Greater Toronto Area",
    image: img("walk-toronto"),
    status: "published",
    sample: false,
  },
  {
    slug: "gta-grooming-tidy",
    reviewer: "Priya S.",
    petName: "Bean",
    service: "Dog Grooming",
    rating: 5,
    quote: "Gentle grooming and tidy nails without stress. The team explained every step and Bean looked fantastic.",
    location: "Toronto",
    image: img("grooming"),
    status: "published",
    sample: false,
  },
];

export const team: TeamMember[] = [
  {
    slug: "sunny",
    name: "Sunny",
    role: "Founder · Sunnyism.Pro #DogDad",
    bio: "Meet Sunnyism.Pro #DogDad — thoughts, vision, and the journey ahead for DTdogs.ca across Downtown Toronto and the GTA.",
    credentials: ["Founder", "GTA Pet Care"],
    image: img("about-founder"),
    status: "published",
  },
  {
    slug: "emma",
    name: "Emma",
    role: "Team profile pending approval",
    bio: "Editable placeholder: biography and credentials pending client approval.",
    credentials: ["To be confirmed"],
    image: img("pet-visit"),
    status: "published",
  },
  {
    slug: "manu",
    name: "Manu",
    role: "Team profile pending approval",
    bio: "Editable placeholder: biography and credentials pending client approval.",
    credentials: ["To be confirmed"],
    image: img("facility"),
    status: "published",
  },
];

export const products: Product[] = [
  {
    slug: "gift-card-50",
    title: "DTdogs Digital Gift Card - $50",
    description: "Digital gift card denomination confirmed for the gift-card flow. Fulfillment and payment settings remain editable in the CMS.",
    priceLabel: "CAD $50",
    status: "inquiry",
    images: [img("gift-card-50-image"), img("policy-care"), img("booking-bg"), img("floating-pup"), img("contact-dog")],
    sizes: ["Digital delivery"],
    colors: ["Gift card"],
    inventory: 999,
  },
  {
    slug: "gift-card-100",
    title: "DTdogs Digital Gift Card - $100",
    description: "Digital gift card denomination confirmed for the gift-card flow. Fulfillment and payment settings remain editable in the CMS.",
    priceLabel: "CAD $100",
    status: "inquiry",
    images: [img("gift-card-100-image"), img("policy-care"), img("booking-bg"), img("floating-pup"), img("contact-dog")],
    sizes: ["Digital delivery"],
    colors: ["Gift card"],
    inventory: 999,
  },
  {
    slug: "dog-dad-merch",
    title: "Dog Dad Merch",
    description: "Coming Soon #2026",
    priceLabel: "$33.00",
    compareAtPriceLabel: "$41.00",
    status: "coming-soon",
    images: [img("shop-dad"), img("shop-hero-2"), img("floating-pup"), img("policy-care"), img("shop-mom")],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Forest"],
    inventory: 0,
  },
  {
    slug: "dog-mom-merch",
    title: "Dog Mom Merch",
    description: "Coming Soon #2026",
    priceLabel: "$33.00",
    compareAtPriceLabel: "$41.00",
    status: "coming-soon",
    images: [img("shop-mom"), img("shop-hero-1"), img("floating-pup"), img("policy-care"), img("shop-dad")],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Black", "Pink"],
    inventory: 0,
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "preparing-for-boarding",
    title: "Preparing your dog for a calm boarding stay",
    excerpt: "A practical guide to food, routines, comfort items and intake details that support a smoother boarding experience.",
    category: "Boarding preparation",
    author: "DTdogs.ca",
    date: "2026-07-15",
    body: "Bring your pet's regular food whenever possible, share medical and temperament details clearly, and book early for weekends, holidays and boarding. This article is editable in the CMS and should be expanded with approved operational details before launch.",
    featuredImage: img("blog-cover"),
    inlineImages: [img("boarding-home"), img("facility"), img("trust-full"), img("booking-bg"), img("testimonial-pet")],
    status: "published",
  },
  {
    slug: "chauffeur-safety",
    title: "What makes pet chauffeur service feel safe and calm?",
    excerpt: "Secure transport starts with planning, sanitized vehicles, steady handling and clear communication.",
    category: "Pet Chauffeur",
    author: "DTdogs.ca",
    date: "2026-07-15",
    body: "Pet chauffeur pricing and availability depend on distance, route timing and special requirements. Final transport policy details should be confirmed before launch.",
    featuredImage: img("chauffeur"),
    inlineImages: [img("toronto-lifestyle"), img("contact-dog"), img("policy-care"), img("booking-bg"), img("floating-pup")],
    status: "published",
  },
];

export const pages: PageContent[] = [
  {
    slug: "about",
    title: "About Us",
    navTitle: "About",
    seoTitle: "About DTdogs.ca | Premium Pet Care GTA",
    metaDescription: "Learn about DTdogs.ca, structured pet care across the Greater Toronto Area built around calm routines, trust and comfort.",
    hero: {
      eyebrow: "Care designed around calm, trust and connection",
      title: "Professional pet care with warmth, structure and real attention.",
      body: "Since 2021, DTdogs.ca has served pet families across the Greater Toronto Area through consistent, nurturing care.",
      primaryCta: { label: "Book a Meet & Greet", href: "/booking" },
      secondaryCta: { label: "Explore Services", href: "/services" },
      images: [img("about-founder"), img("facility"), img("toronto-lifestyle"), img("pet-visit"), img("trust-full")],
    },
    blocks: [
      {
        type: "story",
        eyebrow: "Our story",
        title: "Care that feels calm, predictable and personal.",
        body: "At DTdogs.ca, we provide structured pet-care services for discerning pet parents. Every routine is designed to support safety, comfort and emotional well-being while pets are away from home or receiving care in their own familiar environment.",
        images: [img("about-1"), img("about-2"), img("about-3")],
      },
      {
        type: "cards",
        eyebrow: "What guides us",
        title: "Safety before speed, calm before chaos.",
        items: [
          { title: "Structured routines", body: "Pets thrive when care is predictable, attentive and tailored to individual personality.", image: img("structured-routines-card") },
          { title: "Honest communication", body: "Clear updates help pet parents feel connected while away.", image: img("honest-communication-card") },
          { title: "Clean environments", body: "Food safety, hygiene and comfort are treated as core care standards.", image: img("clean-environments-card") },
        ],
      },
      {
        type: "cta",
        title: "Brand relationship to confirm",
        body: "The current website alternates between DTdogs.ca and Hand & Paw. This placeholder should be replaced with the approved relationship statement before launch.",
        images: [img("floating-pup-2"), img("booking-bg-2")],
      },
    ],
  },
  {
    slug: "services",
    title: "Services",
    navTitle: "Services",
    seoTitle: "DTdogs Services | Dog Walking, Boarding, Daycare & Pet Care Toronto",
    metaDescription: "Explore DTdogs.ca services including dog walking, pet visits, house sitting, daycare, boarding, chauffeur, grooming, nail trimming and more.",
    hero: {
      eyebrow: "Thoughtful care for every part of your pet's routine",
      title: "Premium pet-care pathways across the Greater Toronto Area.",
      body: "From everyday walks to overnight stays, grooming and transport, our services are structured around safety, comfort and reliable communication.",
      primaryCta: { label: "Book Now", href: "/booking" },
      secondaryCta: { label: "View Pricing", href: "/pricing" },
      images: [img("walk-toronto"), img("boarding-home"), img("daycare-play"), img("grooming"), img("chauffeur")],
    },
    blocks: [
      { type: "cards", eyebrow: "Service menu", title: "Choose the right care experience.", body: "Every service card uses a unique image and links to a full detail page.", images: [img("pet-visit"), img("house-sitting"), img("excursion"), img("nails"), img("training")] },
      { type: "process", eyebrow: "Care process", title: "Tell us, choose care, confirm, relax.", images: [img("booking-bg"), img("facility"), img("trust-full"), img("contact-dog"), img("floating-pup")] },
    ],
  },
  {
    slug: "pricing",
    title: "Pricing",
    navTitle: "Pricing",
    seoTitle: "DTdogs.ca Pricing | Dog Daycare, Boarding & Dog Walks",
    metaDescription: "View DTdogs.ca daycare, boarding and package pricing across the Greater Toronto Area — from pay-as-you-go days to overnight boarding and multi-day packages.",
    hero: {
      eyebrow: "Dog Daycare, Boarding & Dog Walks",
      title: "Clear packages for structured play, enrichment and overnight care.",
      body: "Choose pay-as-you-go daycare, overnight boarding, or value packages — all with structured enrichment activities.",
      primaryCta: { label: "Book Now", href: "/booking" },
      secondaryCta: { label: "Contact Us", href: "/contact" },
      images: [img("policy-care"), img("grooming"), img("boarding-home"), img("chauffeur"), img("booking-bg")],
    },
    blocks: [],
  },
  {
    slug: "gallery",
    title: "Gallery",
    navTitle: "Gallery",
    seoTitle: "DTdogs.ca Gallery | Happy Dogs, Calm Care & GTA Adventures",
    metaDescription: "Browse the DTdogs.ca gallery with service filters, captions and lightbox-ready pet-care imagery.",
    hero: {
      eyebrow: "The DTdogs clan, in their element",
      title: "A visual journal of calm stays, happy walks and bright pet-care moments.",
      body: "Gallery images are managed from the admin media library with categories, captions, alt text, ordering and publish status.",
      primaryCta: { label: "Book Your Pet", href: "/booking" },
      secondaryCta: { label: "View Services", href: "/services" },
      images: [img("gallery-hero-1"), img("gallery-hero-2"), img("gallery-hero-3")],
    },
    blocks: [{ type: "gallery", title: "Filterable masonry gallery", images: galleryImages }],
  },
  {
    slug: "treats",
    title: "Treats",
    navTitle: "Treats",
    seoTitle: "Dog Treats | DTdogs.ca",
    metaDescription: "A warm editorial gallery for DTdogs dog treats, product details and treat photography.",
    hero: {
      eyebrow: "Treats for the DTdogs clan",
      title: "A curated treat gallery for happy dogs.",
      body: "This page is ready for your treat photos, captions, ingredients, availability notes and product imagery.",
      primaryCta: { label: "Ask About Treats", href: "/contact" },
      secondaryCta: { label: "View Gallery", href: "/gallery" },
      images: [img("policy-care"), img("floating-pup"), img("contact-dog"), img("booking-bg"), img("trust-full")],
    },
    blocks: [{ type: "gallery", title: "Treats gallery", images: treatImages }],
  },
  {
    slug: "testimonials",
    title: "Testimonials",
    navTitle: "Testimonials",
    seoTitle: "DTdogs.ca Testimonials | Trusted Pet Care GTA",
    metaDescription: "Approved client testimonials for DTdogs.ca pet care services across the Greater Toronto Area.",
    hero: {
      eyebrow: "Trusted by pet parents across the GTA",
      title: "Real reviews belong here, carefully managed and approved.",
      body: "The CMS supports reviewer name, pet name, service, rating, source, date, image and featured status. Placeholder reviews remain clearly labelled until replaced.",
      primaryCta: { label: "Book a Meet & Greet", href: "/booking" },
      images: [img("testimonial-pet"), img("contact-dog"), img("pet-visit"), img("trust-full"), img("floating-pup")],
    },
    blocks: [{ type: "testimonials", title: "Approved review library", images: [img("testimonial-pet"), img("contact-dog"), img("pet-visit"), img("floating-pup"), img("booking-bg")] }],
  },
  {
    slug: "faq",
    title: "FAQ",
    navTitle: "FAQ",
    seoTitle: "DTdogs.ca FAQ | Pet Care Booking, Boarding & Chauffeur Questions",
    metaDescription: "Answers to common DTdogs.ca questions about booking, services, vaccinations, boarding, chauffeur service and policies.",
    hero: {
      eyebrow: "Clear answers before care begins",
      title: "Everything pet parents should know before booking.",
      body: "FAQs are category-based, service-aware and editable from the admin panel.",
      primaryCta: { label: "Start Booking", href: "/booking" },
      secondaryCta: { label: "Contact Us", href: "/contact" },
      images: [img("policy-care"), img("contact-dog"), img("facility"), img("boarding-home"), img("chauffeur")],
    },
    blocks: [{ type: "faq", title: "Common questions", images: [img("floating-pup"), img("trust-full"), img("booking-bg"), img("pet-visit"), img("walk-toronto")] }],
  },
  {
    slug: "blog",
    title: "The Paw Journal",
    navTitle: "Journal",
    seoTitle: "The Paw Journal | DTdogs.ca Pet Care Notes",
    metaDescription: "Care guides, boarding preparation, canine behaviour notes and GTA pet-care stories from DTdogs.ca.",
    hero: {
      eyebrow: "Helpful notes for happier pets and calmer pet parents",
      title: "Editorial care guides with warm practical advice.",
      body: "Every post supports featured images, social images, inline media, author details, SEO and related services.",
      primaryCta: { label: "Read Guides", href: "#posts" },
      images: [img("blog-cover"), img("boarding-home"), img("chauffeur"), img("facility"), img("booking-bg")],
    },
    blocks: [{ type: "cards", title: "Latest posts", images: [img("blog-cover"), img("boarding-home"), img("chauffeur"), img("trust-full"), img("contact-dog")] }],
  },
  {
    slug: "booking",
    title: "Booking",
    navTitle: "Book Now",
    seoTitle: "Book DTdogs.ca Pet Care | Meet & Greet Request",
    metaDescription: "Submit a multi-step booking request for DTdogs.ca pet care services in the Greater Toronto Area.",
    hero: {
      eyebrow: "Book with DTdogs.ca",
      title: "Choose your service, pick a slot, and confirm care.",
      body: "Professional and structured pet care in Downtown Toronto, serving across the GTA. Select a service, a 30-minute appointment between 7:00 AM and 9:00 PM, then share pet details.",
      primaryCta: { label: "Start Booking", href: "#booking-form" },
      secondaryCta: { label: "Message us", href: "https://wa.me/14379375112" },
      images: [img("booking-bg"), img("floating-pup"), img("pet-visit"), img("policy-care"), img("contact-dog")],
    },
    blocks: [],
  },
  {
    slug: "team",
    title: "Our Team",
    navTitle: "Our Team",
    seoTitle: "Our Team | DTdogs.ca Premium Pet Care",
    metaDescription: "Meet the people behind DTdogs.ca and the experience, calm energy and compassion they bring to pet care.",
    hero: {
      eyebrow: "Experienced hands. Calm energy. Genuine care.",
      title: "People your pet can feel comfortable with.",
      body: "Publish only verified credentials, approved bios and real portraits from the admin panel.",
      primaryCta: { label: "Meet Us", href: "#team" },
      images: [img("about-founder"), img("pet-visit"), img("facility"), img("trust-full"), img("toronto-lifestyle")],
    },
    blocks: [{ type: "cards", title: "Founder and caregiver profiles", images: [img("about-founder"), img("contact-dog"), img("floating-pup"), img("facility"), img("booking-bg")] }],
  },
  {
    slug: "contact",
    title: "Contact",
    navTitle: "Contact",
    seoTitle: "Contact DTdogs.ca | Premium Pet Care GTA",
    metaDescription: "Contact DTdogs.ca for pet care bookings, questions and service availability across the Greater Toronto Area.",
    hero: {
      eyebrow: "Let's plan the right care for your pet",
      title: "Reach out for booking help, pricing and service fit.",
      body: `${brand.email} | ${brand.phone} | ${brand.hours}`,
      primaryCta: { label: "Book Now", href: "/booking" },
      secondaryCta: { label: "Email Us", href: `mailto:${brand.email}` },
      images: [img("contact-dog"), img("toronto-lifestyle"), img("facility"), img("pet-visit"), img("booking-bg")],
    },
    blocks: [{ type: "story", title: "Contact details", body: `Hours: ${brand.hours}. ${brand.boardingNote} Public service locations must be confirmed before launch.`, images: [img("contact-dog"), img("policy-care"), img("floating-pup"), img("trust-full"), img("walk-toronto")] }],
  },
  {
    slug: "shop",
    title: "Shop",
    navTitle: "Shop",
    seoTitle: "DTdogs.ca Shop | Dog Mom & Dog Dad Apparel",
    metaDescription: "Browse DTdogs.ca apparel including Dog Mom and Dog Dad long-sleeve shirts. Catalogue mode until checkout is confirmed.",
    hero: {
      eyebrow: "A lightweight boutique, ready to grow",
      title: "Dog Dad and Dog Mom merch for the DTdogs clan.",
      body: "Coming soon in 2026 — premium merch bundles with clear pricing, ready for final product photography and checkout.",
      primaryCta: { label: "Browse Merch", href: "#products" },
      images: [img("shop-hero-1"), img("shop-hero-2"), img("floating-pup"), img("policy-care"), img("booking-bg")],
    },
    blocks: [{ type: "shop", title: "Product catalogue", images: [img("shop-mom"), img("shop-dad"), img("policy-care"), img("floating-pup"), img("contact-dog")] }],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    navTitle: "Privacy",
    seoTitle: "Privacy Policy | DTdogs.ca",
    metaDescription: "Editable privacy policy page for DTdogs.ca.",
    hero: {
      eyebrow: "Policy",
      title: "Privacy language should be reviewed and approved before launch.",
      body: "This page is CMS-editable and ready for final legal language.",
      images: [img("policy-care"), img("facility"), img("contact-dog"), img("booking-bg"), img("floating-pup")],
    },
    blocks: [{ type: "story", title: "Draft privacy content", body: "DTdogs.ca collects booking, contact and pet-care details to respond to inquiries and provide services. Replace this draft with approved legal wording.", images: [img("policy-care"), img("trust-full"), img("pet-visit"), img("facility"), img("contact-dog")] }],
  },
  {
    slug: "terms",
    title: "Terms and Conditions",
    navTitle: "Terms",
    seoTitle: "Terms and Conditions | DTdogs.ca",
    metaDescription: "Editable terms and conditions page for DTdogs.ca.",
    hero: {
      eyebrow: "Policy",
      title: "Terms should be finalized with approved business language.",
      body: "This page is editable from the CMS and prepared for final terms.",
      images: [img("policy-care"), img("boarding-home"), img("walk-toronto"), img("booking-bg"), img("facility")],
    },
    blocks: [{ type: "story", title: "Draft terms content", body: "Service availability, eligibility, cancellation, health and emergency authorization language should be confirmed before launch.", images: [img("policy-care"), img("trust-full"), img("contact-dog"), img("pet-visit"), img("floating-pup")] }],
  },
  {
    slug: "cancellation-policy",
    title: "Cancellation Policy",
    navTitle: "Cancellation",
    seoTitle: "Cancellation Policy | DTdogs.ca",
    metaDescription: "Editable cancellation and refund policy for DTdogs.ca.",
    hero: {
      eyebrow: "Policy",
      title: "Cancellation rules remain editable until the client confirms exact notice periods.",
      body: "The pricing and booking flows can link here once final terms are approved.",
      images: [img("policy-care"), img("booking-bg"), img("contact-dog"), img("facility"), img("floating-pup")],
    },
    blocks: [{ type: "story", title: "Draft cancellation content", body: "Advance notice is required. Exact notice periods and any applicable charges should be updated in the CMS after confirmation.", images: [img("policy-care"), img("trust-full"), img("walk-toronto"), img("boarding-home"), img("contact-dog")] }],
  },
];

pages.push(
  {
    slug: "our-vision",
    title: "Our Vision",
    navTitle: "Our Vision",
    seoTitle: "Our Vision | DTdogs.ca",
    metaDescription: "DTdogs.ca vision, values and approach to dependable pet care.",
    hero: {
      eyebrow: "Our Vision",
      title: "Professional and structured pet care in Downtown Toronto.",
      body: "Serving across the GTA in every season. DTdogs.ca (formerly Handandpaw.ca and Handandpaw.in) builds calm routines around safety, comfort and clear communication.",
      primaryCta: { label: "Meet The Team", href: "/team" },
      secondaryCta: { label: "Book Care", href: "/booking" },
      images: [img("trust-full"), img("facility"), img("about-founder"), img("toronto-lifestyle"), img("pet-visit")],
    },
    blocks: [
      {
        type: "story",
        eyebrow: "Our Vision",
        title: "Dependable care, clean routines and reliable communication.",
        body: "We envision a safer, warmer rhythm for pets and their people — structured services, honest updates, and home-style comfort that pet parents can trust while they are away.",
        images: [img("trust-full"), img("facility"), img("pet-visit"), img("booking-bg"), img("contact-dog")],
      },
      {
        type: "cards",
        eyebrow: "How we work",
        title: "Safety, comfort and connection in every routine.",
        body: "From walks and boarding to grooming and daycare, every service is designed around predictable care and clear communication across the Greater Toronto Area.",
        images: [img("about-founder"), img("pet-visit"), img("facility"), img("toronto-lifestyle"), img("floating-pup")],
      },
    ],
  },
  {
    slug: "gift-cards",
    title: "Gift Cards",
    navTitle: "Gift Cards",
    seoTitle: "DTdogs.ca Gift Cards | $50 and $100 Digital Gifts",
    metaDescription: "Purchase DTdogs.ca digital gift card denominations of CAD $50 and CAD $100.",
    hero: {
      eyebrow: "A thoughtful gift for pet parents",
      title: "Digital gift cards for calm, professional pet care.",
      body: "Confirmed denominations: CAD $50 and CAD $100. Online payment must be configured before live checkout.",
      primaryCta: { label: "Start Gift Card", href: "#gift-card-form" },
      secondaryCta: { label: "Contact Us", href: "/contact" },
      images: [img("policy-care"), img("shop-mom"), img("shop-dad"), img("booking-bg"), img("floating-pup")],
    },
    blocks: [
      { type: "shop", title: "Gift card purchase flow", body: "Recipient name, recipient email, sender name, message, delivery date and payment status are editable in the CMS.", images: [img("policy-care"), img("booking-bg"), img("contact-dog"), img("floating-pup"), img("trust-full")] },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    navTitle: "Privacy Policy",
    seoTitle: "Privacy Policy | DTdogs.ca",
    metaDescription: "Editable privacy policy for DTdogs.ca.",
    hero: pages.find((page) => page.slug === "privacy")!.hero,
    blocks: pages.find((page) => page.slug === "privacy")!.blocks,
  },
  {
    slug: "refund-return-policy",
    title: "Refund and Return Policy",
    navTitle: "Refund Policy",
    seoTitle: "Refund and Return Policy | DTdogs.ca",
    metaDescription: "Editable refund and return policy for DTdogs.ca.",
    hero: {
      eyebrow: "Policy",
      title: "Refund and return rules remain editable until approved.",
      body: "Use this page for final client-approved refund, return, cancellation and gift-card terms.",
      images: [img("policy-care"), img("booking-bg"), img("contact-dog"), img("facility"), img("floating-pup")],
    },
    blocks: [{ type: "story", title: "Draft refund and return content", body: "Editable placeholder: final policy wording pending client approval.", images: [img("policy-care"), img("trust-full"), img("walk-toronto"), img("boarding-home"), img("contact-dog")] }],
  },
);

export const homePage = {
  heroImages: [img("hero-caregiver"), img("floating-pup"), img("walk-toronto"), img("boarding-home"), img("daycare-play")],
  storyImages: [img("about-founder"), img("facility"), img("toronto-lifestyle"), img("pet-visit"), img("trust-full")],
  galleryImages: mediaLibrary.slice(0, 12),
};

const cached = global as typeof global & { mongooseConnection?: Promise<typeof mongoose> };

export async function connectMongo() {
  if (!process.env.MONGODB_URI) return null;
  if (mongoose.connection.readyState >= 1) return mongoose;
  cached.mongooseConnection ??= mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB ?? "dtdogs",
  });
  return cached.mongooseConnection;
}

const imageSchema = new Schema<ImageAsset>(
  {
    id: String,
    title: String,
    alt: String,
    caption: String,
    url: String,
    mobileUrl: String,
    width: Number,
    height: Number,
    fileSize: Number,
    page: String,
    tags: [String],
    status: { type: String, default: "published" },
    focalPoint: { x: Number, y: Number },
    order: Number,
  },
  { _id: false },
);

function getModel<T>(name: string, schema: Schema<T>): Model<T> {
  return (mongoose.models[name] as Model<T>) || mongoose.model<T>(name, schema);
}

export const Models = {
  Page: () => getModel<PageContent>("Page", new Schema<PageContent>({ slug: { type: String, unique: true }, title: String, navTitle: String, seoTitle: String, metaDescription: String, hero: Schema.Types.Mixed, blocks: [Schema.Types.Mixed], status: String }, { timestamps: true })),
  Service: () => getModel<Service>("Service", new Schema<Service>({ slug: { type: String, unique: true }, name: String, eyebrow: String, summary: String, description: String, forWhom: String, benefits: [String], includes: [String], process: [String], faqs: [Schema.Types.Mixed], related: [String], images: [imageSchema], featured: Boolean, status: String, priceLabel: String, duration: String, priceTiers: [Schema.Types.Mixed] }, { timestamps: true })),
  MediaAsset: () => getModel<ImageAsset>("MediaAsset", new Schema<ImageAsset>({ id: { type: String, unique: true }, title: String, alt: String, caption: String, url: String, mobileUrl: String, width: Number, height: Number, fileSize: Number, page: String, tags: [String], status: String, focalPoint: Schema.Types.Mixed, order: Number }, { timestamps: true })),
  PricingPackage: () => getModel<PricingPackage>("PricingPackage", new Schema<PricingPackage>({ slug: { type: String, unique: true }, service: String, name: String, priceLabel: String, duration: String, features: [String], featured: Boolean, status: String }, { timestamps: true })),
  BlogPost: () => getModel<BlogPost>("BlogPost", new Schema<BlogPost>({ slug: { type: String, unique: true }, title: String, excerpt: String, category: String, author: String, date: String, body: String, featuredImage: imageSchema, inlineImages: [imageSchema], status: String }, { timestamps: true })),
  Product: () => getModel<Product>("Product", new Schema<Product>({ slug: { type: String, unique: true }, title: String, description: String, priceLabel: String, compareAtPriceLabel: String, status: String, images: [imageSchema], sizes: [String], colors: [String], inventory: Number }, { timestamps: true })),
  TeamMember: () => getModel<TeamMember>("TeamMember", new Schema<TeamMember>({ slug: { type: String, unique: true }, name: String, role: String, bio: String, credentials: [String], image: imageSchema, status: String }, { timestamps: true })),
  Testimonial: () => getModel<Testimonial>("Testimonial", new Schema<Testimonial>({ slug: { type: String, unique: true }, reviewer: String, petName: String, service: String, rating: Number, quote: String, location: String, image: imageSchema, status: String, sample: Boolean }, { timestamps: true })),
  Faq: () => getModel<Faq>("Faq", new Schema<Faq>({ slug: { type: String, unique: true }, question: String, answer: String, category: String, serviceSlug: String, status: String, order: Number }, { timestamps: true })),
  Booking: () => getModel<BookingRequest>("Booking", new Schema<BookingRequest>({ customerName: String, fullName: String, email: String, phone: String, address: String, preferredContact: String, service: String, packageSelection: String, addonSelected: Boolean, estimatedTotal: String, preferredDate: String, preferredTime: String, pickupTime: String, dropoffTime: String, shuttleRequested: String, petName: String, petType: String, breed: String, age: String, weight: String, sex: String, spayNeuterStatus: String, temperament: String, specialNeeds: String, vaccinationStatus: String, medicalDetails: String, allergies: String, feedingInstructions: String, emergencyContact: String, veterinarian: String, behaviouralNotes: String, vaccinationUploadNote: String, giftCardCode: String, paymentNote: String, notes: String, policyAgreement: Boolean, paymentStatus: String, status: { type: String, default: "New" }, adminNotes: String }, { timestamps: true })),
  GiftCardOrder: () => getModel<GiftCardOrder>("GiftCardOrder", new Schema<GiftCardOrder>({ denomination: String, recipientName: String, recipientEmail: String, senderName: String, senderEmail: String, message: String, deliveryDate: String, paymentStatus: { type: String, default: "Payment Pending" }, status: { type: String, default: "New" } }, { timestamps: true })),
  AdminUser: () => getModel<{ email: string; passwordHash: string; role: string }>("AdminUser", new Schema({ email: { type: String, unique: true }, passwordHash: String, role: { type: String, default: "Owner/Admin" } }, { timestamps: true })),
};

export const collectionDefaults = {
  pages,
  services,
  media: [...galleryImages, ...treatImages],
  pricing: pricingPackages,
  blog: blogPosts,
  products,
  team,
  testimonials,
  faqs,
};

export const collectionModelMap = {
  pages: Models.Page,
  services: Models.Service,
  media: Models.MediaAsset,
  pricing: Models.PricingPackage,
  blog: Models.BlogPost,
  products: Models.Product,
  team: Models.TeamMember,
  testimonials: Models.Testimonial,
  faqs: Models.Faq,
};

export type CollectionName = keyof typeof collectionModelMap;

export async function getCollection<T>(collection: CollectionName, fallback: T[]): Promise<T[]> {
  const db = await connectMongo();
  if (!db) return fallback;
  const ModelCtor = collectionModelMap[collection]() as unknown as Model<Record<string, unknown>>;
  const docs = await ModelCtor.find({}).lean();
  return docs.length ? (JSON.parse(JSON.stringify(docs)) as T[]) : fallback;
}

export async function getPage(slug: string) {
  const allPages = await getCollection<PageContent>("pages", pages);
  return allPages.find((page) => page.slug === slug && page.status !== "draft") ?? pages.find((page) => page.slug === slug && page.status !== "draft");
}

export async function getServices() {
  // Public site always uses the confirmed service catalog.
  return services.filter((service) => service.status !== "draft");
}

export async function getProducts() {
  // Public shop uses the confirmed merch + gift-card catalog.
  return products.filter((product) => product.status !== "draft");
}

export async function getTestimonials() {
  // Public site always uses the confirmed review list (skips stale CMS sample entries).
  return testimonials.filter((item) => item.status !== "draft" && !item.sample);
}

export async function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export async function syncServices() {
  const db = await connectMongo();
  if (!db) return getServices();

  const ModelCtor = Models.Service() as unknown as Model<Record<string, unknown>>;
  await ModelCtor.deleteMany({});
  for (const item of services) {
    await ModelCtor.updateOne({ slug: item.slug }, { $set: item }, { upsert: true });
  }
  return getServices();
}

export async function syncPricingPackages() {
  const db = await connectMongo();
  if (!db) return pricingPackages.filter((item) => item.status !== "hidden");

  const ModelCtor = Models.PricingPackage() as unknown as Model<Record<string, unknown>>;
  await ModelCtor.deleteMany({});
  for (const item of pricingPackages) {
    await ModelCtor.updateOne({ slug: item.slug }, { $set: item }, { upsert: true });
  }
  return pricingPackages.filter((item) => item.status !== "hidden");
}

/** Public pricing always uses the confirmed daycare/boarding package list. */
export async function getPricingPackages(): Promise<PricingPackage[]> {
  return pricingPackages.filter((item) => item.status !== "hidden");
}

export async function seedDatabase() {
  const db = await connectMongo();
  if (!db) throw new Error("MONGODB_URI is required to seed the database.");

  const entries = Object.entries(collectionDefaults) as [CollectionName, unknown[]][];
  for (const [collection, data] of entries) {
    const ModelCtor = collectionModelMap[collection]() as unknown as Model<Record<string, unknown>>;
    if (collection === "pricing" || collection === "services") {
      await ModelCtor.deleteMany({});
    }
    for (const item of data as Record<string, unknown>[]) {
      const key = item.slug ? { slug: item.slug } : { id: item.id };
      await ModelCtor.updateOne(key, { $set: item }, { upsert: true });
    }
  }
}

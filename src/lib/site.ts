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
  type: "story" | "imageGrid" | "cards" | "process" | "faq" | "cta" | "gallery" | "shop" | "testimonials" | "stats" | "features" | "founder";
  eyebrow?: string;
  title: string;
  body?: string;
  items?: { title: string; body: string; image?: ImageAsset; href?: string; icon?: string; number?: string }[];
  images?: ImageAsset[];
  primaryCta?: { label: string; href: string };
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
    subtitle?: string;
    body: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    images: ImageAsset[];
    badge?: { title: string; subtitle: string };
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
  instagram?: string;
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
  denomination: "CAD $150";
  quantity: number;
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
  formerlyShort: "(formerly known as Handandpaw.ca / Handandpaw.in)",
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
    id: "behaviour-training1",
    title: "Behaviour training service",
    alt: "Dog receiving positive behaviour training",
    url: "/images/services/Behaviour-Training1.webp",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["training"],
    status: "published",
  },
  {
    id: "behaviour-training2",
    title: "Dog training session",
    alt: "Calm behaviour training with handler",
    url: "/images/services/Behaviour-Training2.webp",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["training"],
    status: "published",
  },
  {
    id: "nail-trimming1",
    title: "Nail trimming service",
    alt: "Gentle nail trimming for dog paw care",
    url: "/images/services/nail-trimming1.png",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["nail-trim"],
    status: "published",
  },
  {
    id: "nail-trimming2",
    title: "Professional nail care",
    alt: "Professional dog nail trimming service",
    url: "/images/services/nail-trimming2.png",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["nail-trim"],
    status: "published",
  },
  {
    id: "dog-boarding1",
    title: "Dog boarding service",
    alt: "Comfortable overnight dog boarding care",
    url: "/images/services/dog-boarding1.png",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["boarding"],
    status: "published",
  },
  {
    id: "dog-boarding2",
    title: "Overnight dog care",
    alt: "Dogs resting comfortably in boarding environment",
    url: "/images/services/dog-boarding2.png",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["boarding"],
    status: "published",
  },
  {
    id: "daycare1",
    title: "Dog daycare service",
    alt: "Dogs playing together in supervised daycare",
    url: "/images/services/daycare1.png",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["daycare"],
    status: "published",
  },
  {
    id: "daycare2",
    title: "Supervised daycare",
    alt: "Dogs enjoying safe daycare environment",
    url: "/images/services/daycare2.png",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["daycare"],
    status: "published",
  },
  {
    id: "dog-grooming1",
    title: "Professional dog grooming",
    alt: "Dog receiving professional grooming care",
    url: "/images/services/dog-grooming1.png",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["grooming"],
    status: "published",
  },
  {
    id: "dog-grooming2",
    title: "Dog grooming service",
    alt: "Calm dog being professionally groomed",
    url: "/images/services/dog-grooming2.png",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["grooming"],
    status: "published",
  },
  {
    id: "dog-walking1",
    title: "Dog walking service",
    alt: "Professional dog walking in Toronto neighbourhood",
    url: "/images/services/dog-walking1.png",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["walking"],
    status: "published",
  },
  {
    id: "dog-walking2",
    title: "Structured dog walks",
    alt: "Calm structured neighbourhood dog walk",
    url: "/images/services/dog-walking2.png",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["walking"],
    status: "published",
  },
  {
    id: "pet-cleaning",
    title: "Pet dental cleaning",
    alt: "Professional pet dental care and teeth brushing",
    url: "/images/services/pet-cleaning.png",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["dental", "cleaning"],
    status: "published",
  },
  {
    id: "pet-cleaning1",
    title: "Pet dental care",
    alt: "Gentle teeth brushing for healthy pet dental hygiene",
    url: "/images/services/pet-cleaning1.png",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["dental", "cleaning"],
    status: "published",
  },
  {
    id: "pet-cleaning2",
    title: "Pet oral hygiene",
    alt: "Professional dental care keeping pets healthy",
    url: "/images/services/pet-cleaning2.png",
    width: 1400,
    height: 1000,
    page: "services",
    tags: ["dental", "cleaning"],
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

const gallerySlotMeta: Array<{ title: string; alt: string; caption: string; tags: string[] }> = [
  { title: "Morning courtyard stroll", alt: "Happy dog enjoying a calm morning courtyard walk", caption: "Soft light and steady leash manners.", tags: ["Dog Walking", "Toronto Adventures"] },
  { title: "Cozy boarding nap", alt: "Dog resting comfortably during overnight boarding", caption: "Home-style rest between play windows.", tags: ["Boarding", "Seasonal"] },
  { title: "Daycare socialization circle", alt: "Dogs gathering calmly during supervised daycare play", caption: "Structured social time with attentive supervision.", tags: ["Daycare", "Happy Clients"] },
  { title: "In-home visit check-in", alt: "Caregiver greeting a dog during an in-home pet visit", caption: "Familiar space, gentle attention.", tags: ["Pet Visits", "Care"] },
  { title: "House sitting comfort", alt: "Dog relaxing at home during house sitting care", caption: "Routine kept while you are away.", tags: ["House Sitting", "Trust"] },
  { title: "Secure chauffeur ride", alt: "Dog settled safely for a pet chauffeur trip", caption: "Calm transport across the GTA.", tags: ["Chauffeur", "Toronto Adventures"] },
  { title: "Fresh grooming finish", alt: "Well-groomed dog after a tidy grooming session", caption: "Clean coat, calm handling.", tags: ["Grooming", "Care"] },
  { title: "Gentle nail trim", alt: "Dog receiving a careful nail trim", caption: "Steady paws and patient care.", tags: ["Nail Trimming", "Grooming"] },
  { title: "Focused training moment", alt: "Dog practicing a calm cue during training", caption: "Clear cues, positive reinforcement.", tags: ["Training", "Team"] },
  { title: "Park excursion adventure", alt: "Dog on a guided outdoor excursion through a leafy park", caption: "Enrichment beyond the neighbourhood block.", tags: ["Excursions", "Toronto Adventures"] },
  { title: "Team with #petparents", alt: "Care team member connecting with a happy dog", caption: "We are a team of #petpeople and #petparents.", tags: ["Team", "Behind The Scenes"] },
  { title: "Bright facility lounge", alt: "Dogs resting in a clean bright care lounge", caption: "Clean spaces prepared for comfort.", tags: ["Facility", "Care"] },
  { title: "Downtown Toronto walk", alt: "Dog walking through a Downtown Toronto neighbourhood", caption: "Serving across GTA, every season.", tags: ["Toronto", "Dog Walking"] },
  { title: "Trusted calm routine", alt: "Dog settling into a familiar daily care routine", caption: "Predictable care that pets recognize.", tags: ["Trust", "Care"] },
  { title: "Happy client portrait", alt: "Relaxed client dog smiling after a care visit", caption: "Moments our pet parents love to see.", tags: ["Happy Clients", "Portrait"] },
  { title: "Booking day readiness", alt: "Dog waiting calmly before a booked care appointment", caption: "Meet & Greet through confirmed care days.", tags: ["Booking", "Care"] },
  { title: "Contact desk welcome", alt: "Friendly dog near the studio entrance ready to greet visitors", caption: "Say hello — we are here to help.", tags: ["Contact", "Team"] },
  { title: "Journal cover quiet hour", alt: "Dog resting beside a notebook during a quiet care hour", caption: "Stories from calm stays and walks.", tags: ["Journal", "Portrait"] },
  { title: "Policy-ready care setup", alt: "Leash and care essentials arranged for a structured visit", caption: "Clear policies, careful handling.", tags: ["Policy", "Behind The Scenes"] },
  { title: "Seasonal autumn walk", alt: "Dog walking on a warm autumn path", caption: "Operating all season across GTA.", tags: ["Seasonal", "Dog Walking"] },
  { title: "Boarded overnight comfort", alt: "Dog curled up comfortably overnight in boarding care", caption: "Overnight boarding with home-like calm.", tags: ["Boarding", "Trust"] },
  { title: "Daycare enrichment play", alt: "Dogs engaged in enrichment play during daycare", caption: "Play with purpose and supervision.", tags: ["Daycare", "Happy Clients"] },
  { title: "Grooming tidy-up", alt: "Dog looking polished after a grooming tidy-up", caption: "Bath, brush and bright expression.", tags: ["Grooming", "Portrait"] },
  { title: "Hero courtyard light", alt: "Dog standing in golden courtyard light", caption: "Gallery moments from real care days.", tags: ["Hero", "Portrait"] },
  { title: "Behind the scenes prep", alt: "Care prep space with leash, notes and a calm dog nearby", caption: "Quiet work before every visit.", tags: ["Behind The Scenes", "Team"] },
  { title: "Apparel lifestyle moment", alt: "Dog beside DTdogs lifestyle apparel styling", caption: "Merch made for pet parents.", tags: ["Apparel", "Product"] },
  { title: "Product flat-lay moment", alt: "Pet-care product details arranged for a clean product shot", caption: "Details from the DTdogs shop.", tags: ["Product", "Apparel"] },
  { title: "Toronto adventures trail", alt: "Dog exploring a leafy Toronto trail on leash", caption: "Guided adventures around the city.", tags: ["Toronto Adventures", "Excursions"] },
  { title: "Pet visit afternoon", alt: "Afternoon in-home visit with a happy dog", caption: "Midday check-ins done with care.", tags: ["Pet Visits", "Happy Clients"] },
  { title: "Training outdoor focus", alt: "Dog practicing outdoor focus work with a handler", caption: "Behaviour-informed outdoor practice.", tags: ["Training", "Excursions"] },
  { title: "Facility rest corner", alt: "Dog resting in a quiet facility rest corner", caption: "Space to reset between activities.", tags: ["Facility", "Boarding"] },
  { title: "Chauffeur drop-off calm", alt: "Dog remaining calm during chauffeur drop-off", caption: "Door-to-door with a steady hand.", tags: ["Chauffeur", "Trust"] },
  { title: "Seasonal winter stroll", alt: "Dog enjoying a calm winter neighbourhood stroll", caption: "Care continues through every season.", tags: ["Seasonal", "Toronto"] },
];

export const galleryImages: ImageAsset[] = [
  ...mediaLibrary
    .filter((image) => image.status !== "draft")
    .map((image, index) => ({
      ...image,
      order: index + 1,
      tags: (image.tags ?? []).map((tag) =>
        tag
          .split(/[-_\s]+/)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      ),
    })),
  ...gallerySlotMeta.map((meta, index) => ({
    id: `gallery-slot-${String(index + 1).padStart(2, "0")}`,
    title: meta.title,
    alt: meta.alt,
    caption: meta.caption,
    url: `/images/gallery/gallery-slot-${String(index + 1).padStart(2, "0")}.webp`,
    width: 1400,
    height: 1000,
    page: "gallery" as const,
    tags: meta.tags,
    order: index + 1,
    status: "published" as const,
  })),
];

export const treatImages: ImageAsset[] = [
  {
    id: "treat-1",
    title: "Dog Treats",
    alt: "Premium dog treats",
    caption: "",
    url: "/images/treats/treat-1.JPG",
    width: 800,
    height: 600,
    page: "treats",
    tags: ["Treats", "Product"],
    order: 1,
    status: "published",
  },
  {
    id: "treat-2",
    title: "Dog Treats",
    alt: "Dog treats",
    caption: "",
    url: "/images/treats/treat-2.JPG",
    width: 800,
    height: 600,
    page: "treats",
    tags: ["Treats", "Happy Clients"],
    order: 2,
    status: "published",
  },
  {
    id: "treat-3",
    title: "Dog Treats",
    alt: "Packaged dog treats",
    caption: "",
    url: "/images/treats/treat-3.JPG",
    width: 800,
    height: 600,
    page: "treats",
    tags: ["Treats", "Product"],
    order: 3,
    status: "published",
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

export const services: Service[] = [
  {
    slug: "dog-walking",
    name: "Dog Walking",
    eyebrow: "Structured walks",
    summary: "dog being walked",
    description:
      "Structured neighbourhood walks with exercise, outdoor enrichment and bathroom breaks — paced to your dog and delivered by #petpeople across the GTA.",
    forWhom: "Ideal for busy pet parents who want reliable daily or weekly walks with clear updates.",
    benefits: ["Steady exercise and enrichment", "Bathroom breaks on schedule", "Pace matched to your dog", "Serving across GTA"],
    includes: ["Leashed structured walk", "Outdoor stimulation", "Bathroom opportunities", "Personalized handling", "Optional +$5 add-on"],
    process: ["Book your walk window", "Share pace and gear notes", "We complete the walk", "You get a quick care update"],
    faqs: [
      { question: "Solo or group walks?", answer: "Walks are structured around your dog’s needs and compatible arrangements when appropriate." },
      { question: "Where do you walk?", answer: "We serve Downtown Toronto and across the GTA with neighbourhood-friendly routes." },
    ],
    related: ["daycare", "boarding", "behaviour-training"],
    images: [img("dog-walking1"), img("dog-walking2"), img("walk-toronto")],
    featured: true,
    duration: "Flexible",
    priceLabel: "From $20",
    status: "published",
  },
  {
    slug: "grooming",
    name: "Pet Grooming",
    eyebrow: "Clean & polished",
    summary: "grooming photo",
    description:
      "Professional grooming tailored to coat, breed and comfort — bath, brush, tidy finish and calm handling so your dog leaves fresh and confident.",
    forWhom: "Perfect for dogs who need a full refresh, coat care and a tidy professional finish.",
    benefits: ["Coat and skin comfort", "Breed-aware styling", "Calm spa-style handling", "Clear appointment planning"],
    includes: ["Bath and dry", "Brushing", "Hygiene tidy as needed", "Professional finish", "Optional +$5 add-on"],
    process: ["Share coat and breed notes", "Confirm appointment timing", "Enjoy the grooming session", "Receive after-care notes"],
    faqs: [
      { question: "How long does grooming take?", answer: "Most grooming visits are planned around one focused appointment; coat condition can affect timing." },
      { question: "Can nervous dogs book?", answer: "Yes — we use calm handling and can discuss temperament during booking." },
    ],
    related: ["nail-trim", "daycare", "dog-walking"],
    images: [img("dog-grooming1"), img("dog-grooming2"), img("grooming")],
    featured: true,
    duration: "Appointment",
    priceLabel: "$28",
    status: "published",
  },
  {
    slug: "daycare",
    name: "Day Care",
    eyebrow: "Exceeding 3 hrs before / after grooming",
    summary: "dogs playing",
    description:
      "Day care when your dog stays more than 3 hours before or after a grooming appointment — supervised play, rest and calm care while you are away.",
    forWhom: "Ideal when grooming runs long and your dog needs extended supervised care before or after the appointment.",
    benefits: ["Supervised social play", "Enrichment activities", "Scheduled rest", "Convenient with grooming visits"],
    includes: ["Day care stay exceeding 3 hrs before/after grooming", "Supervised play", "Safe socialization", "Rest periods", "Optional +$5 add-on"],
    process: ["Book with your grooming visit", "Confirm drop-off and pick-up windows", "We provide supervised day care", "Pick up after play and rest"],
    faqs: [
      { question: "When does this day care apply?", answer: "This day care rate applies when the stay exceeds 3 hours before or after a grooming appointment." },
      { question: "Can I book day care alone?", answer: "Yes — share your timing needs at booking and we will confirm the right care window." },
    ],
    related: ["boarding", "dog-walking", "behaviour-training"],
    images: [img("daycare1"), img("daycare2"), img("daycare-play")],
    featured: true,
    duration: "Exceeding 3 hrs before / after grooming",
    priceLabel: "$45",
    status: "published",
  },
  {
    slug: "boarding",
    name: "Boarding",
    eyebrow: "Home-style overnight",
    summary: "comfortable resting dogs",
    description:
      "Comfortable overnight boarding in a calm, supervised setting with personalized feeding, bathroom, rest and care routines based on each dog’s needs.",
    forWhom: "For families who need trusted overnight care while away — including 24/7 boarding aligned with city bylaws and confirmed bookings.",
    benefits: ["Overnight supervision", "Calm rest environment", "Personalized routines", "Feeding and comfort support"],
    includes: ["Overnight boarding", "Personalized feeding", "Bathroom support", "Rest routines", "Supervised care", "Optional +$5 add-on"],
    process: ["Request overnight dates", "Share intake and medical notes", "Confirm boarding", "Receive care updates"],
    faqs: [
      { question: "Is boarding available overnight?", answer: "Yes — boarding is available 24/7 according to city bylaws and confirmed booking arrangements." },
      { question: "Can I bring my dog’s food?", answer: "Yes. Familiar food helps keep routines calm during the stay." },
    ],
    related: ["daycare", "dog-walking", "grooming"],
    images: [img("dog-boarding1"), img("dog-boarding2"), img("boarding-home")],
    featured: true,
    duration: "Overnight",
    priceLabel: "From $50",
    status: "published",
  },
  {
    slug: "nail-trim",
    name: "Nail Trimming",
    eyebrow: "Gentle paw care",
    summary: "nail trimming image",
    description:
      "Careful nail clipping and grinding with calm handling — keeping paws tidy, comfortable and ready for walks without stress.",
    forWhom: "Great as a quick standalone visit or paired with grooming when nails need regular attention.",
    benefits: ["Healthier nails and paws", "Comfortable walking", "Calm handling", "Quick focused appointment"],
    includes: ["Nail clipping", "Grinding as needed", "Paw check", "Gentle handling", "Optional +$5 add-on"],
    process: ["Book a nail-trim slot", "Share temperament notes", "Complete the trim", "Go home with tidy paws"],
    faqs: [
      { question: "Is grinding included?", answer: "Yes — grinding can be included when it helps keep nails smooth and comfortable." },
      { question: "Can this be added to grooming?", answer: "Yes. Nail care can be booked alone or discussed as part of a grooming visit." },
    ],
    related: ["grooming", "dog-walking", "daycare"],
    images: [img("nail-trimming1"), img("nail-trimming2"), img("nails")],
    featured: true,
    duration: "Quick visit",
    priceLabel: "$28",
    status: "published",
  },
  {
    slug: "behaviour-training",
    name: "Behaviour Training",
    eyebrow: "Positive guidance",
    summary: "training interaction",
    description:
      "Behaviour-informed training focused on everyday manners, confidence and clear communication — calm practice that helps #petparents and dogs work better together.",
    forWhom: "For dogs and pet parents who want structured support with manners, confidence and everyday cues.",
    benefits: ["Positive behaviour support", "Everyday obedience skills", "Confidence building", "Clear handler communication"],
    includes: ["15-minute training interaction", "Cue practice", "Handler guidance", "Progress notes", "Optional +$5 add-on"],
    process: ["Share training goals", "Book a 15-minute session", "Practice with guided interaction", "Continue at home with notes"],
    faqs: [
      { question: "How long is each session?", answer: "Behaviour training is priced at $23 per 15-minute session." },
      { question: "Do you use positive methods?", answer: "Yes — we focus on calm, positive, behaviour-informed training." },
    ],
    related: ["dog-walking", "daycare", "boarding"],
    images: [img("behaviour-training1"), img("behaviour-training2"), img("training")],
    featured: true,
    duration: "15 min",
    priceLabel: "$23 / 15 min",
    status: "published",
  },
  {
    slug: "pet-dental-cleaning",
    name: "Pet Dental Cleaning",
    eyebrow: "Fresh breath & healthy teeth",
    summary: "pet dental care",
    description:
      "Professional teeth brushing and dental care to keep your pet's mouth clean, healthy and fresh — using gentle technique and pet-safe products.",
    forWhom: "Ideal for pet parents who want to maintain their dog's oral hygiene between vet visits.",
    benefits: ["Fresher breath", "Healthier gums and teeth", "Reduced plaque build-up", "Calm, gentle handling"],
    includes: ["Teeth brushing with chosen kit", "Gentle dental handling", "Care notes after session", "Optional +$5 add-on"],
    process: ["Choose your dental kit option", "Book a dental session", "Gentle brushing completed", "Receive after-care notes"],
    faqs: [
      { question: "What kit options are available?", answer: "We offer three options: new toothbrush ($31), dental kit ($45), or your pet's personal toothbrush ($24)." },
      { question: "How often should my dog have dental cleaning?", answer: "Regular brushing is recommended — monthly or more frequent for dogs prone to plaque." },
    ],
    related: ["grooming", "nail-trim", "daycare"],
    images: [img("pet-cleaning1"), img("pet-cleaning2"), img("pet-cleaning")],
    featured: true,
    duration: "Quick visit",
    priceLabel: "From $24",
    priceTiers: [
      { label: "Teeth Brushing with new toothbrush", priceLabel: "$31.00" },
      { label: "Teeth Brushing with dental kit", priceLabel: "$45.00" },
      { label: "Teeth Brushing with personal toothbrush", priceLabel: "$24.00" },
    ],
    status: "published",
  },
];

export const faqs: Faq[] = [
  // General Daycare and Boarding FAQs
  { slug: "how-do-i-get-started", question: "How do I get started?", answer: "Getting started is easy! Book a Meet & Greet session through our website or WhatsApp. We'll discuss your pet's needs, temperament, and care preferences to ensure a perfect fit.", category: "General Daycare and Boarding FAQs", status: "published", order: 1 },
  { slug: "how-do-i-schedule-a-day-of-care", question: "How do I schedule a day of care?", answer: "You can schedule care through our online booking system or by contacting us via WhatsApp or email. We recommend booking in advance to secure your preferred time slot.", category: "General Daycare and Boarding FAQs", status: "published", order: 2 },
  { slug: "is-there-flexibility-to-drop-off-pick-up", question: "Is there flexibility to the drop-off and pick-up times?", answer: "Yes! We offer flexible drop-off and pick-up times between 7:00 AM and 9:00 PM to accommodate your schedule. Please coordinate timing during booking.", category: "General Daycare and Boarding FAQs", status: "published", order: 3 },
  { slug: "do-you-offer-boarding-overnight", question: "Do you offer boarding or overnight care?", answer: "Yes, we provide comfortable overnight boarding in a calm, supervised setting with personalized feeding, bathroom support, and rest routines based on each dog's needs.", category: "General Daycare and Boarding FAQs", status: "published", order: 4 },
  { slug: "will-my-dog-be-walked-during-day", question: "Will my dog be walked during the day?", answer: "Yes, dogs in daycare receive structured walks and outdoor enrichment as part of their daily routine to ensure proper exercise and bathroom breaks.", category: "General Daycare and Boarding FAQs", status: "published", order: 5 },
  { slug: "how-old-must-my-dog-be", question: "How old must my dog be to attend?", answer: "Dogs must be at least 4 months old and have completed their initial vaccination series before attending daycare or boarding.", category: "General Daycare and Boarding FAQs", status: "published", order: 6 },
  { slug: "dog-not-spayed-neutered", question: "My dog has not been spayed or neutered. Can I still bring them to daycare?", answer: "We accept intact dogs on a case-by-case basis depending on temperament and behavior. Please discuss this during your Meet & Greet so we can assess the best approach.", category: "General Daycare and Boarding FAQs", status: "published", order: 7 },
  { slug: "does-my-dog-need-vaccinated", question: "Does my dog need to be vaccinated?", answer: "Yes, all dogs must be up-to-date on core vaccines including Rabies, Distemper, and Bordetella (kennel cough) to ensure the safety of all pets in our care.", category: "General Daycare and Boarding FAQs", status: "published", order: 8 },
  { slug: "what-if-i-need-to-cancel", question: "What happens if I need to cancel my stay?", answer: "We require advance notice for cancellations. Please contact us as soon as possible via WhatsApp or email. Cancellation policies will be discussed during booking.", category: "General Daycare and Boarding FAQs", status: "published", order: 9 },
  { slug: "do-you-feed-the-dogs", question: "Do you feed the dogs?", answer: "Yes, we follow your feeding instructions and schedule. You're welcome to bring your dog's regular food to maintain their routine and prevent digestive upset.", category: "General Daycare and Boarding FAQs", status: "published", order: 10 },
  { slug: "what-if-dog-gets-sick", question: "What happens if my dog gets sick at daycare or while being boarded?", answer: "We monitor all pets closely. If your dog shows signs of illness, we'll contact you immediately and follow your veterinary authorization. In emergencies, we'll seek immediate veterinary care.", category: "General Daycare and Boarding FAQs", status: "published", order: 11 },
  { slug: "how-many-dogs-at-daycare", question: "How many dogs are usually at daycare?", answer: "We maintain small, manageable groups to ensure personalized attention and safety. Group sizes vary based on bookings, but we prioritize calm, supervised environments.", category: "General Daycare and Boarding FAQs", status: "published", order: 12 },
  { slug: "special-care-instructions", question: "My dog requires special care. How do you guarantee the instructions are followed properly?", answer: "We take detailed intake notes during your Meet & Greet and maintain clear records of all care instructions. Our team follows personalized care plans for each pet.", category: "General Daycare and Boarding FAQs", status: "published", order: 13 },
  { slug: "how-far-in-advance-to-book", question: "How far in advance do I need to book daycare services?", answer: "We recommend booking at least 3-7 days in advance, especially for weekends and holidays. However, we'll do our best to accommodate last-minute requests when possible.", category: "General Daycare and Boarding FAQs", status: "published", order: 14 },
  
  // Dog Grooming FAQs
  { slug: "what-grooming-services", question: "What grooming services are available?", answer: "We offer full grooming including bath, brushing, hygiene trim, nail trimming, and breed-specific styling. Services can be customized based on your dog's coat and needs.", category: "Dog Grooming FAQs", status: "published", order: 200 },
  { slug: "choose-grooming-package", question: "How do I choose the right grooming package?", answer: "During booking, share your dog's breed, coat type, and desired style. We'll recommend the best package and confirm all details before your appointment.", category: "Dog Grooming FAQs", status: "published", order: 201 },
  { slug: "how-long-grooming-take", question: "How long does grooming take?", answer: "Most grooming sessions take 1.5-3 hours depending on coat condition, breed, and services selected. We'll provide an estimated timeframe during booking.", category: "Dog Grooming FAQs", status: "published", order: 202 },
  { slug: "nervous-dogs-grooming", question: "Can nervous dogs book grooming?", answer: "Yes! We use calm, patient handling and can discuss your dog's temperament during booking to ensure a comfortable grooming experience.", category: "Dog Grooming FAQs", status: "published", order: 203 },
  { slug: "grooming-prices-confirmed", question: "Are grooming prices confirmed before the appointment?", answer: "Yes, pricing is discussed and confirmed during booking. Any adjustments needed due to coat condition will be communicated before proceeding.", category: "Dog Grooming FAQs", status: "published", order: 204 },
  
  // Dog Walking FAQs
  { slug: "walk-time-options", question: "What walk-time options are available?", answer: "We offer flexible walk durations from 30 minutes to 1 hour, paced to your dog's needs and energy level across the GTA.", category: "Dog Walking FAQs", status: "published", order: 300 },
  { slug: "solo-walks", question: "Do you offer solo walks?", answer: "Yes, solo walks are available for dogs who prefer one-on-one attention or have specific behavioral or health needs.", category: "Dog Walking FAQs", status: "published", order: 301 },
  { slug: "group-walks", question: "Do you offer group walks?", answer: "Yes, we offer small group walks for socialized dogs who enjoy companionship. Groups are carefully matched based on size, temperament, and energy level.", category: "Dog Walking FAQs", status: "published", order: 302 },
  { slug: "areas-you-serve", question: "What areas do you serve?", answer: "We serve Downtown Toronto and across the Greater Toronto Area including East York, North York, Scarborough, Etobicoke, and surrounding neighborhoods.", category: "Dog Walking FAQs", status: "published", order: 303 },
  { slug: "meet-greet-required", question: "Is a meet-and-greet required before walking?", answer: "Yes, a Meet & Greet is required for all new clients to discuss your dog's walking style, leash behavior, and any special considerations.", category: "Dog Walking FAQs", status: "published", order: 304 },
  
  // Booking and Payment FAQs
  { slug: "how-to-book-service", question: "How do I book a service?", answer: "Book through our website booking form, WhatsApp, or email. Select your service, date, and time, then provide pet details to complete your booking.", category: "Booking and Payment FAQs", status: "published", order: 400 },
  { slug: "deposit-required", question: "Is a deposit required?", answer: "Deposits may be required for certain services like boarding or multi-day packages. Payment details will be confirmed during booking.", category: "Booking and Payment FAQs", status: "published", order: 401 },
  { slug: "can-use-gift-card", question: "Can I use a gift card?", answer: "Yes! DTdogs.ca gift cards can be applied to any service. Simply provide your gift card code during booking or payment.", category: "Booking and Payment FAQs", status: "published", order: 402 },
  { slug: "online-payment-not-configured", question: "What happens if online payment is not configured?", answer: "If online payment is unavailable, we accept e-transfer, cash, or other arranged payment methods. Payment details will be discussed during booking confirmation.", category: "Booking and Payment FAQs", status: "published", order: 403 },
  { slug: "confirmation-email", question: "Will I receive a confirmation email?", answer: "Yes, you'll receive a confirmation via email and/or text once your booking is confirmed. We'll also send reminders before your appointment.", category: "Booking and Payment FAQs", status: "published", order: 404 },
  
  // Health, Safety and Vaccination FAQs
  { slug: "vaccinations-required", question: "What vaccinations are required?", answer: "All dogs must be current on Rabies, Distemper, Parvovirus, and Bordetella (kennel cough) vaccines. Proof of vaccination is required before service.", category: "Health, Safety and Vaccination FAQs", status: "published", order: 500 },
  { slug: "pet-becomes-unwell", question: "What happens if my pet becomes unwell?", answer: "We monitor all pets closely. If your pet shows signs of illness or distress, we'll contact you immediately and follow your emergency care instructions.", category: "Health, Safety and Vaccination FAQs", status: "published", order: 501 },
  { slug: "support-medical-needs", question: "Can you support pets with medical needs?", answer: "Yes, we can administer medications and follow care plans for pets with medical needs. Please discuss all requirements during your Meet & Greet.", category: "Health, Safety and Vaccination FAQs", status: "published", order: 502 },
  { slug: "info-required-before-transport", question: "What information is required before transport?", answer: "We need vaccination records, emergency contact information, veterinary details, and any behavioral or medical considerations that affect safe transport.", category: "Health, Safety and Vaccination FAQs", status: "published", order: 503 },
  { slug: "safety-measures-during-care", question: "What safety measures are used during care?", answer: "We maintain secure facilities, use proper leashing and containment, supervise all activities, follow health protocols, and keep detailed records for every pet in our care.", category: "Health, Safety and Vaccination FAQs", status: "published", order: 504 },
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
    slug: "review-1",
    reviewer: "Client Review",
    petName: "Happy Pet",
    service: "Pet Care",
    rating: 5,
    quote: "Amazing service and care for our furry friend!",
    location: "Toronto",
    image: { id: "review-1", title: "Review 1", alt: "Client testimonial", url: "/images/reviews/1.png", width: 800, height: 800, status: "published" },
    status: "published",
    sample: false,
  },
  {
    slug: "review-2",
    reviewer: "Client Review",
    petName: "Happy Pet",
    service: "Pet Care",
    rating: 5,
    quote: "Excellent experience with professional care!",
    location: "Toronto",
    image: { id: "review-2", title: "Review 2", alt: "Client testimonial", url: "/images/reviews/2.png", width: 800, height: 800, status: "published" },
    status: "published",
    sample: false,
  },
  {
    slug: "review-3",
    reviewer: "Client Review",
    petName: "Happy Pet",
    service: "Pet Care",
    rating: 5,
    quote: "Highly recommend their services!",
    location: "Toronto",
    image: { id: "review-3", title: "Review 3", alt: "Client testimonial", url: "/images/reviews/3.png", width: 800, height: 800, status: "published" },
    status: "published",
    sample: false,
  },
  {
    slug: "review-4",
    reviewer: "Client Review",
    petName: "Happy Pet",
    service: "Pet Care",
    rating: 5,
    quote: "Outstanding pet care services!",
    location: "Toronto",
    image: { id: "review-4", title: "Review 4", alt: "Client testimonial", url: "/images/reviews/4.png", width: 800, height: 800, status: "published" },
    status: "published",
    sample: false,
  },
  {
    slug: "review-5",
    reviewer: "Client Review",
    petName: "Happy Pet",
    service: "Pet Care",
    rating: 5,
    quote: "Very professional and caring team!",
    location: "Toronto",
    image: { id: "review-5", title: "Review 5", alt: "Client testimonial", url: "/images/reviews/5.png", width: 800, height: 800, status: "published" },
    status: "published",
    sample: false,
  },
  {
    slug: "review-6",
    reviewer: "Client Review",
    petName: "Happy Pet",
    service: "Pet Care",
    rating: 5,
    quote: "Trusted care for our beloved pets!",
    location: "Toronto",
    image: { id: "review-6", title: "Review 6", alt: "Client testimonial", url: "/images/reviews/6.png", width: 800, height: 800, status: "published" },
    status: "published",
    sample: false,
  },
  {
    slug: "review-7",
    reviewer: "Client Review",
    petName: "Happy Pet",
    service: "Pet Care",
    rating: 5,
    quote: "Fantastic service, will use again!",
    location: "Toronto",
    image: { id: "review-7", title: "Review 7", alt: "Client testimonial", url: "/images/reviews/7.png", width: 800, height: 800, status: "published" },
    status: "published",
    sample: false,
  },
  {
    slug: "review-8",
    reviewer: "Client Review",
    petName: "Happy Pet",
    service: "Pet Care",
    rating: 5,
    quote: "Best pet care in Toronto!",
    location: "Toronto",
    image: { id: "review-8", title: "Review 8", alt: "Client testimonial", url: "/images/reviews/8.png", width: 800, height: 800, status: "published" },
    status: "published",
    sample: false,
  },
  {
    slug: "review-9",
    reviewer: "Client Review",
    petName: "Happy Pet",
    service: "Pet Care",
    rating: 5,
    quote: "Love the attention and care provided!",
    location: "Toronto",
    image: { id: "review-9", title: "Review 9", alt: "Client testimonial", url: "/images/reviews/9.png", width: 800, height: 800, status: "published" },
    status: "published",
    sample: false,
  },
  {
    slug: "review-10",
    reviewer: "Client Review",
    petName: "Happy Pet",
    service: "Pet Care",
    rating: 5,
    quote: "Professional and reliable service!",
    location: "Toronto",
    image: { id: "review-10", title: "Review 10", alt: "Client testimonial", url: "/images/reviews/10.png", width: 800, height: 800, status: "published" },
    status: "published",
    sample: false,
  },
  {
    slug: "review-11",
    reviewer: "Client Review",
    petName: "Happy Pet",
    service: "Pet Care",
    rating: 5,
    quote: "Exceptional care for our furry family!",
    location: "Toronto",
    image: { id: "review-11", title: "Review 11", alt: "Client testimonial", url: "/images/reviews/11.png", width: 800, height: 800, status: "published" },
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
    slug: "pawmily",
    name: "PawMily",
    role: "Toronto",
    bio: "Grooming, walks, sitting services across Toronto.",
    credentials: ["Grooming", "Dog Walking", "Pet Sitting"],
    image: img("pet-visit"),
    instagram: "https://www.instagram.com/pawmily.ca/",
    status: "published",
  },
  {
    slug: "yazz",
    name: "Yazz",
    role: "East Toronto",
    bio: "Professional grooming services in East Toronto.",
    credentials: ["Grooming"],
    image: img("facility"),
    instagram: "https://www.instagram.com/kiss.the.paws/",
    status: "published",
  },
  {
    slug: "suzanne",
    name: "Suzanne",
    role: "West Toronto",
    bio: "Sunny Paws Grooming — professional pet grooming in West Toronto.",
    credentials: ["Grooming"],
    image: img("grooming"),
    instagram: "https://www.instagram.com/sunny.pawsgrooming/",
    status: "published",
  },
  {
    slug: "shanice",
    name: "Shanice",
    role: "All Over Canada",
    bio: "The Prudent Tooth Fairy — professional teeth cleaning service across Canada.",
    credentials: ["Teeth Cleaning"],
    image: img("nails"),
    instagram: "https://www.instagram.com/theprudenttoothfairy/",
    status: "published",
  },
  {
    slug: "cass",
    name: "Cass",
    role: "Canada",
    bio: "Wagging Through Life — professional pet sitter across Canada.",
    credentials: ["Pet Sitting"],
    image: img("trust-full"),
    instagram: "https://www.instagram.com/wagging_through_life/",
    status: "published",
  },
];

export const products: Product[] = [
  {
    slug: "gift-card-150",
    title: "DTdogs Digital Gift Card - $150",
    description: "One gift card value: CAD $150. Buy as many as you need for friends, family, or pet parents.",
    priceLabel: "CAD $150",
    status: "inquiry",
    images: [img("gift-card-100-image"), img("gift-card-50-image"), img("policy-care"), img("booking-bg"), img("floating-pup")],
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
    ],
  },
  {
    slug: "pricing",
    title: "Pricing",
    navTitle: "Bundle",
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
      title: "A visual journal of safe stays, happy walks and Structured pet-care.",
      body: "Real moments from Downtown Toronto and across the GTA — walks, boarding, daycare and everyday care with our #petpeople.",
      primaryCta: { label: "Book Now", href: "/booking" },
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
      eyebrow: "Treats for the Dogs",
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
      eyebrow: "Trusted by pet parents across GTA",
      title: "Real reviews belong here, carefully managed and approved.",
      body: "Honesty is the Best Policy, feel free to share your review and read what Petparents have to say about us.",
      primaryCta: { label: "Book Now", href: "/booking" },
      images: [],
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
      body: "Quick answers on booking, boarding, walks, and care — so you feel ready before you meet us.",
      primaryCta: { label: "Book Now", href: "/booking" },
      secondaryCta: { label: "Contact Us", href: "/contact" },
      images: [],
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
      eyebrow: "The Paw Journal",
      title: "Helpful notes for #petparents and #petpeople",
      body: "Short logs from our care days — boarding tips, walk routines, and calm stories from pet parents across the GTA.",
      primaryCta: { label: "Read Guides", href: "#posts" },
      images: [],
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
      primaryCta: { label: "Book Now", href: "#booking-form" },
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
      title: "#PetPeople your Pet feels comfortable with.",
      body: "Certified and Experienced Professionals caring for you Pet with Insurance and Care across GTA.",
      primaryCta: { label: "Meet Us", href: "#team" },
      images: [],
    },
    blocks: [],
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
      images: [],
    },
    blocks: [],
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
    slug: "policy",
    title: "Policy and Community",
    navTitle: "Policy",
    seoTitle: "Policy and Community | DTdogs.ca",
    metaDescription: "DTdogs.ca privacy policy, terms and conditions, and cancellation policy.",
    hero: {
      eyebrow: "Policy",
      title: "Policy and Community",
      body: "Everything you need to know about privacy, terms of service, and cancellations at DTdogs.ca.",
      images: [],
    },
    blocks: [
      {
        type: "story",
        eyebrow: "Privacy Policy",
        title: "Your privacy matters to us.",
        body: "DTdogs.ca collects booking, contact and pet-care details to respond to inquiries and provide services. We do not sell or share your personal information with third parties. All data is stored securely and used solely to deliver our pet-care services. Replace this draft with approved legal wording before launch.",
        images: [img("policy-care"), img("trust-full"), img("pet-visit"), img("facility"), img("contact-dog")],
      },
      {
        type: "story",
        eyebrow: "Terms and Conditions",
        title: "Service terms, clearly stated.",
        body: "By booking with DTdogs.ca, you agree to our service terms. This includes service availability, eligibility, health requirements for pets, emergency authorization, and liability. All services are subject to a confirmed booking. Terms should be finalized with approved business language before launch.",
        images: [img("policy-care"), img("boarding-home"), img("walk-toronto"), img("booking-bg"), img("facility")],
      },
      {
        type: "story",
        eyebrow: "Cancellation Policy",
        title: "Flexible and fair cancellations.",
        body: "Advance notice is required for all cancellations. Exact notice periods and any applicable charges will be updated once confirmed. For questions about cancellations, please reach out via WhatsApp or email at connect@dtdogs.ca.",
        images: [img("policy-care"), img("trust-full"), img("walk-toronto"), img("boarding-home"), img("contact-dog")],
      },
    ],
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
      eyebrow: "Care designed around calm, trust and connection",
      title: "Professional pet care with warmth, structure and real attention.",
      body: "Since 2021, DTdogs.ca has served pet families across the Greater Toronto Area through consistent, nurturing care. Our vision is simple: structured, professional services in a calm environment — with honest communication so every pet parent can leave with confidence.",
      primaryCta: { label: "Book Now", href: "/booking" },
      secondaryCta: { label: "Book Care", href: "/booking" },
      images: [img("about-founder"), img("facility"), img("toronto-lifestyle"), img("pet-visit"), img("trust-full")],
    },
    blocks: [
      {
        type: "story",
        eyebrow: "Our Story",
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
        type: "story",
        eyebrow: "Our Vision",
        title: "Dependable care, clean routines and reliable communication.",
        body: "We envision a safer, structured rhythm for pets and their people — structured services, honest updates, and home-style comfort that pet parents can trust while they are away.",
        images: [img("trust-full"), img("facility"), img("pet-visit"), img("booking-bg"), img("contact-dog")],
      },
    ],
  },
  {
    slug: "gift-cards",
    title: "Gift Cards",
    navTitle: "Gift Cards",
    seoTitle: "DTdogs.ca Gift Cards | CAD $150 Digital Gifts",
    metaDescription: "Purchase DTdogs.ca digital gift cards at CAD $150 — buy as many as you need.",
    hero: {
      eyebrow: "A thoughtful gift for pet parents",
      title: "Digital gift cards for calm, professional pet care.",
      body: "One price point: CAD $150. Buy multiple gift cards in a single request. Online payment must be configured before live checkout.",
      primaryCta: { label: "Start Gift Card", href: "#gift-card-form" },
      secondaryCta: { label: "Contact Us", href: "/contact" },
      images: [img("policy-care"), img("shop-mom"), img("shop-dad"), img("booking-bg"), img("floating-pup")],
    },
    blocks: [
      { type: "shop", title: "Gift card purchase flow", body: "Recipient name, recipient email, sender name, message, delivery date and payment status are editable in the CMS.", images: [img("policy-care"), img("booking-bg"), img("contact-dog"), img("floating-pup"), img("trust-full")] },
    ],
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
  TeamMember: () => getModel<TeamMember>("TeamMember", new Schema<TeamMember>({ slug: { type: String, unique: true }, name: String, role: String, bio: String, credentials: [String], image: imageSchema, instagram: String, status: String }, { timestamps: true })),
  Testimonial: () => getModel<Testimonial>("Testimonial", new Schema<Testimonial>({ slug: { type: String, unique: true }, reviewer: String, petName: String, service: String, rating: Number, quote: String, location: String, image: imageSchema, status: String, sample: Boolean }, { timestamps: true })),
  Faq: () => getModel<Faq>("Faq", new Schema<Faq>({ slug: { type: String, unique: true }, question: String, answer: String, category: String, serviceSlug: String, status: String, order: Number }, { timestamps: true })),
  Booking: () => getModel<BookingRequest>("Booking", new Schema<BookingRequest>({ customerName: String, fullName: String, email: String, phone: String, address: String, preferredContact: String, service: String, packageSelection: String, addonSelected: Boolean, estimatedTotal: String, preferredDate: String, preferredTime: String, pickupTime: String, dropoffTime: String, shuttleRequested: String, petName: String, petType: String, breed: String, age: String, weight: String, sex: String, spayNeuterStatus: String, temperament: String, specialNeeds: String, vaccinationStatus: String, medicalDetails: String, allergies: String, feedingInstructions: String, emergencyContact: String, veterinarian: String, behaviouralNotes: String, vaccinationUploadNote: String, giftCardCode: String, paymentNote: String, notes: String, policyAgreement: Boolean, paymentStatus: String, status: { type: String, default: "New" }, adminNotes: String }, { timestamps: true })),
  GiftCardOrder: () => getModel<GiftCardOrder>("GiftCardOrder", new Schema<GiftCardOrder>({ denomination: String, quantity: { type: Number, default: 1 }, recipientName: String, recipientEmail: String, senderName: String, senderEmail: String, message: String, deliveryDate: String, paymentStatus: { type: String, default: "Payment Pending" }, status: { type: String, default: "New" } }, { timestamps: true })),
  AdminUser: () => getModel<{ email: string; passwordHash: string; role: string }>("AdminUser", new Schema({ email: { type: String, unique: true }, passwordHash: String, role: { type: String, default: "Owner/Admin" } }, { timestamps: true })),
};

export const collectionDefaults = {
  pages,
  services,
  media: [
    ...mediaLibrary,
    ...galleryImages.filter((image) => image.id.startsWith("gallery-slot-")),
    ...treatImages,
  ],
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
  // Always use seed data for these pages to avoid stale DB content
  const seedOnlySlugs = ["policy", "gift-cards", "treats", "contact"];
  if (seedOnlySlugs.includes(slug)) {
    return pages.find((page) => page.slug === slug && page.status !== "draft");
  }
  const allPages = await getCollection<PageContent>("pages", pages);
  return allPages.find((page) => page.slug === slug && page.status !== "draft") ?? pages.find((page) => page.slug === slug && page.status !== "draft");
}

export async function getServices() {
  // Fetch from MongoDB, fallback to seed data if DB not available
  return await getCollection<Service>("services", services.filter((service) => service.status !== "draft"));
}

export async function getTeamMembers() {
  // Fetch from MongoDB, fallback to seed data if DB not available
  return await getCollection<TeamMember>("team", team.filter((member) => member.status !== "draft"));
}

export async function getFaqs() {
  // Fetch from MongoDB, fallback to seed data if DB not available
  return await getCollection<Faq>("faqs", faqs.filter((faq) => faq.status !== "draft"));
}

export async function getProducts() {
  // Fetch from MongoDB, fallback to seed data if DB not available
  return await getCollection<Product>("products", products.filter((product) => product.status !== "draft"));
}

export async function getTestimonials() {
  // Fetch from MongoDB, fallback to seed data if DB not available
  return await getCollection<Testimonial>("testimonials", testimonials.filter((item) => item.status !== "draft" && !item.sample));
}

export async function getGalleryImages() {
  // Public gallery always uses the confirmed named + categorized image set.
  return galleryImages.filter((image) => image.status !== "draft");
}

export async function getTreatImages() {
  // Public treats page always uses the confirmed treat image set.
  return treatImages;
}

export async function getService(slug: string) {
  const all = await getServices();
  return all.find((service) => service.slug === slug && service.status !== "draft");
}

async function syncCollectionItems(collection: CollectionName, items: Record<string, unknown>[], replaceAll = true) {
  const db = await connectMongo();
  if (!db) return false;

  const ModelCtor = collectionModelMap[collection]() as unknown as Model<Record<string, unknown>>;
  if (replaceAll) await ModelCtor.deleteMany({});
  for (const item of items) {
    const key = item.slug ? { slug: item.slug } : { id: item.id };
    await ModelCtor.updateOne(key, { $set: item }, { upsert: true });
  }
  return true;
}

export async function syncServices() {
  await syncCollectionItems("services", services as unknown as Record<string, unknown>[]);
  return getServices();
}

export async function syncFaqs() {
  await syncCollectionItems("faqs", faqs as unknown as Record<string, unknown>[]);
  return getFaqs();
}

export async function syncProducts() {
  await syncCollectionItems("products", products as unknown as Record<string, unknown>[]);
  return getProducts();
}

export async function syncTeam() {
  await syncCollectionItems("team", team as unknown as Record<string, unknown>[]);
  return getTeamMembers();
}

export async function syncAllContent() {
  const db = await connectMongo();
  if (!db) throw new Error("MONGODB_URI is required to sync content.");

  const replaceCollections: CollectionName[] = ["services", "pricing", "faqs", "products", "team", "blog", "pages"];
  for (const collection of replaceCollections) {
    const data = collectionDefaults[collection] as Record<string, unknown>[];
    await syncCollectionItems(collection, data);
  }
}

export async function syncPricingPackages() {
  await syncCollectionItems("pricing", pricingPackages as unknown as Record<string, unknown>[]);
  return pricingPackages.filter((item) => item.status !== "hidden");
}

/** Public pricing always uses the confirmed daycare/boarding package list. */
export async function getPricingPackages(): Promise<PricingPackage[]> {
  // Fetch from MongoDB, fallback to seed data if DB not available
  return await getCollection<PricingPackage>("pricing", pricingPackages.filter((item) => item.status !== "hidden"));
}

export async function seedDatabase() {
  await syncAllContent();

  const db = await connectMongo();
  if (!db) throw new Error("MONGODB_URI is required to seed the database.");

  const mergeCollections: CollectionName[] = ["media", "testimonials"];
  for (const collection of mergeCollections) {
    const data = collectionDefaults[collection] as Record<string, unknown>[];
    await syncCollectionItems(collection, data, false);
  }
}

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
  status?: "published" | "draft";
  priceLabel?: string;
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
  status: "published" | "draft" | "inquiry";
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
  phone: "+1 (437) 937-5112",
  email: "connect@dtdogs.ca",
  hours: "Monday-Sunday, 7:00 AM-7:00 PM",
  boardingNote: "Boarding available 24/7 according to city bylaws and confirmed booking arrangements.",
  locations: [
    "218 Queen Street East, Toronto, ON M5A 1S3",
    "Floor 15, 65 High Park Avenue, Toronto, ON M6P 2R7",
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

const imageBase = "https://images.unsplash.com";

export const mediaLibrary: ImageAsset[] = [
  {
    id: "hero-caregiver",
    title: "Calm dog with caregiver",
    alt: "Calm dog sitting beside a caring handler in warm natural light",
    caption: "Structured, nurturing care across the Greater Toronto Area.",
    url: `${imageBase}/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=1800&q=82`,
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
    url: `${imageBase}/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=82`,
    width: 1200,
    height: 1500,
    page: "home",
    tags: ["portrait"],
    status: "published",
  },
  {
    id: "walk-toronto",
    title: "Neighbourhood dog walk",
    alt: "Dog enjoying a structured neighbourhood walk in Toronto",
    url: `${imageBase}/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1400&q=82`,
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
    url: `${imageBase}/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1400&q=82`,
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
    url: `${imageBase}/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1400&q=82`,
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
    url: `${imageBase}/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1400&q=82`,
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
    url: `${imageBase}/photo-1601979031925-424e53b6caaa?auto=format&fit=crop&w=1400&q=82`,
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
    url: `${imageBase}/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1400&q=82`,
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
    url: `${imageBase}/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1400&q=82`,
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
    url: `${imageBase}/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1400&q=82`,
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
    url: `${imageBase}/photo-1551730459-92db2a308d6a?auto=format&fit=crop&w=1400&q=82`,
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
    url: `${imageBase}/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=82`,
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
    url: `${imageBase}/photo-1598134493136-7b63ebbd7b3b?auto=format&fit=crop&w=1400&q=82`,
    width: 1400,
    height: 1600,
    page: "about",
    tags: ["team"],
    status: "published",
  },
  {
    id: "facility",
    title: "Clean care environment",
    alt: "Bright clean care environment prepared for pet comfort",
    url: `${imageBase}/photo-1601758177266-bc599de87707?auto=format&fit=crop&w=1600&q=82`,
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
    url: `${imageBase}/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=1600&q=82`,
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
    url: `${imageBase}/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=1800&q=82`,
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
    url: `${imageBase}/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=82`,
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
    url: `${imageBase}/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1200&q=82`,
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
    url: `${imageBase}/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1200&q=82`,
    width: 1200,
    height: 1400,
    page: "shop",
    tags: ["product"],
    status: "published",
  },
  {
    id: "booking-bg",
    title: "Booking care moment",
    alt: "Calm dog-care moment used for booking call to action",
    url: `${imageBase}/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1800&q=82`,
    width: 1800,
    height: 1100,
    page: "booking",
    tags: ["booking"],
    status: "published",
  },
  {
    id: "contact-dog",
    title: "Friendly contact portrait",
    alt: "Friendly dog portrait inviting pet parents to contact DTdogs",
    url: `${imageBase}/photo-1568572933382-74d440642117?auto=format&fit=crop&w=1400&q=82`,
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
    url: `${imageBase}/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=1400&q=82`,
    width: 1400,
    height: 1000,
    page: "blog",
    tags: ["journal"],
    status: "published",
  },
  {
    id: "policy-care",
    title: "Care policy image",
    alt: "Leash and pet-care details arranged neatly on a warm surface",
    url: `${imageBase}/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1400&q=82`,
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
  ...mediaLibrary.map((image, index) => ({
    ...image,
    page: "gallery",
    tags: image.tags?.length ? image.tags : ["Happy Clients"],
    order: index + 1,
  })),
  ...Array.from({ length: 10 }).map((_, index) => {
    const source = mediaLibrary[index % mediaLibrary.length];
    const categories = ["Daycare", "Boarding", "Dog Walking", "Grooming", "Happy Clients", "Team", "Behind the Scenes", "Toronto Adventures", "Seasonal", "Apparel"];
    return {
      ...source,
      id: `gallery-slot-${index + 24}`,
      title: `${categories[index]} gallery slot`,
      alt: `Editable ${categories[index].toLowerCase()} gallery image slot for DTdogs`,
      caption: "Replace with approved client photography in the media library.",
      page: "gallery",
      tags: [categories[index]],
      order: index + 24,
      status: "published" as const,
    };
  }),
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

export const services: Service[] = [
  {
    slug: "dog-walking",
    name: "Dog Walking",
    eyebrow: "Structured daily movement",
    summary: "Safe, structured walks tailored to your pet's energy, personality and routine.",
    description:
      "Our dog walking service supports healthy routines with calm handling, attentive safety checks and movement matched to your dog's temperament and energy.",
    forWhom: "Ideal for busy pet parents, active dogs, puppies building routines and dogs who benefit from predictable daily exercise.",
    benefits: ["Energy-aware walks", "Routine updates", "Secure handling", "Water and comfort checks"],
    includes: ["Individual or compatible small-group options", "Pace suited to the dog", "Arrival and completion update", "Basic safety monitoring"],
    process: ["Share your dog's routine", "Confirm timing and walking style", "We complete the walk safely", "You receive a care update"],
    faqs: [
      { question: "Will my dog be walked during the day?", answer: "Regular walks are incorporated according to the service booked, the dog's needs and safe operating conditions." },
      { question: "Do you offer group walks?", answer: "Compatible small-group options may be available after behaviour and comfort are assessed." },
    ],
    related: ["pet-visits", "daycare", "pet-chauffeur"],
    images: [img("walk-toronto"), img("floating-pup"), img("toronto-lifestyle"), img("trust-full"), img("booking-bg")],
    featured: true,
    priceLabel: "Contact for current pricing",
  },
  {
    slug: "pet-visits",
    name: "Pet Visits",
    eyebrow: "Familiar-home comfort",
    summary: "Reliable, personalized in-home care that keeps pets safe, comfortable and happy while you are away.",
    description:
      "Pet visits give your pet companionship, food, water and care checks without changing their familiar environment.",
    forWhom: "Best for pets who prefer home, senior pets, cats and dogs needing short care visits during the day.",
    benefits: ["Familiar surroundings", "Personalized routine", "Comfort check-ins", "Written instructions followed"],
    includes: ["Feeding and water", "Play and companionship", "Medication according to written instructions", "Visit update"],
    process: ["Complete pet details", "Confirm visit needs", "We follow the care routine", "You receive an update"],
    faqs: [{ question: "Can you support medical needs?", answer: "Selected needs may be accommodated when written instructions and emergency details are accepted in advance." }],
    related: ["house-sitting", "dog-walking", "pet-chauffeur"],
    images: [img("pet-visit"), img("house-sitting"), img("facility"), img("testimonial-pet"), img("contact-dog")],
    featured: true,
    priceLabel: "Request Pricing",
  },
  {
    slug: "house-sitting",
    name: "House Sitting",
    eyebrow: "Care where pets feel safest",
    summary: "Calm, consistent and attentive care in the comfort of home.",
    description:
      "House sitting keeps pets surrounded by familiar comforts while receiving attentive, structured care and routine continuity.",
    forWhom: "For pets who do best at home, multi-pet households and owners who want care continuity while away.",
    benefits: ["Home routine continuity", "Reduced stress", "Attentive updates", "Personalized care"],
    includes: ["Feeding and walks", "Routine continuity", "Home and pet updates", "Overnight presence where booked"],
    process: ["Tell us about home routines", "Confirm schedule", "Care is delivered in-home", "Receive regular updates"],
    faqs: [{ question: "Do you provide overnight care?", answer: "Overnight presence may be available where booked and confirmed in advance." }],
    related: ["pet-visits", "boarding", "dog-walking"],
    images: [img("house-sitting"), img("facility"), img("about-founder"), img("trust-full"), img("booking-bg")],
    featured: true,
    priceLabel: "Contact for a custom quote",
  },
  {
    slug: "daycare",
    name: "Dog Daycare",
    eyebrow: "Supervised social rhythm",
    summary: "Structured social time and attentive care from an experienced team working with diverse breeds across the GTA.",
    description:
      "Daycare balances supervised activity, decompression and hydration in controlled groups that support safer, calmer social time.",
    forWhom: "For social dogs who benefit from supervised activity, controlled group time and a predictable daily care setting.",
    benefits: ["Controlled capacity", "Behaviour-aware grouping", "Hydration monitoring", "Rest and play balance"],
    includes: ["Supervised social time", "Rest periods", "Water checks", "Owner updates"],
    process: ["Complete intake", "Assess group comfort", "Confirm daycare schedule", "Enjoy structured care"],
    faqs: [{ question: "Can unneutered dogs attend?", answer: "Eligibility depends on age, behaviour and the service environment. Group restrictions may apply." }],
    related: ["boarding", "dog-walking", "grooming"],
    images: [img("daycare-play"), img("facility"), img("floating-pup"), img("trust-full"), img("walk-toronto")],
    featured: true,
    priceLabel: "Contact for current pricing",
  },
  {
    slug: "boarding",
    name: "Dog Boarding",
    eyebrow: "Overnight comfort",
    summary: "Safe, structured day-and-night care with our trusted paw pack while you are away.",
    description:
      "Boarding offers home-style overnight care with regular routines, supervision and calm comfort for dogs staying away from home.",
    forWhom: "For travel, long work commitments and families needing supervised overnight care.",
    benefits: ["Day-and-night supervision", "Home-style comfort", "Regular walks and play", "Owner-supplied food encouraged"],
    includes: ["Structured day routine", "Overnight care", "Regular activity", "Updates for pet parents"],
    process: ["Request dates", "Complete intake", "Confirm availability", "Board with structured care"],
    faqs: [{ question: "Do you provide overnight boarding?", answer: "Yes. Safe, comfortable overnight boarding is available with structured routines and supervision." }],
    related: ["daycare", "house-sitting", "pet-chauffeur"],
    images: [img("boarding-home"), img("daycare-play"), img("facility"), img("testimonial-pet"), img("booking-bg")],
    featured: true,
    priceLabel: "Contact for current pricing",
  },
  {
    slug: "pet-chauffeur",
    name: "Pet Chauffeur",
    eyebrow: "Premium GTA transport",
    summary: "Premium pickup and drop-off across the GTA for daycare, grooming, veterinary and home-care needs.",
    description:
      "The pet chauffeur service helps pet parents coordinate safe transport with secure handling, sanitized vehicles and trained care.",
    forWhom: "For busy owners who need safe pet transport across the Greater Toronto Area.",
    benefits: ["Secure harness or crate systems", "Sanitized vehicle", "Scheduled routes", "Trained handler"],
    includes: ["One-way or round-trip options", "Pickup and drop-off coordination", "Route timing", "Transport safety checks"],
    process: ["Request a ride", "Share destination and pet details", "Confirm route and timing", "Receive transport update"],
    faqs: [{ question: "How is chauffeur pricing calculated?", answer: "Pricing depends on distance, route timing, one-way or round-trip service and special requirements." }],
    related: ["daycare", "grooming", "pet-visits"],
    images: [img("chauffeur"), img("toronto-lifestyle"), img("floating-pup"), img("contact-dog"), img("booking-bg")],
    priceLabel: "Request a custom quote",
  },
  {
    slug: "guided-excursions",
    name: "Guided Excursions",
    eyebrow: "Enrichment with intention",
    summary: "Enriching outdoor experiences planned around safety, ability, weather and owner authorization.",
    description:
      "Guided excursions create memorable, safe outdoor enrichment for pets when route, weather and ability align.",
    forWhom: "For pets who enjoy structured outdoor enrichment and have owner approval for off-site adventures.",
    benefits: ["Weather planning", "Capacity controls", "Safe route selection", "Enrichment-focused care"],
    includes: ["Guided outdoor time", "Handler supervision", "Route planning", "Owner authorization"],
    process: ["Discuss your pet's ability", "Confirm destination and permissions", "Complete the excursion", "Share updates"],
    faqs: [{ question: "How far do excursions travel?", answer: "Routes are planned around safety, service area, weather and confirmed booking arrangements." }],
    related: ["dog-walking", "pet-chauffeur", "daycare"],
    images: [img("excursion"), img("walk-toronto"), img("toronto-lifestyle"), img("trust-full"), img("booking-bg")],
    priceLabel: "Contact for availability",
  },
  {
    slug: "grooming",
    name: "Dog Grooming",
    eyebrow: "Elegant practical care",
    summary: "Professional grooming to help dogs look and feel their best.",
    description:
      "Grooming supports coat comfort, hygiene and confidence. Scope and pricing should be confirmed based on breed, coat condition and care needs.",
    forWhom: "For dogs needing coat maintenance, hygiene support or a polished refresh.",
    benefits: ["Consultation-led scope", "Coat comfort", "Hygiene support", "Calm handling"],
    includes: ["Service scope confirmed in CMS", "Breed and coat consultation", "Careful handling", "After-care guidance where appropriate"],
    process: ["Request grooming", "Share coat details", "Confirm service scope", "Receive appointment care"],
    faqs: [{ question: "Are grooming prices fixed?", answer: "Pricing should be confirmed after coat condition, breed needs and service scope are reviewed." }],
    related: ["nail-trimming", "pet-chauffeur", "daycare"],
    images: [img("grooming"), img("nails"), img("facility"), img("testimonial-pet"), img("booking-bg")],
    featured: true,
    priceLabel: "Request Pricing",
  },
  {
    slug: "nail-trimming",
    name: "Nail Trimming",
    eyebrow: "Gentle paw care",
    summary: "Routine nail care delivered calmly and carefully.",
    description:
      "Nail trimming provides focused paw care with calm handling, appointment-based timing and after-care guidance.",
    forWhom: "For dogs who need routine paw maintenance and gentle appointment-based handling.",
    benefits: ["Calm handling", "Focused appointment", "Comfort-first approach", "After-care guidance"],
    includes: ["Handling assessment", "Routine nail care", "Comfort breaks if needed", "Owner guidance"],
    process: ["Request appointment", "Share handling notes", "Complete nail trim", "Review next care timing"],
    faqs: [{ question: "Can nervous dogs book nail care?", answer: "Handling comfort is assessed first so care can remain calm and safe." }],
    related: ["grooming", "daycare", "pet-chauffeur"],
    images: [img("nails"), img("grooming"), img("floating-pup"), img("facility"), img("booking-bg")],
    priceLabel: "Contact for current pricing",
  },
  {
    slug: "training",
    name: "Training & Classes",
    eyebrow: "Behaviour-informed learning",
    summary: "Selected behaviour-informed learning experiences, pending confirmed class formats and credentials.",
    description:
      "This service should remain draft until the client confirms class types, qualifications, formats, pricing and policies.",
    forWhom: "For pet parents seeking structured behavioural support once final offerings are confirmed.",
    benefits: ["Behaviour-informed", "Format to be confirmed", "Credential-aware publishing", "Editable CMS status"],
    includes: ["Draft service page", "Client confirmation required", "Editable FAQs", "Booking inquiry path"],
    process: ["Confirm offering", "Add format and pricing", "Publish page", "Accept inquiries"],
    faqs: [{ question: "Is this service available now?", answer: "Availability and exact class details should be confirmed by DTdogs before publishing." }],
    related: ["daycare", "dog-walking", "pet-visits"],
    images: [img("training"), img("walk-toronto"), img("floating-pup"), img("trust-full"), img("booking-bg")],
    status: "draft",
    priceLabel: "Details to be confirmed",
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
    "What is the Prudential Paws Shuttle Service?",
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

export const pricingPackages: PricingPackage[] = services.map((service) => ({
  slug: service.slug,
  service: service.name,
  name: `${service.name} care request`,
  priceLabel: service.priceLabel ?? "Contact for current pricing",
  duration: "Custom duration",
  features: service.includes.slice(0, 4),
  featured: service.featured,
  status: service.status === "draft" ? "hidden" : "published",
}));

export const testimonials: Testimonial[] = [
  {
    slug: "sample-review-replace",
    reviewer: "Sample content",
    petName: "Replace in CMS",
    service: "Boarding",
    rating: 5,
    quote: "Sample testimonial placeholder. Replace this with an approved client review before launch.",
    location: "Greater Toronto Area",
    image: img("testimonial-pet"),
    status: "draft",
    sample: true,
  },
];

export const team: TeamMember[] = [
  {
    slug: "sunny",
    name: "Sunny",
    role: "Team profile pending approval",
    bio: "Editable placeholder: biography and credentials pending client approval.",
    credentials: ["To be confirmed"],
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
    images: [img("policy-care"), img("booking-bg"), img("floating-pup"), img("contact-dog"), img("shop-mom")],
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
    images: [img("policy-care"), img("booking-bg"), img("floating-pup"), img("contact-dog"), img("shop-dad")],
    sizes: ["Digital delivery"],
    colors: ["Gift card"],
    inventory: 999,
  },
  {
    slug: "dog-mom-long-sleeve-shirt",
    title: "Dog Mom Long-Sleeve Shirt",
    description: "A warm lifestyle apparel item for proud dog moms. Product details, price, sizing and final images are editable in the CMS.",
    priceLabel: "Price to be confirmed",
    status: "inquiry",
    images: [img("shop-mom"), img("floating-pup"), img("policy-care"), img("shop-dad"), img("booking-bg")],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Forest", "Black"],
    inventory: 0,
  },
  {
    slug: "dog-dad-long-sleeve-shirt",
    title: "Dog Dad Long-Sleeve Shirt",
    description: "A premium casual long-sleeve for dog dads. Product details, price, sizing and final images are editable in the CMS.",
    priceLabel: "Price to be confirmed",
    status: "inquiry",
    images: [img("shop-dad"), img("floating-pup"), img("policy-care"), img("shop-mom"), img("contact-dog")],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Forest", "Black"],
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
        images: [img("about-founder"), img("facility"), img("pet-visit")],
      },
      {
        type: "cards",
        eyebrow: "What guides us",
        title: "Safety before speed, calm before chaos.",
        items: [
          { title: "Structured routines", body: "Pets thrive when care is predictable, attentive and tailored to individual personality.", image: img("trust-full") },
          { title: "Honest communication", body: "Clear updates help pet parents feel connected while away.", image: img("contact-dog") },
          { title: "Clean environments", body: "Food safety, hygiene and comfort are treated as core care standards.", image: img("facility") },
        ],
      },
      {
        type: "cta",
        title: "Brand relationship to confirm",
        body: "The current website alternates between DTdogs.ca and Hand & Paw. This placeholder should be replaced with the approved relationship statement before launch.",
        images: [img("floating-pup"), img("booking-bg")],
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
    seoTitle: "DTdogs.ca Pricing | Request Premium Pet Care Quotes",
    metaDescription: "Request current pricing for DTdogs.ca pet care services across the Greater Toronto Area. Confirmed pricing is editable in the CMS.",
    hero: {
      eyebrow: "Clear care options, tailored to your pet",
      title: "Pricing stays honest: confirmed rates only, custom quotes when needed.",
      body: "Where current pricing is not confirmed, the website shows request-pricing language instead of inventing numbers.",
      primaryCta: { label: "Request Pricing", href: "/booking" },
      secondaryCta: { label: "Contact Us", href: "/contact" },
      images: [img("policy-care"), img("grooming"), img("boarding-home"), img("chauffeur"), img("booking-bg")],
    },
    blocks: [{ type: "cards", title: "Editable pricing cards", body: "The admin can manage packages, features, duration, labels, featured state and publish status.", images: [img("walk-toronto"), img("daycare-play"), img("pet-visit"), img("house-sitting"), img("facility")] }],
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
      images: [img("daycare-play"), img("walk-toronto"), img("boarding-home"), img("grooming"), img("excursion")],
    },
    blocks: [{ type: "gallery", title: "Filterable masonry gallery", images: galleryImages }],
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
      eyebrow: "Tell us about your pet",
      title: "A polished request flow for calm, confident booking.",
      body: "Choose a service, preferred date and time, pet details, care instructions and policy agreement.",
      primaryCta: { label: "Start Request", href: "#booking-form" },
      images: [img("booking-bg"), img("floating-pup"), img("pet-visit"), img("policy-care"), img("contact-dog")],
    },
    blocks: [{ type: "process", title: "Choose service, share details, review and submit.", images: [img("walk-toronto"), img("boarding-home"), img("facility"), img("trust-full"), img("contact-dog")] }],
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
      title: "Warm lifestyle goods for the DTdogs clan.",
      body: "The initial shop supports two apparel items and up to 30 products, with image galleries, inventory and catalogue/inquiry mode.",
      primaryCta: { label: "Browse Products", href: "#products" },
      images: [img("shop-mom"), img("shop-dad"), img("floating-pup"), img("policy-care"), img("booking-bg")],
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
      eyebrow: "Calm care, joyful motion",
      title: "A safer, warmer rhythm for pets and their people.",
      body: "Editable vision page seeded from confirmed client direction. Replace placeholders only with approved source text.",
      primaryCta: { label: "Meet The Team", href: "/team" },
      secondaryCta: { label: "Book Care", href: "/booking" },
      images: [img("trust-full"), img("facility"), img("about-founder"), img("toronto-lifestyle"), img("pet-visit")],
    },
    blocks: [
      { type: "story", eyebrow: "Values", title: "Dependable care, clean routines and reliable communication.", body: "Editable placeholder: add final client-approved vision copy here.", images: [img("trust-full"), img("facility"), img("pet-visit"), img("booking-bg"), img("contact-dog")] },
      { type: "cards", eyebrow: "Team philosophy", title: "Emma, Sunny and Manu are listed as confirmed team names only.", body: "Biographies and credentials remain editable placeholders until approved.", images: [img("about-founder"), img("pet-visit"), img("facility"), img("toronto-lifestyle"), img("floating-pup")] },
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
  Service: () => getModel<Service>("Service", new Schema<Service>({ slug: { type: String, unique: true }, name: String, eyebrow: String, summary: String, description: String, forWhom: String, benefits: [String], includes: [String], process: [String], faqs: [Schema.Types.Mixed], related: [String], images: [imageSchema], featured: Boolean, status: String, priceLabel: String }, { timestamps: true })),
  MediaAsset: () => getModel<ImageAsset>("MediaAsset", new Schema<ImageAsset>({ id: { type: String, unique: true }, title: String, alt: String, caption: String, url: String, mobileUrl: String, width: Number, height: Number, fileSize: Number, page: String, tags: [String], status: String, focalPoint: Schema.Types.Mixed, order: Number }, { timestamps: true })),
  PricingPackage: () => getModel<PricingPackage>("PricingPackage", new Schema<PricingPackage>({ slug: { type: String, unique: true }, service: String, name: String, priceLabel: String, duration: String, features: [String], featured: Boolean, status: String }, { timestamps: true })),
  BlogPost: () => getModel<BlogPost>("BlogPost", new Schema<BlogPost>({ slug: { type: String, unique: true }, title: String, excerpt: String, category: String, author: String, date: String, body: String, featuredImage: imageSchema, inlineImages: [imageSchema], status: String }, { timestamps: true })),
  Product: () => getModel<Product>("Product", new Schema<Product>({ slug: { type: String, unique: true }, title: String, description: String, priceLabel: String, status: String, images: [imageSchema], sizes: [String], colors: [String], inventory: Number }, { timestamps: true })),
  TeamMember: () => getModel<TeamMember>("TeamMember", new Schema<TeamMember>({ slug: { type: String, unique: true }, name: String, role: String, bio: String, credentials: [String], image: imageSchema, status: String }, { timestamps: true })),
  Testimonial: () => getModel<Testimonial>("Testimonial", new Schema<Testimonial>({ slug: { type: String, unique: true }, reviewer: String, petName: String, service: String, rating: Number, quote: String, location: String, image: imageSchema, status: String, sample: Boolean }, { timestamps: true })),
  Faq: () => getModel<Faq>("Faq", new Schema<Faq>({ slug: { type: String, unique: true }, question: String, answer: String, category: String, serviceSlug: String, status: String, order: Number }, { timestamps: true })),
  Booking: () => getModel<BookingRequest>("Booking", new Schema<BookingRequest>({ customerName: String, fullName: String, email: String, phone: String, address: String, preferredContact: String, service: String, packageSelection: String, preferredDate: String, preferredTime: String, pickupTime: String, dropoffTime: String, shuttleRequested: String, petName: String, petType: String, breed: String, age: String, weight: String, sex: String, spayNeuterStatus: String, temperament: String, specialNeeds: String, vaccinationStatus: String, medicalDetails: String, allergies: String, feedingInstructions: String, emergencyContact: String, veterinarian: String, behaviouralNotes: String, vaccinationUploadNote: String, giftCardCode: String, paymentNote: String, notes: String, policyAgreement: Boolean, paymentStatus: String, status: { type: String, default: "New" }, adminNotes: String }, { timestamps: true })),
  GiftCardOrder: () => getModel<GiftCardOrder>("GiftCardOrder", new Schema<GiftCardOrder>({ denomination: String, recipientName: String, recipientEmail: String, senderName: String, senderEmail: String, message: String, deliveryDate: String, paymentStatus: { type: String, default: "Payment Pending" }, status: { type: String, default: "New" } }, { timestamps: true })),
  AdminUser: () => getModel<{ email: string; passwordHash: string; role: string }>("AdminUser", new Schema({ email: { type: String, unique: true }, passwordHash: String, role: { type: String, default: "Owner/Admin" } }, { timestamps: true })),
};

export const collectionDefaults = {
  pages,
  services,
  media: galleryImages,
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
  const allServices = await getCollection<Service>("services", services);
  return allServices.filter((service) => service.status !== "draft");
}

export async function getService(slug: string) {
  const allServices = await getCollection<Service>("services", services);
  return allServices.find((service) => service.slug === slug);
}

export async function seedDatabase() {
  const db = await connectMongo();
  if (!db) throw new Error("MONGODB_URI is required to seed the database.");

  const entries = Object.entries(collectionDefaults) as [CollectionName, unknown[]][];
  for (const [collection, data] of entries) {
    const ModelCtor = collectionModelMap[collection]() as unknown as Model<Record<string, unknown>>;
    for (const item of data as Record<string, unknown>[]) {
      const key = item.slug ? { slug: item.slug } : { id: item.id };
      await ModelCtor.updateOne(key, { $set: item }, { upsert: true });
    }
  }
}

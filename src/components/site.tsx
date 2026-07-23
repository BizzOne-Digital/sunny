"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CalendarDays, Camera, Check, ChevronDown, Clock, Heart, Mail, MapPin, Menu, PawPrint, Phone, Play, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import type { BlogPost, Faq, ImageAsset, PageContent, PricingPackage, Product, Service, TeamMember, Testimonial } from "@/lib/site";

const serviceAddOn = {
  name: "Add-On",
  duration: "10 minutes",
  priceLabel: "$5",
  priceAmount: 5,
  description: "An optional ten-minute add-on that can be included with an eligible pet-care service.",
};

function parseServicePrice(label?: string) {
  if (!label) return null;
  if (/free/i.test(label)) return 0;
  const match = label.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function formatMoney(amount: number) {
  return `$${amount.toLocaleString("en-CA", { minimumFractionDigits: amount % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
}

function getServiceBasePrice(service: Service | undefined, sizeLabel?: string) {
  if (!service) return null;
  if (sizeLabel && service.priceTiers?.length) {
    const tier = service.priceTiers.find((item) => item.label === sizeLabel);
    const tierPrice = parseServicePrice(tier?.priceLabel);
    if (tierPrice !== null) return tierPrice;
  }
  return parseServicePrice(service.priceLabel);
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const brand = {
  phone: "+1 (437) 937-5112",
  email: "connect@dtdogs.ca",
  hours: "Monday–Sunday, 7:00 AM–9:00 PM",
  boardingNote: "Boarding available 24/7 according to city bylaws and confirmed booking arrangements.",
  formerly: "Handandpaw.ca and Handandpaw.in",
  formerlyShort: "(formerly known as Handandpaw.ca / Handandpaw.in)",
  tagline: "Professional and structured pet care in Downtown Toronto, serving across the GTA in every season.",
  whatsapp: "https://wa.me/14379375112",
  payments: "Pay online, in store, Interac, Amex, or with a DTdogs.ca gift card after confirmation.",
  locations: ["Located in Downtown, Toronto"],
  lines: [
    "Serving across GTA",
    "Operating all season across GTA",
    "Located in Downtown, Toronto",
    "We are a team of #petpeople and #petparents",
  ],
};

const localImageUrls: Record<string, string> = {
  "hero-caregiver": "/images/home/hero-caregiver.webp",
  "hero-wave": "/images/home/hero-wave.png",
  "floating-pup": "/images/home/floating-pup.webp",
  "floating-pup-2": "/images/home/floating-pup-2.webp",
  "trust-full": "/images/home/trust-full.webp",
  logo: "/images/brand/logo.png",
  "walk-toronto": "/images/services/serviceswalk-toronto.webp",
  "boarding-home": "/images/services/servicesboarding-home.webp",
  "daycare-play": "/images/services/servicesdaycare-play.webp",
  "pet-visit": "/images/services/servicespet-visit.webp",
  "house-sitting": "/images/services/serviceshouse-sitting.webp",
  chauffeur: "/images/services/serviceschauffeur.webp",
  grooming: "/images/services/servicesgrooming.webp",
  nails: "/images/services/servicesnails.webp",
  training: "/images/services/servicestraining.webp",
  excursion: "/images/services/servicesexcursion.webp",
  "about-founder": "/images/about/about-founder.webp",
  "about-1": "/images/about/about-1.jpg",
  "about-2": "/images/about/about-2.png",
  "about-3": "/images/about/about-3.png",
  "structured-routines-card": "/images/about/Structured-Routines-Card.jpg",
  "honest-communication-card": "/images/about/Honest-Communication-Card.jpg",
  "clean-environments-card": "/images/about/Clean-Environments-Card.jpg",
  facility: "/images/about/facility.webp",
  "toronto-lifestyle": "/images/about/toronto-lifestyle.webp",
  "testimonial-pet": "/images/testimonial/testimonial-pet.webp",
  "shop-mom": "/images/shop/shop-mom.webp",
  "shop-dad": "/images/shop/shop-dad.webp",
  "shop-hero-1": "/images/shop/shop-1.png",
  "shop-hero-2": "/images/shop/shop-2.png",
  "gift-card-50-image": "/images/shop/gift50.png",
  "gift-card-100-image": "/images/shop/gift100.png",
  "booking-bg": "/images/booking/booking-bg.webp",
  "booking-bg-2": "/images/booking/booking-bg-2.webp",
  "contact-dog": "/images/contact/contact-dog.webp",
  "blog-cover": "/images/blog/blog-cover.webp",
  "policy-care": "/images/policy/policy-care.webp",
  "gallery-hero-1": "/images/gallery/gallery-1.png",
  "gallery-hero-2": "/images/gallery/gallery-2.png",
  "gallery-hero-3": "/images/gallery/gallery-3.png",
};

function galleryImageUrl(order?: number) {
  if (!order || order < 1 || order > 33) return undefined;
  return `/images/gallery/gallery-slot-${String(order).padStart(2, "0")}.webp`;
}

function treatImageUrl(order?: number) {
  const urls = ["/images/treats/treat-large.jpg", "/images/treats/treat-topright.jpg", "/images/treats/treat-bottomright.jpg"];
  if (!order || order < 1 || order > urls.length) return undefined;
  return urls[order - 1];
}

function localImageUrl(image: ImageAsset) {
  if (image.id.startsWith("gallery-slot-")) return galleryImageUrl(image.order) ?? localImageUrls[image.id] ?? image.url;
  if (image.page === "treats") return treatImageUrl(image.order) ?? localImageUrls[image.id] ?? image.url;
  return localImageUrls[image.id] ?? image.url;
}

function productImages(product: Product) {
  const giftCardImages: Record<string, ImageAsset> = {
    "gift-card-150": asset("gift-card-100-image", "DTdogs $150 gift card", "Premium DTdogs digital gift card product image for CAD $150", "/images/shop/gift100.png"),
  };
  const primary = giftCardImages[product.slug];
  return primary ? [primary, ...product.images.filter((image) => image.id !== primary.id)] : product.images;
}

const asset = (id: string, title: string, alt: string, url: string, page?: string, order?: number): ImageAsset => ({
  id,
  title,
  alt,
  url,
  width: 1600,
  height: 1100,
  page,
  order,
  status: "published",
});

const homePage = {
  heroImages: [
    asset("hero-caregiver", "Calm dog with caregiver", "Calm dog sitting beside a caring handler in warm natural light", "/images/home/hero-caregiver.webp"),
    asset("floating-pup", "Happy relaxed dog portrait", "Happy relaxed dog portrait against a warm interior background", "/images/home/floating-pup.webp"),
    asset("walk-toronto", "Neighbourhood dog walk", "Dog enjoying a structured neighbourhood walk in Toronto", "/images/services/serviceswalk-toronto.webp"),
    asset("boarding-home", "Home style boarding rest", "Dog resting comfortably in a clean home style boarding environment", "/images/services/servicesboarding-home.webp"),
    asset("daycare-play", "Supervised daycare play", "Dogs enjoying supervised social play in a bright daycare setting", "/images/services/servicesdaycare-play.webp"),
  ],
  storyImages: [
    asset("about-founder", "Founder care portrait", "Pet-care professional connecting with a calm dog", "/images/about/about-founder.webp"),
    asset("facility", "Clean care environment", "Bright clean care environment prepared for pet comfort", "/images/about/facility.webp"),
    asset("toronto-lifestyle", "Toronto pet lifestyle", "Dog and caregiver enjoying a Toronto neighbourhood setting", "/images/about/toronto-lifestyle.webp"),
    asset("pet-visit", "In-home pet visit", "Caregiver offering gentle attention during an in-home pet visit", "/images/services/servicespet-visit.webp"),
    asset("trust-full", "Trusted calm routine", "Dog relaxing during a calm supervised care routine", "/images/home/trust-full.webp"),
  ],
  galleryImages: Array.from({ length: 10 }, (_, index) =>
    asset(
      `gallery-slot-${String(index + 1).padStart(2, "0")}`,
      `Gallery slot ${index + 1}`,
      `DTdogs gallery image ${index + 1}`,
      `/images/gallery/gallery-slot-${String(index + 1).padStart(2, "0")}.webp`,
      "gallery",
      index + 1,
    ),
  ),
};

const aboutStoryImages = [
  asset("about-1", "Founder care portrait", "Pet-care professional sitting with a happy dog in a bright care space", "/images/about/about-1.jpg"),
  asset("about-2", "Clean care environment", "Bright clean dog-care environment with calm dogs resting", "/images/about/about-2.png"),
  asset("about-3", "Toronto pet lifestyle", "Dog handler walking a happy dog through a leafy neighbourhood", "/images/about/about-3.png"),
];

const aboutGuideItems = [
  {
    title: "Structured routines",
    body: "Pets thrive when care is predictable, attentive and tailored to individual personality.",
    image: asset("structured-routines-card", "Structured routines", "Calm dog receiving gentle structured care in a premium indoor setting", "/images/about/Structured-Routines-Card.jpg"),
  },
  {
    title: "Honest communication",
    body: "Clear updates help pet parents feel connected while away.",
    image: asset("honest-communication-card", "Honest communication", "Happy dog near a smartphone and care notebook for owner updates", "/images/about/Honest-Communication-Card.jpg"),
  },
  {
    title: "Clean environments",
    body: "Food safety, hygiene and comfort are treated as core care standards.",
    image: asset("clean-environments-card", "Clean environments", "Clean modern pet-care environment with a happy dog and caregiver", "/images/about/Clean-Environments-Card.jpg"),
  },
];

const aboutBrandImages = [
  asset("floating-pup-2", "Calm dog portrait", "Happy relaxed dog sitting calmly in a warm modern indoor space", "/images/home/floating-pup-2.webp"),
  asset("booking-bg-2", "Care planning moment", "Calm dog near a neatly arranged care checklist, leash and notebook", "/images/booking/booking-bg-2.webp"),
];

const galleryHeroImages = [
  asset("gallery-hero-1", "Courtyard dog walk", "Small happy dog walking calmly through a clean modern outdoor courtyard", "/images/gallery/gallery-1.png"),
  asset("gallery-hero-2", "Autumn leash walk", "Dog walking safely on leash through a warm autumn park trail", "/images/gallery/gallery-2.png"),
  asset("gallery-hero-3", "Indoor care moment", "Dogs calmly gathered in a cozy modern indoor care lounge", "/images/gallery/gallery-3.png"),
];

const shopHeroImages = [
  asset("shop-hero-1", "Dog Mom hero apparel", "Dog Mom apparel styled for the DTdogs shop hero", "/images/shop/shop-1.png"),
  asset("shop-hero-2", "Dog Dad hero apparel", "Dog Dad apparel styled for the DTdogs shop hero", "/images/shop/shop-2.png"),
  asset("floating-pup", "Happy relaxed dog portrait", "Happy relaxed dog portrait against a warm interior background", "/images/home/floating-pup.webp"),
];

const pageHeroImages: Record<string, ImageAsset> = {
  about: asset("about-generated-hero", "About DTdogs", "Caregiver sharing a calm moment with a dog in a modern Toronto home", "/images/about/about-hero.png"),
  services: asset("services-generated-hero", "DTdogs services", "Calm dog in a polished modern pet-care studio", "/images/services/services-hero.png"),
  pricing: asset("pricing-generated-hero", "Pet-care pricing", "Premium pet-care essentials arranged in an elegant editorial setting", "/images/pricing/pricing-hero.png"),
  gallery: asset("gallery-generated-hero", "DTdogs gallery", "Well-groomed dog enjoying a golden-hour Toronto courtyard walk", "/images/gallery/gallery-hero.png"),
  treats: asset("treats-generated-hero", "DTdogs treats", "Luxury artisanal dog treats styled on a modern cream surface", "/images/treats/treats-hero.png"),
  testimonials: asset("testimonials-generated-hero", "DTdogs testimonials", "Happy relaxed dog resting in a warm premium interior", "/images/testimonial/testimonials-hero.png"),
  faq: asset("faq-generated-hero", "Pet-care consultation", "Caregiver and pet parent discussing care with a calm dog", "/images/faq/faq-hero.png"),
  blog: asset("blog-generated-hero", "The Paw Journal", "Elegant pet-care journal and dog accessories in warm window light", "/images/blog/blog-hero.png"),
  booking: asset("booking-generated-hero", "Book DTdogs care", "Modern pet-care booking desk with a calm dog nearby", "/images/booking/booking-hero.png"),
  team: asset("team-generated-hero", "DTdogs care team", "Professional pet caregivers with a calm dog in a bright studio", "/images/team/team-hero.png"),
  contact: asset("contact-generated-hero", "Contact DTdogs", "Friendly caregiver welcoming a fluffy dog near a modern entrance", "/images/contact/contact-hero.png"),
  shop: asset("shop-generated-hero", "DTdogs shop", "Premium pet-parent apparel styled in a sunlit boutique setting", "/images/shop/shop-hero.png"),
  "gift-cards": asset("gift-cards-generated-hero", "DTdogs gift cards", "Elegant pet-care gift card presentation with forest green and peach accents", "/images/gifts/gift-cards-hero.png"),
  privacy: asset("privacy-generated-hero", "Privacy policy", "Quiet private pet-care room in soft natural light", "/images/policy/privacy-hero.png"),
  "privacy-policy": asset("privacy-generated-hero", "Privacy policy", "Quiet private pet-care room in soft natural light", "/images/policy/privacy-hero.png"),
  terms: asset("terms-generated-hero", "Terms and conditions", "Refined policy documents and pet-care details on a modern desk", "/images/policy/terms-hero.png"),
  "cancellation-policy": asset("cancellation-generated-hero", "Cancellation policy", "Calendar and pet-care essentials arranged in a calm planning scene", "/images/policy/cancellation-hero.png"),
  "refund-return-policy": asset("cancellation-generated-hero", "Refund and return policy", "Calendar and pet-care essentials arranged in a calm planning scene", "/images/policy/cancellation-hero.png"),
};

const serviceHeroImages: Record<string, ImageAsset> = {
  "dog-walking": asset("service-dog-walking-hero", "Dog Walking", "Dog being walked on a calm neighbourhood outing", "/images/services/service-dog-walking-1hr.png"),
  grooming: asset("service-grooming-hero", "Grooming", "Professional grooming photo of a freshly styled dog", "/images/services/service-dog-grooming.png"),
  daycare: asset("service-daycare-hero", "Daycare", "Dogs playing together in supervised daycare", "/images/services/service-half-daycare.png"),
  boarding: asset("service-boarding-hero", "Boarding", "Comfortable resting dogs in calm overnight care", "/images/services/service-boarding.png"),
  "nail-trim": asset("service-nail-trim-hero", "Nail Trim", "Gentle nail trimming image for tidy paws", "/images/services/service-bath-and-nails.png"),
  "behaviour-training": asset("service-behaviour-training-hero", "Behaviour Training", "Training interaction between caregiver and dog", "/images/services/service-training.png"),
  "pet-dental-cleaning": asset("service-pet-dental-cleaning-hero", "Pet Dental Cleaning", "Professional pet dental care and teeth brushing", "/images/services/pet-cleaning.png"),
};

function servicePrimaryImage(service: Service) {
  return serviceHeroImages[service.slug] ?? service.images[0];
}

function serviceDisplayImages(service: Service) {
  const hero = serviceHeroImages[service.slug];
  if (!hero) return service.images;
  return [hero, ...service.images.filter((image) => image.id !== hero.id && image.url !== hero.url)];
}

const homeSupportingImages = {
  story: asset("home-story-generated", "Our care story", "Caregiver walking a calm dog through a bright modern hallway", "/images/home/home-story.png"),
  whyA: asset("home-why-a-generated", "Comfort and hygiene", "Calm dog resting in a clean climate-controlled care room", "/images/home/home-why-a.png"),
  whyB: asset("home-why-b-generated", "Supervised safety", "Caregiver supervising a calm modern pet-care space", "/images/home/home-why-b.png"),
  gallery: asset("home-gallery-generated", "Outdoor enrichment", "Happy dog enjoying soft light in a leafy park", "/images/home/home-gallery-strip.png"),
  booking: asset("home-booking-generated", "Book calm care", "Relaxed dog on a cream sofa against a forest-green wall", "/images/home/home-booking-cta.png"),
};

const nav = [
  { label: "Home", href: "/" },
  { label: "Our Vision", href: "/our-vision" },
  { label: "Services", href: "/services" },
  { label: "Bundle", href: "/pricing" },
  { label: "Gallery", href: "/gallery" },
  { label: "Shop", href: "/shop" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Our Team", href: "/team" },
];

const LOGO_SRC = "/images/brand/logo.png";
const HERO_WAVE_SRC = "/images/home/hero-wave.png";
const FOOTER_BG_SRC = "/images/brand/footer-bg.png";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function imageProps(image: ImageAsset, sizes = "(min-width: 1024px) 50vw, 100vw") {
  return {
    src: localImageUrl(image),
    alt: image.alt,
    width: image.width ?? 1400,
    height: image.height ?? 1000,
    sizes,
  };
}

export function SiteChrome({ children, services }: { children: React.ReactNode; services: Service[] }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <main className="min-h-screen bg-cream text-ink">{children}</main>;
  }

  return (
    <>
      <IntroWrapper />
      <Navigation services={services} />
      <PageTransition />
      <main className="min-h-screen overflow-x-clip bg-cream text-ink">{children}</main>
      <Footer services={services} />
    </>
  );
}

function IntroWrapper() {
  const [visible, setVisible] = useState(true);
  const [playIntro, setPlayIntro] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setLogoReady(true);
    img.onerror = () => setLogoReady(false);
    img.src = LOGO_SRC;
  }, []);

  useEffect(() => {
    if (reducedMotion || sessionStorage.getItem("dtdogs_intro_seen")) {
      setVisible(false);
      window.dispatchEvent(new Event("dtdogs-intro-done"));
      return;
    }

    setPlayIntro(true);
    document.documentElement.style.overflow = "hidden";

    const hideTimer = window.setTimeout(() => {
      sessionStorage.setItem("dtdogs_intro_seen", "true");
      setVisible(false);
      document.documentElement.style.overflow = "";
      window.dispatchEvent(new Event("dtdogs-intro-done"));
    }, 3400);

    return () => {
      window.clearTimeout(hideTimer);
      document.documentElement.style.overflow = "";
    };
  }, [reducedMotion]);

  const skip = () => {
    sessionStorage.setItem("dtdogs_intro_seen", "true");
    setVisible(false);
    document.documentElement.style.overflow = "";
    window.dispatchEvent(new Event("dtdogs-intro-done"));
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="bg-gradient-animated fixed inset-0 z-[100] grid place-items-center overflow-hidden text-white"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] } }}
        >
          {playIntro ? (
            <>
              <button onClick={skip} className="absolute right-5 top-5 z-10 rounded-full border border-white/30 px-4 py-2 text-sm transition hover:border-coral hover:bg-coral/20">
                Skip
              </button>
              <motion.div
                className="absolute -left-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-coral/40 to-burgundy/25 blur-3xl"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.4, 1.1, 1], opacity: 1 }}
                transition={{ duration: 2 }}
              />
              <motion.div
                className="absolute -bottom-40 -right-24 h-[38rem] w-[38rem] rounded-full bg-gradient-to-tl from-forest/60 to-coral/30 blur-3xl"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.6, delay: 0.2 }}
              />
              <motion.div
                className="relative flex flex-col items-center gap-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -12, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                  className="relative"
                >
                  {logoReady ? (
                    <Image
                      src={LOGO_SRC}
                      alt="DT Dogs at Hand & Paw"
                      width={320}
                      height={110}
                      className="h-20 w-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:h-24 md:h-28"
                      priority
                    />
                  ) : (
                    <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-coral to-burgundy shadow-2xl shadow-coral/40">
                      <PawPrint className="h-10 w-10 text-white" />
                    </span>
                  )}
                </motion.div>
                <div>
                  <motion.p
                    className="text-xs font-medium tracking-wide text-peach sm:text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                  >
                    DTdogs.ca {brand.formerlyShort}
                  </motion.p>
                  <h1 className="mt-3 font-serif text-4xl italic sm:text-5xl md:text-8xl">
                    {"Care begins with trust.".split(" ").map((word, index) => (
                      <motion.span
                        key={`${word}-${index}`}
                        className={cx("inline-block whitespace-pre", index >= 3 && "text-gradient")}
                        initial={{ opacity: 0, y: 40, rotateX: 60 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {word}{" "}
                      </motion.span>
                    ))}
                  </h1>
                </div>
                  <motion.div
                  className="h-1 w-[min(18rem,72vw)] origin-left rounded-full bg-gradient-to-r from-coral via-peach to-burgundy"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 2.2, ease: "easeInOut", delay: 0.4 }}
                />
                <motion.p
                  className="px-5 text-sm text-white/80 sm:text-lg"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.2 }}
                >
                  Care, Comfort & Companionship
                </motion.p>
              </motion.div>
            </>
          ) : (
            <div className="absolute inset-0 bg-forest" aria-hidden />
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PageTransition() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;
  return (
    <motion.div
      key={pathname}
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-screen origin-top bg-gradient-to-b from-forest via-burgundy/90 to-coral"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
    />
  );
}

function BrandLogo({ inverted = false }: { inverted?: boolean }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setReady(true);
    img.onerror = () => setReady(false);
    img.src = LOGO_SRC;
  }, []);

  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2">
      {ready ? (
        <Image
          src={LOGO_SRC}
          alt="DTdogs.ca"
          width={260}
          height={84}
          className="h-[75px] w-auto object-contain"
          priority
        />
      ) : (
        <>
          <span className={cx("grid h-12 w-12 place-items-center rounded-full shadow-md transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105 sm:h-14 sm:w-14", inverted ? "bg-white text-forest" : "bg-forest text-white")}>
            <PawPrint className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className={cx("block text-sm font-extrabold tracking-tight", inverted ? "text-white" : "text-forest")}>DTdogs.ca</span>
            <span className={cx("block text-[10px] font-medium", inverted ? "text-white/70" : "text-ink/55")}>{brand.formerlyShort}</span>
          </span>
        </>
      )}
    </Link>
  );
}

function Navigation({ services }: { services: Service[] }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-forest text-[11px] text-white/90 sm:text-xs">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-x-3 gap-y-1 px-3 py-2 sm:px-4 md:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <a href={brand.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-peach">
              <svg className="h-3 w-3 shrink-0 text-peach" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span className="truncate">{brand.phone}</span>
            </a>
            <a href={`mailto:${brand.email}`} className="hidden items-center gap-1.5 transition hover:text-peach sm:inline-flex">
              <Mail className="h-3 w-3 text-peach" /> {brand.email}
            </a>
            <span className="hidden items-center gap-1.5 md:inline-flex">
              <MapPin className="h-3 w-3 text-peach" /> Serving Greater Toronto Area
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <span className="hidden text-white/70 sm:inline">Follow Us</span>
            <a href="https://instagram.com/dtdogs.ca" target="_blank" rel="noreferrer" aria-label="Instagram" className="transition hover:text-peach">
              <InstagramIcon className="h-3.5 w-3.5" />
            </a>
            <a href="https://google.com" target="_blank" rel="noreferrer" aria-label="Google" className="transition hover:text-peach">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
            </a>
            <span className="hidden text-white/80 min-[380px]:inline">@DTdogs.ca</span>
          </div>
        </div>
      </div>

      <div className={cx("px-2 pt-2 transition-all duration-500 sm:px-3 sm:pt-3 md:px-5", solid && "pb-2")}>
        <div className={cx("mx-auto flex max-w-[1400px] items-center justify-between gap-2 rounded-full border border-white/70 bg-white/95 px-2.5 py-2 shadow-[0_12px_40px_rgba(32,37,34,0.12)] backdrop-blur-xl transition-all duration-500 sm:gap-3 sm:px-4 sm:py-2.5 md:px-5 md:py-3", solid && "shadow-[0_16px_48px_rgba(32,37,34,0.16)]")}>
          <BrandLogo />

          <nav className="hidden items-center gap-0.5 text-[13px] font-semibold text-ink/75 xl:flex 2xl:gap-1">
            {nav.map((item) =>
              item.label === "Services" ? (
                <div className="group relative -my-3 py-3" key={item.href}>
                  <Link href={item.href} className={cx("flex items-center gap-1 rounded-full px-3 py-2 transition hover:text-burgundy", pathname.startsWith("/services") && "text-burgundy")}>
                    Services <ChevronDown className="h-3.5 w-3.5" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-50 max-h-[70vh] w-[min(24rem,90vw)] -translate-x-1/2 overflow-y-auto rounded-[1.75rem] border border-forest/5 bg-white p-3 opacity-0 shadow-2xl shadow-black/10 transition group-hover:visible group-hover:opacity-100">
                    {services.filter((service) => service.status !== "draft").map((service) => {
                      const thumb = servicePrimaryImage(service);
                      return (
                      <Link key={service.slug} href={`/services/${service.slug}`} className="group/card flex items-center gap-3 rounded-3xl p-3 transition hover:bg-burgundy/10">
                        <Image className="h-16 w-16 shrink-0 rounded-2xl object-cover" {...imageProps(thumb, "64px")} alt={thumb.alt} />
                        <span className="min-w-0 font-serif text-lg text-forest">{service.name}</span>
                      </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "relative rounded-full px-3 py-2 transition hover:text-burgundy",
                    (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))) && "text-burgundy after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-coral",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link href="/booking" className="btn-gradient group inline-flex items-center gap-1.5 rounded-full py-1.5 pl-3.5 pr-1.5 text-xs font-bold text-white shadow-md sm:gap-2 sm:pl-5 sm:text-sm">
              <span className="hidden min-[360px]:inline">Book</span>
              <span className="hidden sm:inline">Now</span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-burgundy transition group-hover:scale-110 sm:h-8 sm:w-8">
                <PawPrint className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
            </Link>
            <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-full border border-forest/15 bg-cream xl:hidden" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div className="safe-pb fixed inset-0 z-[90] overflow-y-auto bg-forest p-5 text-white sm:p-6 xl:hidden" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <button onClick={() => setOpen(false)} className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-white/20" aria-label="Close navigation">
              <X className="h-5 w-5" />
            </button>
            <div className="mt-8 grid gap-3 font-serif text-2xl sm:mt-10 sm:gap-4 sm:text-4xl">
              {[...nav, { label: "Treats", href: "/treats" }, { label: "Contact", href: "/contact" }].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="transition hover:text-peach">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
              <Link href="/booking" onClick={() => setOpen(false)} className="btn-gradient rounded-full px-6 py-3.5 text-center font-bold text-white">
                Book Now
              </Link>
              <a href={`tel:${brand.phone}`} className="rounded-full border border-white/30 px-6 py-3.5 text-center">
                Call
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export function HomePage({ services, testimonials, products }: { services: Service[]; testimonials: Testimonial[]; products: Product[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  // Always start false so SSR HTML matches the client's first paint.
  // sessionStorage / reduced-motion are only applied after mount.
  const [heroReady, setHeroReady] = useState(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 140]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, reducedMotion ? 1 : 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, reducedMotion ? 1 : 0.2]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -40]);

  useEffect(() => {
    let seen = false;
    try {
      seen = Boolean(sessionStorage.getItem("dtdogs_intro_seen"));
    } catch {
      seen = false;
    }
    if (reducedMotion || seen) {
      setHeroReady(true);
      return;
    }
    const markReady = () => setHeroReady(true);
    window.addEventListener("dtdogs-intro-done", markReady);
    const fallback = window.setTimeout(markReady, 4200);
    return () => {
      window.removeEventListener("dtdogs-intro-done", markReady);
      window.clearTimeout(fallback);
    };
  }, [reducedMotion]);

  const trustItems = [
    { label: "Serving across GTA", icon: MapPin },
    { label: "Operating all season", icon: CalendarDays },
    { label: "Downtown, Toronto", icon: Heart },
    { label: "#petpeople & #petparents", icon: Users },
  ];
  const stats = [
    { label: "Happy Pets & Counting", value: "Happy Pets", icon: PawPrint },
    { label: "Hundreds of petparents and counting", value: "Pet Parents", icon: Users },
    { label: "4+ years of serving across GTA and counting", value: "Experience", icon: CalendarDays },
    { label: "100% care with attentions", value: "Care & Attention", icon: ShieldCheck },
  ];
  const floatingPaws = [
    { top: "18%", left: "8%", size: "h-7 w-7", delay: 0, duration: 9 },
    { top: "42%", left: "18%", size: "h-5 w-5", delay: 1.2, duration: 11 },
    { top: "28%", left: "48%", size: "h-6 w-6", delay: 0.6, duration: 10 },
    { top: "62%", left: "12%", size: "h-4 w-4", delay: 2, duration: 12 },
    { top: "22%", left: "58%", size: "h-5 w-5", delay: 1.8, duration: 13 },
  ];

  const ease = [0.22, 1, 0.36, 1] as const;
  const enter = heroReady && !reducedMotion;

  return (
    <PageEnter pageKey="home">
      <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden bg-forest text-white">
        <motion.div
          className="absolute inset-0"
          style={{ y: imageY, scale: imageScale }}
          initial={reducedMotion ? false : { opacity: 0, x: 80, scale: 1.08 }}
          animate={enter ? { opacity: 1, x: 0, scale: 1 } : reducedMotion ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 80, scale: 1.08 }}
          transition={{ duration: 1.2, ease }}
        >
          <div className={cx("absolute inset-[-10%]", !reducedMotion && heroReady && "hero-ken-burns")}>
            <Image
              src={HERO_WAVE_SRC}
              alt="Friendly dog in a calm home-style care setting"
              fill
              priority
              className="object-cover object-[88%_35%] md:object-[85%_30%]"
              sizes="100vw"
            />
          </div>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="hero-orb absolute -left-24 top-[18%] h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-coral/30 via-peach/10 to-transparent blur-3xl" />
          <div className="hero-orb-delayed absolute -right-16 bottom-[8%] h-[22rem] w-[22rem] rounded-full bg-gradient-to-tl from-burgundy/35 via-forest/20 to-transparent blur-3xl" />
          <div className="hero-orb absolute left-[35%] top-[-10%] h-64 w-64 rounded-full bg-peach/15 blur-3xl" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/85 to-transparent md:via-forest/35 md:to-transparent lg:from-forest/90 lg:via-transparent" />
        <div className="hero-vignette pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #e89373 0.8px, transparent 1.2px)", backgroundSize: "48px 48px" }} />
        {!reducedMotion && heroReady ? <div className="hero-light-sweep" /> : null}

        {!reducedMotion && heroReady
          ? floatingPaws.map((paw, index) => (
              <motion.div
                key={index}
                className={cx("pointer-events-none absolute hidden text-peach/25 sm:block", paw.size)}
                style={{ top: paw.top, left: paw.left }}
                animate={{ y: [0, -28, 0], x: [0, index % 2 === 0 ? 12 : -10, 0], rotate: [0, 12, -8, 0], opacity: [0.15, 0.4, 0.15] }}
                transition={{ duration: paw.duration, delay: paw.delay, repeat: Infinity, ease: "easeInOut" }}
              >
                <PawPrint className="h-full w-full" />
              </motion.div>
            ))
          : null}

        <motion.div
          className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-center px-4 pb-28 pt-48 sm:px-6 sm:pb-24 sm:pt-48 md:pb-28 md:pt-52 lg:pt-48"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <motion.div
            className="max-w-xl lg:max-w-2xl"
            initial={reducedMotion ? false : { opacity: 0, x: -72 }}
            animate={enter ? { opacity: 1, x: 0 } : reducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -72 }}
            transition={{ duration: 1, ease }}
          >
            <motion.p
              className="mb-4 inline-flex max-w-full flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-peach sm:mb-5 sm:text-sm"
              initial={reducedMotion ? false : { opacity: 0, x: -40 }}
              animate={enter ? { opacity: 1, x: 0 } : { opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -40 }}
              transition={{ duration: 0.85, delay: enter ? 0.1 : 0, ease }}
            >
              <motion.span
                animate={enter && !reducedMotion ? { rotate: [0, -12, 12, 0], scale: [1, 1.15, 1] } : undefined}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <PawPrint className="h-4 w-4 shrink-0" />
              </motion.span>
              Structured pet care · Downtown Toronto & GTA
            </motion.p>

            <h1 className="font-serif text-[2.15rem] leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              <motion.span
                className="inline-block"
                initial={reducedMotion ? false : { opacity: 0, x: -56 }}
                animate={enter ? { opacity: 1, x: 0 } : { opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -56 }}
                transition={{ duration: 0.95, delay: enter ? 0.18 : 0, ease }}
              >
                Welcome to
              </motion.span>{" "}
              <motion.span
                className="relative inline-block"
                initial={reducedMotion ? false : { opacity: 0, x: -48, scale: 0.96 }}
                animate={enter ? { opacity: 1, x: 0, scale: 1 } : { opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -48, scale: reducedMotion ? 1 : 0.96 }}
                transition={{ duration: 1.05, delay: enter ? 0.32 : 0, ease }}
              >
                <span className="text-white">DT<span className="text-gradient">d</span>ogs.ca</span>
              </motion.span>
            </h1>
            <motion.p
              className="mt-1.5 text-[13px] font-normal leading-snug text-white/70 sm:text-sm"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={enter ? { opacity: 1 } : { opacity: reducedMotion ? 1 : 0 }}
              transition={{ duration: 0.7, delay: enter ? 0.38 : 0 }}
            >
              (Formerly Known As{" "}
              <a href="https://dtdogs.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white/90">Handandpaw.ca</a>
              {" / "}
              <a href="https://dtdogs.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white/90">Handandpaw.in</a>
              )
            </motion.p>

            <motion.p
              className="mt-5 max-w-lg text-sm leading-7 text-white/85 sm:mt-6 sm:text-base sm:leading-8"
              initial={reducedMotion ? false : { opacity: 0, x: -40 }}
              animate={enter ? { opacity: 1, x: 0 } : { opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -40 }}
              transition={{ duration: 0.9, delay: enter ? 0.42 : 0, ease }}
            >
              Professional, structured pet care in Downtown Toronto, proudly serving the GTA year-round. We are team of #petpeople and #petparents.
            </motion.p>

            <motion.div
              className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4"
              initial={reducedMotion ? false : { opacity: 0, x: -36 }}
              animate={enter ? { opacity: 1, x: 0 } : { opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -36 }}
              transition={{ duration: 0.85, delay: enter ? 0.55 : 0, ease }}
            >
              <Link
                href="/booking"
                className="btn-gradient inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 sm:w-auto"
              >
                Book Now <PawPrint className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/35 px-6 py-3.5 text-sm font-bold text-white transition hover:border-peach hover:bg-white/10 sm:w-auto"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/40 transition duration-500 group-hover:scale-110 group-hover:border-peach group-hover:bg-peach/20">
                  <Play className="h-3.5 w-3.5 fill-white" />
                </span>
                Explore Services
              </Link>
            </motion.div>

          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-36 right-4 z-20 hidden max-w-[13rem] sm:bottom-40 sm:right-8 sm:block md:right-12 lg:bottom-44 lg:right-16 lg:max-w-[14rem]"
          style={{ y: cardY }}
          initial={reducedMotion ? false : { opacity: 0, x: 72, scale: 0.92, rotate: 4 }}
          animate={enter ? { opacity: 1, x: 0, scale: 1, rotate: 0 } : { opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : 72, scale: reducedMotion ? 1 : 0.92, rotate: reducedMotion ? 0 : 4 }}
          transition={{ duration: 1, delay: enter ? 0.45 : 0, ease }}
        >
          <motion.div
            className="rounded-[1.5rem] bg-cream/95 p-4 text-ink shadow-2xl shadow-black/25 backdrop-blur-sm lg:p-5"
            animate={enter && !reducedMotion ? { y: [0, -12, 0] } : undefined}
            transition={{ duration: 5.5, delay: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              animate={enter && !reducedMotion ? { scale: [1, 1.12, 1] } : undefined}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <p className="font-serif text-2xl text-forest lg:text-3xl">Since 2021</p>
            <p className="mt-1 text-xs leading-5 text-ink/60">Consistent, nurturing services for your pet&apos;s well-being.</p>
            <PawPrint className="mt-3 h-4 w-4 text-coral" />
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-20 -mt-14 px-3 sm:-mt-20 sm:px-6">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 rounded-[1.75rem] bg-forest px-3 py-5 text-white shadow-2xl shadow-forest/30 sm:gap-0 sm:rounded-[2.5rem] sm:px-2 sm:py-6 md:grid-cols-4 md:py-7">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={cx("flex items-center gap-3 px-2 py-1 sm:justify-center sm:gap-4 sm:px-6 sm:py-2", index > 0 && "md:border-l md:border-white/15")}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-forest shadow-lg sm:h-12 sm:w-12">
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-serif text-lg leading-none sm:text-2xl md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[10px] leading-snug text-white/75 sm:text-xs md:text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <BrandMarquee />

      <section className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="animate-float pointer-events-none absolute left-0 top-8 h-64 w-64 rounded-full bg-gradient-to-br from-coral/15 to-transparent blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <Reveal from="left">
            <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-forest/15 sm:rounded-[2.5rem]">
              <Image className="h-72 w-full object-cover sm:h-[26rem]" {...imageProps(homeSupportingImages.story)} alt={homeSupportingImages.story.alt} />
            </div>
          </Reveal>
          <Reveal from="right" delay={0.1}>
            <SectionHeading eyebrow="Our Vision" title="Professional and structured pet care in Downtown Toronto, serving across the GTA in every season." align="left" />
            <p className="mt-5 max-w-3xl text-sm leading-7 text-ink/70 sm:text-base sm:leading-8">
              DTdogs.ca {brand.formerlyShort} offers structured pet care for discerning pet parents. Located in Downtown, Toronto — serving across GTA and operating all season. We are a team of #petpeople and #petparents. Our vision is simple: safe, professional care in a calm, home-style environment — with clear updates while you&apos;re away.
            </p>
            <div className="mt-6">
              <Button href="/our-vision" variant="outline">Read Our Vision</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <ServiceGrid services={services} preview />

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:px-8 lg:grid-cols-2 xl:gap-12">
          <Reveal from="left">
            <SectionHeading eyebrow="Why choose us" title="Uncompromised care for your pet's happiness." align="left" />
            <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
              {["Food safety and hygiene monitored", "Comfortable, adjusted temperature", "Certified first-aid and canine behaviour knowledge", "24/7 CCTV surveillance", "Controlled group sizes", "Secure handling and calm routines"].map((item, index) => (
                <Reveal key={item} from={index % 2 === 0 ? "left" : "right"} delay={index * 0.06}>
                  <div className="group rounded-[1.25rem] bg-gradient-to-br from-sage/70 to-sage/35 p-4 transition-all duration-500 hover:-translate-y-1 hover:from-peach/60 hover:to-sage/40 hover:shadow-xl hover:shadow-forest/10 sm:rounded-[1.5rem] sm:p-5">
                    <span className="mb-3 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-forest to-burgundy text-white shadow-lg shadow-forest/20 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                      <Check className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-ink sm:text-base">{item}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
          <Reveal from="right" delay={0.15}>
            <ImageCollage images={[homeSupportingImages.whyA, homeSupportingImages.whyB, homeSupportingImages.story]} />
          </Reveal>
        </div>
      </section>

      <ReviewImageSlider />

      <ProcessSection />
      <SunnyismSection />
      <GalleryPreview images={[homeSupportingImages.gallery, ...homePage.galleryImages]} />
      <ShopPreview products={products} />
      <BrandMarquee dark />
      <BookingCTA image={homeSupportingImages.booking} />
    </PageEnter>
  );
}

export function StandardPage({
  page,
  services,
  pricing,
  faqs,
  testimonials,
  blogPosts,
  products,
  team,
  treatImages = [],
}: {
  page: PageContent;
  services: Service[];
  pricing: PricingPackage[];
  faqs: Faq[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  products: Product[];
  team: TeamMember[];
  treatImages?: ImageAsset[];
}) {
  return (
    <PageEnter pageKey={page.slug}>
      <Hero page={page} />
      {page.slug === "services" ? <ServiceGrid services={services} /> : null}
      {page.slug === "pricing" ? <PricingGrid pricing={pricing} /> : null}
      {page.slug === "gallery" ? <GalleryGrid images={page.blocks[0]?.images ?? []} /> : null}
      {page.slug === "treats" ? <TreatsGallery images={treatImages.length ? treatImages : page.blocks[0]?.images ?? []} /> : null}
      {page.slug === "testimonials" ? <ReviewImageSlider /> : null}
      {page.slug === "faq" ? <GroupedFaqPage faqs={faqs} images={page.hero.images} /> : null}
      {page.slug === "blog" ? <BlogGrid posts={blogPosts} /> : null}
      {page.slug === "booking" ? (
        <Suspense fallback={<section className="mx-auto max-w-5xl px-4 py-20 text-center text-ink/60">Loading booking form…</section>}>
          <BookingForm services={services} />
        </Suspense>
      ) : null}
      {page.slug === "team" || page.slug === "our-vision" ? <TeamGrid team={team} /> : null}
      {page.slug === "gift-cards" ? <GiftCardForm /> : null}
      {page.slug === "shop" ? <ProductGrid products={products} merchLayout /> : null}
      {page.slug === "contact" ? <ContactPanel /> : null}
      {page.slug !== "pricing"
        ? page.blocks.map((block, index) => (
            <ContentBlock key={`${block.title}-${index}`} block={block} pageSlug={page.slug} blockIndex={index} />
          ))
        : null}
      {!["booking", "contact"].includes(page.slug) ? <BookingCTA /> : null}
    </PageEnter>
  );
}

function isHeroBookNowLabel(label: string) {
  const normalized = label.trim().toLowerCase();
  return normalized === "book now" || normalized === "book your pet";
}

function heroBookingHref(cta: { label: string; href: string }) {
  return isHeroBookNowLabel(cta.label) ? "/booking" : cta.href;
}

function heroBookingLabel(cta: { label: string; href: string }) {
  return isHeroBookNowLabel(cta.label) ? "Book Now" : cta.label;
}

function Hero({ page }: { page: PageContent }) {
  const reducedMotion = useReducedMotion();
  const legacyHeroImages =
    page.slug === "gallery" ? galleryHeroImages : page.slug === "shop" ? shopHeroImages : page.hero?.images ?? [];
  const generatedHero = pageHeroImages[page.slug];
  const heroImages = generatedHero
    ? [generatedHero, ...legacyHeroImages.filter((image) => image.id !== generatedHero.id)]
    : legacyHeroImages;
  const main = heroImages[0];
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className={cx("relative overflow-hidden bg-forest text-white", page.slug === "booking" ? "pt-28 md:pt-32" : "pt-28 md:pt-32")}>
      {main ? (
        <motion.div
          className="absolute inset-0"
          initial={reducedMotion ? false : { opacity: 0, scale: 1.12, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.35, ease }}
        >
          <Image className="h-full w-full object-cover" priority {...imageProps(main, "100vw")} alt={main.alt} />
        </motion.div>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-forest/70 via-forest/35 to-forest/20" />
      <div className="bg-gradient-animated absolute inset-0 opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/45 via-transparent to-forest/15" />
      <div className="tech-grid absolute inset-0 opacity-40" />
      <motion.div
        className="animate-float absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-coral/18 to-burgundy/10 blur-3xl"
        initial={reducedMotion ? false : { opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, ease }}
      />
      <motion.div
        className="animate-float-delayed absolute -right-16 bottom-8 h-72 w-72 rounded-full bg-gradient-to-tl from-peach/15 to-transparent blur-3xl"
        initial={reducedMotion ? false : { opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 0.15, ease }}
      />
      <div
        className={cx(
          "relative mx-auto grid max-w-7xl items-start gap-6 px-4 md:px-8 lg:grid-cols-[1fr_0.9fr]",
          page.slug === "booking"
            ? "min-h-0 py-8 md:py-10"
            : "min-h-[70svh] py-10 md:min-h-[78svh] md:py-14 lg:py-16",
        )}
      >
        <div>
          <motion.p
            className="mb-3 inline-flex max-w-full flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-peach sm:mb-4 sm:gap-3 sm:text-sm"
            initial={reducedMotion ? false : { opacity: 0, x: -56, y: 16 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.85, ease }}
          >
            <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-peach sm:block" />
            {page.hero.eyebrow}
          </motion.p>
          <motion.h1
            className="font-serif text-[1.85rem] leading-[1.1] tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)] sm:text-3xl md:text-4xl lg:text-5xl"
            initial={reducedMotion ? false : { opacity: 0, x: -72 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.12, ease }}
          >
            {page.hero.title}
          </motion.h1>
          <motion.p
            className="mt-4 max-w-2xl text-sm leading-7 text-white/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)] sm:mt-5 sm:text-base sm:leading-8"
            initial={reducedMotion ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease }}
          >
            {page.hero.body}
          </motion.p>
          <motion.div
            className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap"
            initial={reducedMotion ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.42, ease }}
          >
            {page.hero.primaryCta ? (
              <Button
                href={heroBookingHref(page.hero.primaryCta)}
                arrow={page.hero.primaryCta.href.startsWith("#") ? "down" : "right"}
              >
                {heroBookingLabel(page.hero.primaryCta)}
              </Button>
            ) : null}
            {page.hero.secondaryCta ? (
              <Button
                href={heroBookingHref(page.hero.secondaryCta)}
                variant="light"
                arrow={page.hero.secondaryCta.href.startsWith("#") ? "down" : "right"}
              >
                {heroBookingLabel(page.hero.secondaryCta)}
              </Button>
            ) : null}
          </motion.div>
        </div>
        {legacyHeroImages.length > 0 && page.slug !== "booking" ? (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: 72, y: 24 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.05, delay: 0.2, ease }}
          >
            <ImageCollage images={heroImages.slice(0, 5)} dark />
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

function ContentBlock({ block, pageSlug, blockIndex }: { block: PageContent["blocks"][number]; pageSlug: string; blockIndex: number }) {
  if (block.type === "gallery" || block.type === "faq" || block.type === "shop" || block.type === "testimonials") return null;
  const items = pageSlug === "about" && blockIndex === 1 ? aboutGuideItems : block.items;
  const images = pageSlug === "about" && blockIndex === 0 ? aboutStoryImages : pageSlug === "about" && blockIndex === 2 ? aboutBrandImages : block.images;
  const directions = ["left", "up", "right", "down"] as const;
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <Reveal from={blockIndex % 2 === 0 ? "left" : "right"}>
        <SectionHeading eyebrow={block.eyebrow} title={block.title} />
        {block.body ? <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-7 text-ink/70 sm:text-base sm:leading-8">{block.body}</p> : null}
      </Reveal>
      {items?.length ? (
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((item, itemIndex) => (
            <Reveal key={item.title} from={directions[itemIndex % directions.length]} delay={itemIndex * 0.1}>
              <motion.article
                className="group h-full overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-burgundy/15"
                whileHover={{ y: -6 }}
              >
                {item.image ? (
                  <div className="relative overflow-hidden">
                    <Image className="h-64 w-full object-cover transition duration-700 group-hover:scale-110" {...imageProps(item.image)} alt={item.image.alt} />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                ) : null}
                <div className="p-6">
                  <h3 className="font-serif text-2xl text-forest sm:text-3xl">{item.title}</h3>
                  <p className="mt-3 leading-7 text-ink/65">{item.body}</p>
                  {"href" in item && item.href ? (
                    <Link href={item.href} className="mt-5 inline-flex items-center gap-2 font-bold text-burgundy">
                      Explore <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      ) : null}
      {images?.length ? <ImageRibbon images={images.slice(0, 8)} /> : null}
    </section>
  );
}

export function ServiceDetail({ service, related }: { service: Service; related: Service[] }) {
  const comingSoon = service.status === "coming-soon";
  const reducedMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const directions = ["left", "up", "right", "down"] as const;
  const heroImages = serviceDisplayImages(service);

  return (
    <PageEnter pageKey={service.slug}>
      <section className="relative overflow-hidden bg-forest pt-28 text-white md:pt-32">
        {heroImages[0] ? (
          <motion.div
            className="absolute inset-0"
            initial={reducedMotion ? false : { opacity: 0, scale: 1.1, x: 36 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.25, ease }}
          >
            <Image className="h-full w-full object-cover" priority {...imageProps(heroImages[0], "100vw")} alt={heroImages[0].alt} />
          </motion.div>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-forest/75 via-forest/40 to-forest/25" />
        <div className="bg-gradient-animated absolute inset-0 opacity-28" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-forest/15" />
        <motion.div
          className="animate-float absolute -right-24 top-16 h-96 w-96 rounded-full bg-gradient-to-bl from-coral/18 to-transparent blur-3xl"
          initial={reducedMotion ? false : { opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease }}
        />
        <motion.div
          className="animate-float-delayed absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-gradient-to-tr from-peach/15 to-transparent blur-3xl"
          initial={reducedMotion ? false : { opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, delay: 0.12, ease }}
        />
        <div className="relative mx-auto grid min-h-[70svh] max-w-7xl items-center gap-8 px-4 py-8 sm:gap-10 md:min-h-[78svh] md:px-8 md:py-10 lg:grid-cols-2 lg:py-12">
          <div>
            <motion.p
              className="mb-4 inline-flex max-w-full flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-peach sm:mb-5 sm:gap-3 sm:text-sm"
              initial={reducedMotion ? false : { opacity: 0, x: -56, y: 16 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.85, ease }}
            >
              <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-peach sm:block" />
              {comingSoon ? "Coming soon" : service.eyebrow}
            </motion.p>
            <motion.h1
              className="font-serif text-[2.1rem] leading-[1.08] tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)] sm:text-4xl md:text-5xl lg:text-6xl"
              initial={reducedMotion ? false : { opacity: 0, x: -72 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.12, ease }}
            >
              {service.name}
            </motion.h1>
            <motion.div
              className="mt-5 flex flex-wrap gap-3 text-sm"
              initial={reducedMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.24, ease }}
            >
              {service.duration ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur">
                  <Clock className="h-4 w-4 text-peach" /> {service.duration}
                </span>
              ) : null}
              {service.priceLabel ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-peach/40 bg-peach/15 px-4 py-2 font-bold text-peach backdrop-blur">
                  {service.priceLabel}
                </span>
              ) : null}
            </motion.div>
            <motion.p
              className="mt-6 text-base leading-7 text-white/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)] sm:text-lg sm:leading-8"
              initial={reducedMotion ? false : { opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.32, ease }}
            >
              {service.description}
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              initial={reducedMotion ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.44, ease }}
            >
              {comingSoon ? (
                <span className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-center font-bold text-white/55 sm:w-auto">
                  Booking Unavailable
                </span>
              ) : (
                <Button href="#book-service">Book This Service</Button>
              )}
              <Button href="/pricing" variant="light">
                View Packages
              </Button>
            </motion.div>
          </div>
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: 72, y: 24 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.05, delay: 0.2, ease }}
          >
            <ImageCollage images={heroImages} dark />
          </motion.div>
        </div>
      </section>

      {!comingSoon ? <ServiceBookingPanel service={service} /> : null}

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 md:px-8 md:py-24 lg:grid-cols-3">
        {[
          ["Duration", service.duration ?? "Confirmed at booking"],
          ["Price", service.priceLabel ?? "Request pricing"],
          ["Who it is for", service.forWhom],
        ].map(([title, body], index) => (
          <Reveal key={title} from={directions[index % directions.length]} delay={index * 0.1}>
            <div className="h-full rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
              <h2 className="font-serif text-3xl text-forest sm:text-4xl">{title}</h2>
              <p className="mt-5 leading-8 text-ink/70">{body}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {service.priceTiers?.length ? (
        <section className="bg-white py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <Reveal from="up">
              <SectionHeading eyebrow="Pricing by size" title="Transparent rates for every dog size." />
            </Reveal>
            <div className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
              {service.priceTiers.map((tier, index) => (
                <Reveal key={tier.label} from={directions[index % directions.length]} delay={index * 0.08}>
                  <div className="w-[calc(50%-0.375rem)] rounded-[1.25rem] border border-forest/10 bg-cream p-4 text-center shadow-lg shadow-black/5 sm:w-auto sm:min-w-[200px] sm:rounded-[1.5rem] sm:p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-burgundy sm:text-xs sm:tracking-[0.18em]">{tier.label}</p>
                    <p className="mt-2 font-serif text-2xl text-forest sm:mt-3 sm:text-4xl">{tier.priceLabel}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <Reveal from="left">
          <SectionHeading eyebrow="What’s included" title="Everything packed into this care experience." align="left" />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {service.includes.map((item, index) => (
            <Reveal key={item} from={index % 2 === 0 ? "left" : "right"} delay={index * 0.06}>
              <div className="flex gap-3 rounded-[1.25rem] bg-white p-5 shadow-lg shadow-black/5">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
                <p className="font-medium text-ink/80">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal from="up">
            <SectionHeading eyebrow="Service process" title="A calm path from request to care." />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, index) => (
              <Reveal key={step} from={directions[index % directions.length]} delay={index * 0.1}>
                <div className="group relative h-full overflow-hidden rounded-[2rem] bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-burgundy/15">
                  <div className="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-0 bg-gradient-to-r from-coral to-burgundy transition-transform duration-500 group-hover:scale-x-100" />
                  <span className="text-gradient font-serif text-4xl sm:text-5xl">0{index + 1}</span>
                  <p className="mt-4 font-semibold leading-7">{step}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <FaqList faqs={service.faqs.map((faq, index) => ({ slug: `${service.slug}-${index}`, category: service.name, ...faq }))} />
      {related && related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <Reveal from="up">
            <SectionHeading eyebrow="Related services" title="Care that pairs well with this service." />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {related.map((item, index) => (
              <Reveal key={item.slug} from={directions[index % directions.length]} delay={index * 0.1}>
                <ServiceCard service={item} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
      {!comingSoon ? <BookingCTA image={heroImages[0]} /> : null}
    </PageEnter>
  );
}

function ServiceBookingPanel({ service }: { service: Service }) {
  const [includeAddon, setIncludeAddon] = useState(false);
  const [sizeLabel, setSizeLabel] = useState(service.priceTiers?.[0]?.label ?? "");
  const basePrice = getServiceBasePrice(service, sizeLabel);
  const total = basePrice === null ? null : basePrice + (includeAddon ? serviceAddOn.priceAmount : 0);

  const bookingHref = useMemo(() => {
    const params = new URLSearchParams({
      service: service.slug,
      addon: includeAddon ? "1" : "0",
    });
    if (sizeLabel) params.set("size", sizeLabel);
    if (total !== null) params.set("total", String(total));
    return `/booking?${params.toString()}#booking-form`;
  }, [service.slug, includeAddon, sizeLabel, total]);

  return (
    <section id="book-service" className="relative z-10 -mt-4 px-4 pb-6 sm:px-6 md:-mt-8">
      <Reveal from="up" className="mx-auto max-w-7xl">
      <div className="grid gap-6 rounded-[2rem] border border-forest/10 bg-white p-5 shadow-2xl shadow-forest/15 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">Book this service</p>
          <h2 className="mt-3 font-serif text-3xl text-forest sm:text-4xl">{service.name}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/65 sm:text-base">{service.description}</p>

          {service.priceTiers?.length ? (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest/70">Choose dog size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {service.priceTiers.map((tier) => (
                  <button
                    key={tier.label}
                    type="button"
                    onClick={() => setSizeLabel(tier.label)}
                    className={cx(
                      "rounded-full px-4 py-2 text-sm font-bold transition",
                      sizeLabel === tier.label ? "btn-gradient text-white shadow-md shadow-coral/25" : "bg-sage text-ink hover:bg-peach/50",
                    )}
                  >
                    {tier.label} · {tier.priceLabel}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-[1.5rem] border border-forest/10 bg-cream p-4 transition hover:border-coral/40">
            <input
              type="checkbox"
              checked={includeAddon}
              onChange={(event) => setIncludeAddon(event.target.checked)}
              className="mt-1 h-4 w-4 accent-burgundy"
            />
            <span>
              <span className="block font-bold text-forest">
                Add {serviceAddOn.name} (+{serviceAddOn.priceLabel})
              </span>
              <span className="mt-1 block text-sm leading-6 text-ink/65">
                {serviceAddOn.description} · {serviceAddOn.duration}
              </span>
            </span>
          </label>
        </div>

        <div className="flex flex-col justify-between rounded-[1.75rem] bg-gradient-to-br from-forest to-burgundy p-6 text-white sm:p-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-peach">Estimated total</p>
            <p className="mt-3 font-serif text-4xl sm:text-5xl">{total === null ? service.priceLabel ?? "Quote" : formatMoney(total)}</p>
            <ul className="mt-5 space-y-2 text-sm text-white/80">
              <li className="flex justify-between gap-3">
                <span>Service{sizeLabel ? ` (${sizeLabel})` : ""}</span>
                <span>{basePrice === null ? service.priceLabel ?? "—" : formatMoney(basePrice)}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Add-on</span>
                <span>{includeAddon ? formatMoney(serviceAddOn.priceAmount) : "$0"}</span>
              </li>
            </ul>
          </div>
          <Link
            href={bookingHref}
            className="btn-gradient mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-center text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
          >
            Continue to Booking <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      </Reveal>
    </section>
  );
}

export function BlogDetail({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  return (
    <PageEnter pageKey={post.slug}>
      <article className="bg-cream pt-36 md:pt-40">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-20">
          <Reveal from="left">
            <p className="text-[10px] uppercase tracking-[0.16em] text-burgundy sm:text-sm sm:tracking-[0.34em]">{post.category}</p>
            <h1 className="mt-4 font-serif text-[2.35rem] leading-[1.05] text-forest sm:mt-5 sm:text-5xl md:text-7xl">{post.title}</h1>
            <p className="mt-6 text-base leading-8 text-ink/70 sm:text-lg">{post.excerpt}</p>
          </Reveal>
          <Reveal from="up" delay={0.15}>
            <Image className="mt-10 h-72 w-full rounded-[2rem] object-cover sm:h-[34rem] sm:rounded-[3rem]" priority {...imageProps(post.featuredImage, "100vw")} alt={post.featuredImage.alt} />
          </Reveal>
          <Reveal from="right" delay={0.2}>
            <div className="prose prose-lg mt-12 max-w-none text-ink/75">
              <p>{post.body}</p>
            </div>
          </Reveal>
          <ImageRibbon images={post.inlineImages} />
        </div>
      </article>
      {related.length ? <BlogGrid posts={related} title="Related notes" /> : null}
      <BookingCTA />
    </PageEnter>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const images = productImages(product);
  const [selected, setSelected] = useState(images[0]);
  const comingSoon = product.status === "coming-soon";
  return (
    <PageEnter pageKey={product.slug}>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 pt-40 md:gap-10 md:px-8 md:pb-20 md:pt-44 lg:grid-cols-2">
        <Reveal from="left">
          <Image className="h-72 w-full rounded-[1.75rem] object-cover sm:h-[38rem] sm:rounded-[3rem]" priority {...imageProps(selected, "(min-width: 1024px) 50vw, 100vw")} alt={selected.alt} />
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
            {images.slice(0, 5).map((image) => (
              <button key={image.id} onClick={() => setSelected(image)} className="overflow-hidden rounded-xl border-2 border-transparent focus:border-forest sm:rounded-2xl">
                <Image className="h-14 w-full object-cover sm:h-24" {...imageProps(image, "120px")} alt={image.alt} />
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal from="right" delay={0.12}>
          <div className="self-center">
            <p className="text-[10px] uppercase tracking-[0.16em] text-burgundy sm:text-sm sm:tracking-[0.34em]">
              {comingSoon ? "Coming Soon #2026" : "Catalogue / Inquiry mode"}
            </p>
            <h1 className="mt-4 font-serif text-[2.35rem] leading-[1.05] text-forest sm:mt-5 sm:text-6xl">{product.title}</h1>
            <p className="mt-6 text-base leading-8 text-ink/70 sm:text-xl">{product.description}</p>
            <div className="mt-6 flex flex-wrap items-end gap-3">
              {product.compareAtPriceLabel ? (
                <p className="font-serif text-2xl text-ink/40 line-through sm:text-3xl">{product.compareAtPriceLabel}</p>
              ) : null}
              <p className="font-serif text-3xl font-bold text-burgundy sm:text-4xl">{product.priceLabel}</p>
            </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <InfoPill title="Sizes" value={product.sizes.join(", ")} />
            <InfoPill title="Colours" value={product.colors.join(", ")} />
            <InfoPill title="Inventory" value={`${product.inventory ?? 0} editable in CMS`} />
            <InfoPill title="Status" value={comingSoon ? "Coming Soon" : product.status} />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact">{comingSoon ? "Notify Me" : "Ask About This Product"}</Button>
            <Button href="/shop" variant="outline">Back to Shop</Button>
          </div>
          </div>
        </Reveal>
      </section>
    </PageEnter>
  );
}

function ServiceGrid({ services, preview = false }: { services: Service[]; preview?: boolean }) {
  const directions = ["left", "up", "right", "down"] as const;
  const visibleServices = preview ? services.filter((s) => s.status !== "coming-soon").slice(0, 9) : services;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <Reveal from="up">
        <SectionHeading eyebrow="Our services" title="Structured care options for every season in the GTA." />
      </Reveal>
      <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 lg:grid-cols-3">
        {visibleServices.map((service, index) => (
          <Reveal key={service.slug} from={directions[index % directions.length]} delay={(index % 6) * 0.08}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
      {preview ? (
        <Reveal from="up" delay={0.15} className="mt-8 text-center">
          <Button href="/services">View All Services</Button>
        </Reveal>
      ) : null}
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const comingSoon = service.status === "coming-soon";
  const cardImage = servicePrimaryImage(service);
  const bookHref = `/booking?service=${encodeURIComponent(service.slug)}#booking-form`;
  const whatsappHref = `${brand.whatsapp}?text=${encodeURIComponent(`Hi DTdogs.ca — I'd like to ask about ${service.name}.`)}`;

  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] bg-white shadow-xl shadow-black/5 transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-burgundy/20 sm:rounded-[2rem]">
      <div className="pointer-events-none absolute inset-0 z-10 rounded-[1.75rem] opacity-0 ring-2 ring-inset ring-coral/50 transition-opacity duration-500 group-hover:opacity-100 sm:rounded-[2rem]" />
      <Link href={`/services/${service.slug}`} className="relative block h-52 overflow-hidden sm:h-64">
        <Image className="h-full w-full object-cover transition duration-700 group-hover:scale-105" {...imageProps(cardImage)} alt={cardImage.alt} />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/45 via-transparent to-transparent opacity-60" />
        <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-cream to-peach px-3 py-1.5 text-[10px] font-semibold tracking-wide text-forest shadow-lg sm:left-5 sm:top-5 sm:px-4 sm:py-2 sm:text-xs">
          {comingSoon ? "Coming soon" : service.eyebrow}
        </span>
      </Link>
      <div className="relative p-5 sm:p-6">
        <Link href={`/services/${service.slug}`}>
          <h3 className="font-serif text-[1.45rem] leading-tight text-forest transition-colors duration-300 group-hover:text-burgundy sm:text-2xl">{service.name}</h3>
        </Link>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-medium tracking-wide text-forest/70">
          {service.duration ? <span>{service.duration}</span> : null}
          {service.duration && service.priceLabel ? <span>•</span> : null}
          {service.priceLabel ? <span className="text-burgundy">{service.priceLabel}</span> : null}
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/65">{service.summary}</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {comingSoon ? (
            <Link href={`/services/${service.slug}`} className="inline-flex flex-1 items-center justify-center rounded-full border border-forest/15 px-4 py-2.5 text-sm font-bold text-forest transition hover:bg-sage">
              View Details
            </Link>
          ) : (
            <Link href={bookHref} className="btn-gradient inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white">
              Book Now <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center rounded-full border border-forest/20 px-4 py-2.5 text-sm font-bold text-forest transition hover:border-burgundy hover:text-burgundy">
            Message us
          </a>
        </div>
      </div>
    </article>
  );
}

function PricingGrid({ pricing }: { pricing: PricingPackage[] }) {
  const packages = pricing.filter((item) => item.status !== "hidden");
  const directions = ["left", "up", "right", "down"] as const;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <Reveal from="up">
        <div className="mb-10 text-center md:mb-14">
          <p className="text-xs font-semibold tracking-wide text-burgundy">Dog daycare, boarding & dog walks</p>
          <h2 className="mt-3 font-serif text-3xl text-forest sm:text-4xl md:text-5xl">Choose your package</h2>
        </div>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((item, index) => {
          const priceDigits = item.priceLabel.replace(/[^\d,]/g, "");
          return (
            <Reveal key={item.slug} from={directions[index % directions.length]} delay={(index % 6) * 0.08}>
              <article
                className={cx(
                  "group flex h-full flex-col rounded-[1.75rem] border border-forest/10 bg-white p-6 text-center shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-forest/15 sm:p-8",
                  item.featured && "ring-2 ring-coral bg-gradient-to-b from-white to-peach/25",
                )}
              >
                {item.featured ? (
                  <span className="mx-auto mb-3 rounded-full bg-gradient-to-r from-coral/30 to-burgundy/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-burgundy">
                    Popular
                  </span>
                ) : (
                  <span className="mb-3 h-[22px]" aria-hidden />
                )}
                <h3 className="font-serif text-2xl text-forest transition-colors duration-300 group-hover:text-burgundy sm:text-[1.65rem]">{item.name}</h3>
                <p className="mt-5 flex items-start justify-center gap-0.5 font-serif leading-none text-forest">
                  <span className="mt-1 text-xl font-bold text-coral sm:text-2xl">$</span>
                  <span className="text-5xl font-bold tracking-tight sm:text-6xl">{priceDigits}</span>
                </p>
                <p className="mt-5 flex-1 text-sm leading-6 text-ink/60">{item.features.join(". ")}.</p>
                {item.duration ? <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-forest/70">{item.duration}</p> : null}
                <Link
                  href={`/booking?package=${encodeURIComponent(item.name)}&price=${encodeURIComponent(item.priceLabel)}`}
                  className="btn-gradient mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
                >
                  Book now
                </Link>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function GalleryGrid({ images }: { images: ImageAsset[] }) {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<ImageAsset | null>(null);
  const preferredOrder = [
    "Hero",
    "Care",
    "Portrait",
    "Dog Walking",
    "Boarding",
    "Daycare",
    "Pet Visits",
    "House Sitting",
    "Chauffeur",
    "Grooming",
    "Nail Trimming",
    "Training",
    "Excursions",
    "Team",
    "Facility",
    "Toronto",
    "Trust",
    "Testimonial",
    "Product",
    "Booking",
    "Contact",
    "Journal",
    "Policy",
    "Happy Clients",
    "Behind The Scenes",
    "Toronto Adventures",
    "Seasonal",
    "Apparel",
  ];
  const formatTag = (tag: string) =>
    tag
      .split(/[-_\s]+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ")
      .replace(/\bThe\b/g, "The");
  const discovered = Array.from(
    new Set(images.flatMap((image) => (image.tags ?? []).map(formatTag)).filter(Boolean)),
  );
  // Keep only the curated gallery categories — skip noisy media tags like Brand/Story/Guides.
  const categories = ["All", ...preferredOrder.filter((tag) => discovered.includes(tag))];
  const visible =
    filter === "All"
      ? images
      : images.filter((image) => (image.tags ?? []).map(formatTag).includes(filter));

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="gallery-filter-flow rounded-[2rem] border border-white/50 px-4 py-6 sm:rounded-[2.5rem] sm:px-6 sm:py-7 md:px-8">
        <div className="relative z-[1] flex flex-wrap justify-center gap-2 sm:gap-2.5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={cx(
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 sm:px-5 sm:py-2.5",
                filter === category
                  ? "bg-gradient-to-r from-forest to-burgundy text-white shadow-lg shadow-burgundy/25"
                  : "border border-white/80 bg-white/90 text-ink backdrop-blur-md hover:bg-white hover:shadow-md",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {visible.map((image, index) => (
          <Reveal key={`${image.id}-${index}`} from={(["left", "up", "right", "down"] as const)[index % 4]} delay={(index % 6) * 0.06} className="mb-5 break-inside-avoid">
          <button onClick={() => setActive(image)} className="group block w-full overflow-hidden rounded-[2rem] bg-white text-left shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-burgundy/15">
            <div className="overflow-hidden">
              <Image className="h-auto w-full object-cover transition duration-700 group-hover:scale-110" {...imageProps(image, "(min-width: 1024px) 33vw, 100vw")} alt={image.alt} loading={index < 3 ? "eager" : "lazy"} />
            </div>
            <div className="p-5">
              <p className="font-serif text-2xl text-forest transition-colors duration-300 group-hover:text-burgundy">{image.title}</p>
              <p className="mt-1 text-sm text-ink/60">{image.caption ?? image.alt}</p>
            </div>
          </button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>
        {active ? (
          <motion.div className="safe-pb fixed inset-0 z-[95] grid place-items-center bg-black/80 p-3 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button onClick={() => setActive(null)} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white sm:right-5 sm:top-5" aria-label="Close image">
              <X className="h-5 w-5" />
            </button>
            <motion.div className="max-h-[88vh] w-full max-w-5xl overflow-auto rounded-[1.5rem] bg-white sm:rounded-[2rem]" initial={{ scale: 0.94 }} animate={{ scale: 1 }}>
              <Image className="max-h-[70vh] w-full object-contain sm:max-h-[78vh]" {...imageProps(active, "90vw")} alt={active.alt} />
              <div className="p-4 sm:p-5">
                <h3 className="font-serif text-2xl text-forest sm:text-3xl">{active.title}</h3>
                <p className="text-sm text-ink/65 sm:text-base">{active.caption ?? active.alt}</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function TreatsGallery({ images }: { images: ImageAsset[] }) {
  const treatImages = images.length ? images : homePage.galleryImages;
  const [active, setActive] = useState<ImageAsset | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">Treat Gallery</p>
          <h2 className="mt-4 font-serif text-[2rem] leading-tight text-forest sm:text-6xl">A sweet little showcase for dog treats.</h2>
          <p className="mt-5 leading-8 text-ink/65">
            Upload treat photography in the Media Library, assign it to the Treats page, and use captions for flavour, ingredients or availability notes.
          </p>
          <div className="mt-7">
            <Button href="/contact">Ask About Treats</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {treatImages.slice(0, 6).map((image, index) => (
            <button
              key={`${image.id}-${index}`}
              type="button"
              onClick={() => setActive(image)}
              className={cx("group overflow-hidden rounded-[1.5rem] bg-white shadow-xl shadow-black/5", index === 0 && "col-span-2 row-span-2")}
            >
              <Image className={cx("w-full object-cover transition duration-500 group-hover:scale-105", index === 0 ? "h-80 sm:h-full" : "h-40 sm:h-52")} {...imageProps(image)} alt={image.alt} />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {treatImages.map((image, index) => (
          <button key={`treat-${image.id}-${index}`} type="button" onClick={() => setActive(image)} className="group mb-5 block w-full overflow-hidden rounded-[2rem] bg-white text-left shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-burgundy/15">
            <div className="overflow-hidden">
              <Image className="h-auto w-full object-cover transition duration-700 group-hover:scale-110" {...imageProps(image, "(min-width: 1024px) 33vw, 100vw")} alt={image.alt} loading={index < 3 ? "eager" : "lazy"} />
            </div>
            <div className="p-5">
              <p className="font-serif text-2xl text-forest transition-colors duration-300 group-hover:text-burgundy">{image.title}</p>
              <p className="mt-1 text-sm text-ink/60">{image.caption ?? image.alt}</p>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div className="safe-pb fixed inset-0 z-[95] grid place-items-center bg-black/80 p-3 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button onClick={() => setActive(null)} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white sm:right-5 sm:top-5" aria-label="Close image">
              <X className="h-5 w-5" />
            </button>
            <motion.div className="max-h-[88vh] w-full max-w-5xl overflow-auto rounded-[1.5rem] bg-white sm:rounded-[2rem]" initial={{ scale: 0.94 }} animate={{ scale: 1 }}>
              <Image className="max-h-[70vh] w-full object-contain sm:max-h-[78vh]" {...imageProps(active, "90vw")} alt={active.alt} />
              <div className="p-4 sm:p-5">
                <h3 className="font-serif text-2xl text-forest sm:text-3xl">{active.title}</h3>
                <p className="text-sm text-ink/65 sm:text-base">{active.caption ?? active.alt}</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function FaqList({ faqs }: { faqs: Array<Faq | { slug: string; question: string; answer: string; category: string }> }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.slug ?? null);
  return (
    <section className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-20">
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.slug} className="rounded-[1.5rem] bg-white shadow-lg shadow-black/5">
            <button onClick={() => setOpen(open === faq.slug ? null : faq.slug)} className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6">
              <span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-burgundy">{faq.category}</span>
                <span className="block font-serif text-xl text-forest sm:text-2xl">{faq.question}</span>
              </span>
              <ChevronDown className={cx("h-5 w-5 transition", open === faq.slug && "rotate-180")} />
            </button>
            <AnimatePresence>
              {open === faq.slug ? (
                <motion.p className="px-6 pb-6 leading-8 text-ink/70" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  {faq.answer}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

function GroupedFaqPage({ faqs, images }: { faqs: Faq[]; images: ImageAsset[] }) {
  const publishedFaqs = faqs.filter((faq) => faq.status !== "draft").sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const groups = Array.from(new Set(publishedFaqs.map((faq) => faq.category)));

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <ImageRibbon images={images} />
      <div className="mt-14 grid gap-8">
        {groups.map((group) => (
          <FaqGroup key={group} title={group} faqs={publishedFaqs.filter((faq) => faq.category === group)} />
        ))}
      </div>
      <div className="mt-14 rounded-[2rem] bg-white p-6 text-center shadow-xl shadow-black/5 sm:p-10">
        <PawPrint className="mx-auto h-9 w-9 text-coral" />
        <h2 className="mt-4 font-serif text-[1.85rem] text-forest sm:text-4xl">Still have questions?</h2>
        <p className="mx-auto mt-3 max-w-2xl leading-8 text-ink/65">Send us a note or start a booking request and the DTdogs team will help confirm the right next step.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/contact" variant="outline">Contact Us</Button>
          <Button href="/booking">Book Now</Button>
        </div>
      </div>
    </section>
  );
}

function FaqGroup({ title, faqs }: { title: string; faqs: Faq[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.slug ?? null);

  return (
    <div className="rounded-[2rem] bg-white/70 p-4 shadow-xl shadow-black/5 sm:p-6">
      <h2 className="font-serif text-[1.75rem] text-forest sm:text-5xl">{title}</h2>
      <div className="mt-6 grid gap-3">
        {faqs.map((faq) => {
          const id = `faq-panel-${faq.slug}`;
          const expanded = open === faq.slug;
          return (
            <div key={faq.slug} className="rounded-[1.5rem] bg-cream">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={id}
                onClick={() => setOpen(expanded ? null : faq.slug)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-serif text-xl text-forest sm:text-2xl">{faq.question}</span>
                <ChevronDown className={cx("h-5 w-5 shrink-0 text-burgundy transition", expanded && "rotate-180")} />
              </button>
              <AnimatePresence>
                {expanded ? (
                  <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="px-5 pb-5 leading-8 text-ink/70">{faq.answer}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildWeekDays(from = new Date()) {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function buildTimeSlots() {
  const slots: string[] = [];
  for (let minutes = 7 * 60; minutes <= 21 * 60; minutes += 30) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return slots;
}

const BOOKING_TIME_SLOTS = buildTimeSlots();

function formatDayKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" });
}

function formatSlotLabel(slot: string) {
  const [h, m] = slot.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function BookingCalendar({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  required,
}: {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  required?: boolean;
}) {
  const days = useMemo(() => buildWeekDays(), []);

  return (
    <div className="md:col-span-2">
      <input type="hidden" name="preferredDate" value={selectedDate} required={required} />
      <input type="hidden" name="preferredTime" value={selectedTime} required={required} />
      <p className="text-sm font-bold text-ink/70">Choose a day (next 7 days)</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((day) => {
          const key = formatDayKey(day);
          const active = selectedDate === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onDateChange(key)}
              className={cx(
                "rounded-2xl border px-2 py-3 text-center transition",
                active ? "btn-gradient border-transparent text-white shadow-lg shadow-coral/30" : "border-forest/10 bg-cream text-ink hover:border-coral/50",
              )}
            >
              <span className="block text-[10px] font-semibold tracking-wide opacity-70">{day.toLocaleDateString("en-CA", { weekday: "short" })}</span>
              <span className="mt-1 block font-serif text-lg leading-none">{day.getDate()}</span>
              <span className="mt-1 block text-[10px] opacity-70">{day.toLocaleDateString("en-CA", { month: "short" })}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm font-bold text-ink/70">
        30-minute slots · 7:00 AM – 9:00 PM{selectedDate ? ` · ${formatDayLabel(new Date(`${selectedDate}T12:00:00`))}` : ""}
      </p>
      <div className="mt-3 grid max-h-64 grid-cols-3 gap-2 overflow-y-auto rounded-[1.25rem] border border-forest/10 bg-cream/60 p-3 sm:grid-cols-4 md:grid-cols-5">
        {BOOKING_TIME_SLOTS.map((slot) => {
          const active = selectedTime === slot;
          return (
            <button
              key={slot}
              type="button"
              disabled={!selectedDate}
              onClick={() => onTimeChange(slot)}
              className={cx(
                "rounded-xl px-2 py-2.5 text-xs font-bold transition sm:text-sm",
                !selectedDate && "cursor-not-allowed opacity-40",
                active ? "btn-gradient text-white shadow-md shadow-coral/30" : "bg-white text-forest hover:bg-sage",
              )}
            >
              {formatSlotLabel(slot)}
            </button>
          );
        })}
      </div>
      {!selectedDate || !selectedTime ? (
        <p className="mt-3 text-xs text-burgundy/80">Select a day and a 30-minute time slot to continue.</p>
      ) : (
        <p className="mt-3 text-xs text-forest/70">
          Selected: {formatDayLabel(new Date(`${selectedDate}T12:00:00`))} at {formatSlotLabel(selectedTime)}
        </p>
      )}
    </div>
  );
}

function BookingForm({ services }: { services: Service[] }) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const steps = ["Service Selection", "Pet & Hooman", "Date & Time", "Contact", "Pet Details", "Checkout / Deposit", "Confirmation"];
  const bookableServices = useMemo(() => services.filter((service) => service.status !== "coming-soon"), [services]);

  const resolveServiceSlug = (value: string | null) => {
    if (!value) return bookableServices[0]?.slug ?? "";
    const bySlug = bookableServices.find((service) => service.slug === value);
    if (bySlug) return bySlug.slug;
    const byName = bookableServices.find((service) => service.name === value);
    return byName?.slug ?? bookableServices[0]?.slug ?? "";
  };

  const [selectedServiceSlug, setSelectedServiceSlug] = useState(() => resolveServiceSlug(searchParams.get("service")));
  const [includeAddon, setIncludeAddon] = useState(searchParams.get("addon") === "1");
  const [sizeLabel, setSizeLabel] = useState(searchParams.get("size") ?? "");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  const selectedService = bookableServices.find((service) => service.slug === selectedServiceSlug);

  useEffect(() => {
    const fromQuery = searchParams.get("service");
    if (fromQuery) setSelectedServiceSlug(resolveServiceSlug(fromQuery));
    if (searchParams.get("addon") === "1") setIncludeAddon(true);
    const size = searchParams.get("size");
    if (size) setSizeLabel(size);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once from query string
  }, [searchParams]);

  useEffect(() => {
    if (!selectedService?.priceTiers?.length) {
      setSizeLabel("");
      return;
    }
    if (!selectedService.priceTiers.some((tier) => tier.label === sizeLabel)) {
      setSizeLabel(selectedService.priceTiers[0].label);
    }
  }, [selectedService, sizeLabel]);

  const basePrice = getServiceBasePrice(selectedService, sizeLabel);
  const total = basePrice === null ? null : basePrice + (includeAddon ? serviceAddOn.priceAmount : 0);
  const packageSelection = [sizeLabel ? `Size: ${sizeLabel}` : null, includeAddon ? `Add-On (+${serviceAddOn.priceLabel})` : "No add-on"].filter(Boolean).join(" · ");
  const bookingServiceLabel = selectedService
    ? serviceBookingLabel(selectedService, bookableServices)
    : "";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Submitting...");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        service: bookingServiceLabel,
        packageSelection,
        addonSelected: includeAddon,
        estimatedTotal: total === null ? selectedService?.priceLabel ?? "" : formatMoney(total),
        policyAgreement: data.policyAgreement === "on",
      }),
    });
    setStatus(response.ok ? "Booking request received. We will contact you soon." : "Something went wrong. Please review the form and try again.");
    if (response.ok) form.reset();
  }

  return (
    <section id="booking-form" className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <Reveal from="up">
      <form
        onSubmit={(event) => {
          if (step === 2 && (!preferredDate || !preferredTime)) {
            event.preventDefault();
            setStatus("Please choose a date and 30-minute time slot.");
            return;
          }
          void submit(event);
        }}
        className="tech-panel rounded-[1.75rem] p-3.5 shadow-2xl shadow-black/10 sm:rounded-[2rem] sm:p-5 md:rounded-[2.5rem] md:p-8"
      >
        <input type="hidden" name="service" value={bookingServiceLabel} />
        <input type="hidden" name="packageSelection" value={packageSelection} />
        <input type="hidden" name="addonSelected" value={includeAddon ? "true" : "false"} />
        <input type="hidden" name="estimatedTotal" value={total === null ? selectedService?.priceLabel ?? "" : formatMoney(total)} />

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {steps.map((label, index) => (
            <button key={label} type="button" onClick={() => setStep(index)} className={cx("shrink-0 rounded-full px-3.5 py-2.5 text-xs font-bold sm:px-4 sm:py-3 sm:text-sm", step === index ? "btn-gradient text-white shadow-md shadow-coral/25" : "bg-sage text-ink")}>
              <span className="sm:hidden">{index + 1}</span>
              <span className="hidden sm:inline">{index + 1}. {label}</span>
            </button>
          ))}
        </div>
        <div className="mb-5 rounded-[1.5rem] bg-cream p-4 lg:hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-burgundy">Booking summary</p>
              <p className="mt-1 truncate font-serif text-lg text-forest">{bookingServiceLabel || "Select a service"}</p>
              <p className="mt-0.5 text-xs text-ink/55">{sizeLabel ? `Size: ${sizeLabel}` : selectedService?.duration ?? ""}</p>
            </div>
            <p className="shrink-0 font-serif text-2xl font-bold text-burgundy">{total === null ? selectedService?.priceLabel ?? "Quote" : formatMoney(total)}</p>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[16rem_1fr_18rem]">
          <aside className="hidden rounded-[2rem] bg-forest p-4 text-white lg:block">
            {steps.map((label, index) => (
              <button key={label} type="button" onClick={() => setStep(index)} className={cx("mb-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm", step === index ? "btn-gradient text-white shadow-md shadow-coral/25" : index < step ? "bg-white/10 text-white" : "text-white/55")}>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 text-xs">{index < step ? "✓" : index + 1}</span>
                {label}
              </button>
            ))}
          </aside>

          <div className="grid gap-5 md:grid-cols-2">
            <div className={cx(step === 0 ? "contents" : "hidden")}>
              <div className="md:col-span-2">
                <h3 className="font-serif text-2xl text-forest sm:text-3xl">Choose a service</h3>
                <p className="mt-2 text-sm text-ink/60">Select your care option, then optionally add the +{serviceAddOn.priceLabel} add-on.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:col-span-2">
                {bookableServices.map((service) => {
                  const thumb = servicePrimaryImage(service);
                  const active = selectedServiceSlug === service.slug;
                  return (
                    <label
                      key={service.slug}
                      className={cx(
                        "flex cursor-pointer gap-3 rounded-[1.25rem] border p-3 transition",
                        active ? "border-coral bg-peach/25 shadow-md shadow-coral/20 ring-2 ring-coral/40" : "border-forest/10 bg-cream hover:border-coral/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="serviceRadio"
                        className="mt-1 accent-[#e89373]"
                        checked={active}
                        onChange={() => setSelectedServiceSlug(service.slug)}
                      />
                      <Image className="h-16 w-20 shrink-0 rounded-xl object-cover" {...imageProps(thumb, "80px")} alt={thumb.alt} />
                      <span className="min-w-0">
                        <span className="block font-serif text-lg leading-tight text-forest">{serviceBookingLabel(service, bookableServices)}</span>
                        <span className="mt-1 block text-xs text-ink/55">{service.duration ?? "Timing confirmed at booking"}{service.priceLabel ? ` · ${service.priceLabel}` : ""}</span>
                      </span>
                    </label>
                  );
                })}
              </div>

              {selectedService?.priceTiers?.length ? (
                <div className="md:col-span-2">
                  <p className="text-sm font-bold text-ink/70">Dog size</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedService.priceTiers.map((tier) => (
                      <button key={tier.label} type="button" onClick={() => setSizeLabel(tier.label)} className={cx("rounded-full px-4 py-2 text-sm font-bold transition", sizeLabel === tier.label ? "btn-gradient text-white shadow-md shadow-coral/25" : "bg-sage text-ink hover:bg-peach/50")}>
                        {tier.label} · {tier.priceLabel}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <label className="flex cursor-pointer items-start gap-3 rounded-[1.5rem] border border-forest/10 bg-cream p-4 md:col-span-2">
                <input type="checkbox" checked={includeAddon} onChange={(event) => setIncludeAddon(event.target.checked)} className="mt-1 h-4 w-4 accent-burgundy" />
                <span>
                  <span className="block font-bold text-forest">Include {serviceAddOn.name} (+{serviceAddOn.priceLabel} / {serviceAddOn.duration})</span>
                  <span className="mt-1 block text-sm leading-6 text-ink/65">{serviceAddOn.description}</span>
                </span>
              </label>

              <div className="rounded-[1.5rem] bg-sage/60 p-5 md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-burgundy">Live total</p>
                <p className="mt-2 font-serif text-3xl text-forest sm:text-4xl">{total === null ? selectedService?.priceLabel ?? "Request quote" : formatMoney(total)}</p>
                <p className="mt-2 text-sm text-ink/60">Service {basePrice === null ? selectedService?.priceLabel ?? "—" : formatMoney(basePrice)}{includeAddon ? ` + Add-on ${formatMoney(serviceAddOn.priceAmount)}` : ""}</p>
              </div>
            </div>
            <div className={cx(step === 1 ? "contents" : "hidden")}>
              <div className="md:col-span-2">
                <h3 className="font-serif text-3xl text-forest">Pet & Hooman</h3>
                <p className="mt-2 text-sm text-ink/60">Tell us who the booking is for.</p>
              </div>
              <Field label="Customer name" name="customerName" required={step === 1} />
              <Field label="Pet name" name="petName" required={step === 1} />
              <Field label="Pet type" name="petType" required={step === 1} />
              <Field label="Breed" name="breed" />
              <Field label="Age" name="age" />
              <Field label="Weight" name="weight" />
              <Field label="Sex" name="sex" as="select" options={["Female", "Male", "Prefer not to say"]} />
              <Field label="Spayed or neutered status" name="spayNeuterStatus" as="select" options={["Yes", "No", "Not applicable", "Prefer to discuss"]} />
              <Field label="Temperament" name="temperament" textarea />
              <Field label="Special needs" name="specialNeeds" textarea />
              <Field label="Vaccination status" name="vaccinationStatus" as="select" options={["Current", "Pending update", "Unsure", "Will upload records"]} />
            </div>
            <div className={cx(step === 2 ? "contents" : "hidden")}>
              <div className="md:col-span-2">
                <h3 className="font-serif text-2xl text-forest sm:text-3xl">Pick a date & time</h3>
                <p className="mt-2 text-sm text-ink/60">Choose an available appointment slot that works for you — 30-minute intervals from 7:00 AM to 9:00 PM.</p>
              </div>
              <BookingCalendar
                selectedDate={preferredDate}
                selectedTime={preferredTime}
                onDateChange={setPreferredDate}
                onTimeChange={setPreferredTime}
                required={step === 2}
              />
              <Field label="Pickup time (optional)" name="pickupTime" type="time" />
              <Field label="Drop-off time (optional)" name="dropoffTime" type="time" />
              <Field label="Optional shuttle" name="shuttleRequested" as="select" options={["No", "Yes, please quote shuttle service"]} />
              <Field label="Unavailable date note" name="blackoutNote" textarea />
            </div>
            <div className={cx(step === 3 ? "contents" : "hidden")}>
              <Field label="Full name" name="fullName" />
              <Field label="Email" name="email" type="email" required={step === 3} />
              <Field label="Phone" name="phone" required={step === 3} />
              <Field label="Address" name="address" />
              <Field label="Preferred contact method" name="preferredContact" as="select" options={["Email", "Phone", "WhatsApp"]} />
              <Field label="Emergency contact" name="emergencyContact" />
            </div>
            <div className={cx(step === 4 ? "contents" : "hidden")}>
              <Field label="Feeding instructions" name="feedingInstructions" textarea />
              <Field label="Medication" name="medicalDetails" textarea />
              <Field label="Allergies" name="allergies" textarea />
              <Field label="Veterinarian information" name="veterinarian" />
              <Field label="Behavioural notes" name="behaviouralNotes" textarea />
              <Field label="Care instructions" name="notes" textarea />
              <Field label="Vaccination record upload note" name="vaccinationUploadNote" textarea />
              <label className="flex gap-3 text-sm md:col-span-2">
                <input name="policyAgreement" type="checkbox" required={step === 4} className="mt-1" />
                I agree to the intake, cancellation and care policies as confirmed by DTdogs.ca.
              </label>
            </div>
            <div className={cx("md:col-span-2", step === 5 ? "block" : "hidden")}>
              <div className="rounded-[2rem] bg-sage/70 p-6">
                <h3 className="font-serif text-2xl text-forest sm:text-3xl">Checkout / Deposit</h3>
                <p className="mt-3 leading-7 text-ink/70">Estimated total: <strong>{total === null ? selectedService?.priceLabel ?? "Quote on confirmation" : formatMoney(total)}</strong>{includeAddon ? ` (includes ${serviceAddOn.priceLabel} add-on)` : ""}. Payments stay pending until confirmation.</p>
                <div className="mt-4 rounded-[1.25rem] bg-white/70 p-4">
                  <PaymentLogos light />
                </div>
                <Field label="Gift card code" name="giftCardCode" />
                <Field label="Payment note" name="paymentNote" textarea />
              </div>
            </div>
            <div className={cx("md:col-span-2", step === 6 ? "block" : "hidden")}>
              <div className="rounded-[2rem] bg-sage/70 p-6">
                <h3 className="font-serif text-2xl text-forest sm:text-3xl">Confirmation</h3>
                <p className="mt-3 leading-7 text-ink/70">Submit to create a booking reference in the admin portal. Email confirmation sends only when Resend is configured.</p>
              </div>
            </div>
          </div>

          <aside className="hidden h-fit rounded-[2rem] bg-cream p-5 shadow-inner lg:block">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-burgundy">Booking summary</p>
            <h3 className="mt-3 font-serif text-2xl text-forest">{bookingServiceLabel || "Select a service"}</h3>
            <p className="mt-2 text-sm text-ink/60">{selectedService?.duration ?? "Duration confirmed at booking"}</p>
            <div className="mt-5 space-y-2 border-t border-forest/10 pt-4 text-sm">
              <div className="flex justify-between gap-3"><span>Service</span><span className="font-semibold">{basePrice === null ? selectedService?.priceLabel ?? "—" : formatMoney(basePrice)}</span></div>
              <div className="flex justify-between gap-3"><span>Add-on</span><span className="font-semibold">{includeAddon ? formatMoney(serviceAddOn.priceAmount) : "$0"}</span></div>
              <div className="flex justify-between gap-3 border-t border-forest/10 pt-3 text-base font-bold text-forest"><span>Total</span><span>{total === null ? selectedService?.priceLabel ?? "Quote" : formatMoney(total)}</span></div>
            </div>
            <p className="mt-4 text-xs leading-6 text-ink/55">Final confirmation remains admin-controlled for capacity and timing.</p>
          </aside>
        </div>
        <div className="mt-8 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => setStep(Math.max(0, step - 1))} className="rounded-full border border-forest/20 px-5 py-3 font-bold">Back</button>
            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 2 && (!preferredDate || !preferredTime)) {
                    setStatus("Please choose a date and 30-minute time slot.");
                    return;
                  }
                  setStatus(null);
                  setStep(Math.min(steps.length - 1, step + 1));
                }}
                className="btn-gradient rounded-full px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-burgundy/25"
              >
                <span className="relative z-10">Continue</span>
              </button>
            ) : (
              <button type="submit" className="btn-gradient rounded-full px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-burgundy/25"><span className="relative z-10">Submit Booking Request</span></button>
            )}
          </div>
          {status ? <p className="font-semibold text-burgundy">{status}</p> : null}
        </div>
      </form>
      </Reveal>
    </section>
  );
}

function Field({ label, name, type = "text", required, textarea, as, options }: { label: string; name: string; type?: string; required?: boolean; textarea?: boolean; as?: "select"; options?: string[] }) {
  const className = "mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-base outline-none ring-forest/20 transition focus:ring-4";
  return (
    <label className="block text-sm font-bold text-ink/70">
      {label}
      {as === "select" ? (
        <select name={name} required={required} className={className} defaultValue="">
          <option value="" disabled>Choose</option>
          {options?.map((option, index) => <option key={`${name}-${option}-${index}`}>{option}</option>)}
        </select>
      ) : textarea ? (
        <textarea name={name} required={required} className={cx(className, "min-h-32")} />
      ) : (
        <input name={name} type={type} required={required} className={className} />
      )}
    </label>
  );
}

function uniqueOptions(options: string[]) {
  return Array.from(new Set(options.filter(Boolean)));
}

function serviceBookingLabel(service: Service, all: Service[]) {
  const duplicateName = all.filter((item) => item.name === service.name).length > 1;
  if (duplicateName && service.duration) {
    return `${service.name} (${service.duration})`;
  }
  return service.name;
}

function BlogGrid({ posts, title = "Latest from The Paw Journal" }: { posts: BlogPost[]; title?: string }) {
  const directions = ["left", "right"] as const;
  return (
    <section id="posts" className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <Reveal from="up">
        <SectionHeading eyebrow="Journal" title={title} />
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {posts.map((post, index) => (
          <Reveal key={post.slug} from={directions[index % directions.length]} delay={index * 0.1}>
            <Link href={`/blog/${post.slug}`} className="group block h-full overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-burgundy/15">
              <div className="relative overflow-hidden">
                <Image className="h-64 w-full object-cover transition duration-700 group-hover:scale-110 sm:h-80" {...imageProps(post.featuredImage)} alt={post.featuredImage.alt} />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <div className="p-5 sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-burgundy">{post.category}</p>
                <h2 className="mt-3 font-serif text-3xl text-forest sm:text-4xl">{post.title}</h2>
                <p className="mt-3 leading-7 text-ink/65">{post.excerpt}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProductGrid({ products, merchLayout = false }: { products: Product[]; merchLayout?: boolean }) {
  if (merchLayout) {
    const merch = products.filter((product) => !product.slug.includes("gift-card"));
    const giftCards = products.filter((product) => product.slug.includes("gift-card"));

    return (
      <>
        <section id="products" className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-16">
          <div className="grid gap-12 md:gap-16">
            {merch.map((product, index) => {
              const primaryImage = productImages(product)[0];
              const imageFirst = index % 2 === 0;
              return (
                <Reveal key={product.slug} from={imageFirst ? "left" : "right"} delay={index * 0.08}>
                  <Link
                    href={`/shop/${product.slug}`}
                    className="group grid items-center gap-8 overflow-hidden rounded-[2rem] bg-white p-4 shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-burgundy/10 sm:p-6 lg:grid-cols-2 lg:gap-12"
                  >
                    <div className={cx("overflow-hidden rounded-[1.5rem]", !imageFirst && "lg:order-2")}>
                      <Image
                        className="h-72 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[28rem]"
                        {...imageProps(primaryImage, "(min-width: 1024px) 50vw, 100vw")}
                        alt={primaryImage.alt}
                      />
                    </div>
                    <div className={cx("px-2 sm:px-4", !imageFirst && "lg:order-1")}>
                      <h2 className="font-serif text-[2rem] leading-tight text-forest transition-colors duration-300 group-hover:text-burgundy sm:text-5xl md:text-6xl">
                        {product.title}
                      </h2>
                      <p className="mt-3 text-base font-medium text-ink/55 sm:text-lg">{product.description}</p>
                      <div className="mt-5 flex flex-wrap items-end gap-3 sm:mt-6">
                        {product.compareAtPriceLabel ? (
                          <span className="font-serif text-xl text-ink/35 line-through sm:text-3xl">{product.compareAtPriceLabel}</span>
                        ) : null}
                        <span className="font-serif text-3xl font-bold text-burgundy sm:text-5xl">{product.priceLabel}</span>
                      </div>
                      {product.status === "coming-soon" ? (
                        <span className="mt-6 inline-flex rounded-full bg-sage px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-forest">
                          Coming Soon
                        </span>
                      ) : null}
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {giftCards.length ? (
          <section id="gift-cards" className="mx-auto max-w-7xl px-4 pb-14 md:px-8 md:pb-20">
            <Reveal from="up">
              <SectionHeading eyebrow="Gift cards" title="Digital gifts for calm, professional pet care." />
            </Reveal>
            <div className="mx-auto mt-10 grid max-w-xl gap-6">
              {giftCards.map((product, index) => {
                const primaryImage = productImages(product)[0];
                return (
                  <Reveal key={product.slug} from={index % 2 === 0 ? "left" : "right"} delay={index * 0.1}>
                    <Link
                      href="/gift-cards#gift-card-form"
                      className="group block h-full overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-burgundy/15"
                    >
                      <div className="relative overflow-hidden">
                        <Image
                          className="h-72 w-full object-cover transition duration-700 group-hover:scale-110 sm:h-96"
                          {...imageProps(primaryImage)}
                          alt={primaryImage.alt}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </div>
                      <div className="p-5 sm:p-7">
                        <h2 className="font-serif text-3xl text-forest transition-colors duration-300 group-hover:text-burgundy sm:text-4xl">
                          {product.title}
                        </h2>
                        <p className="mt-3 text-ink/65">{product.description}</p>
                        <p className="mt-4 bg-gradient-to-r from-burgundy to-coral bg-clip-text font-bold text-transparent">
                          {product.priceLabel}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-forest/70">Buy multiple · digital delivery</p>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </section>
        ) : null}
      </>
    );
  }

  const directions = ["left", "right"] as const;
  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="grid gap-6 md:grid-cols-2">
        {products.map((product, index) => {
          const primaryImage = productImages(product)[0];
          return (
          <Reveal key={product.slug} from={directions[index % directions.length]} delay={index * 0.1}>
          <Link href={`/shop/${product.slug}`} className="group block h-full overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-burgundy/15">
            <div className="relative overflow-hidden">
              <Image className="h-80 w-full object-cover transition duration-700 group-hover:scale-110 sm:h-[32rem]" {...imageProps(primaryImage)} alt={primaryImage.alt} />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <div className="p-5 sm:p-7">
              <h2 className="font-serif text-3xl text-forest transition-colors duration-300 group-hover:text-burgundy sm:text-4xl">{product.title}</h2>
              <p className="mt-3 text-ink/65">{product.description}</p>
              <div className="mt-4 flex flex-wrap items-end gap-3">
                {product.compareAtPriceLabel ? (
                  <span className="text-ink/35 line-through">{product.compareAtPriceLabel}</span>
                ) : null}
                <p className="bg-gradient-to-r from-burgundy to-coral bg-clip-text font-bold text-transparent">{product.priceLabel}</p>
              </div>
            </div>
          </Link>
          </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function GiftCardForm() {
  const [status, setStatus] = useState("");
  const [quantity, setQuantity] = useState(1);
  const unitPrice = 150;
  const total = unitPrice * quantity;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving gift card request...");
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/gift-cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, denomination: "CAD $150", quantity }),
    });
    setStatus(response.ok ? "Gift card request saved. Payment is pending until checkout is configured." : "Unable to save gift card request.");
    if (response.ok) {
      event.currentTarget.reset();
      setQuantity(1);
    }
  }

  return (
    <section id="gift-card-form" className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
      <Reveal from="up">
      <form onSubmit={submit} className="grid gap-5 rounded-[2rem] bg-white p-5 shadow-xl shadow-black/5 md:grid-cols-2 md:p-8">
        <div className="md:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">Gift Card Purchase</p>
          <h2 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">CAD $150 digital gift cards — buy as many as you need.</h2>
          <p className="mt-3 leading-8 text-ink/65">One price point only. Choose your quantity below. Requests save as Payment Pending until payment credentials are configured.</p>
        </div>
        <div className="rounded-2xl border border-forest/15 bg-cream p-4 md:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold text-ink/70">Denomination</p>
              <p className="mt-1 font-serif text-3xl text-forest">CAD $150</p>
              <p className="mt-1 text-sm text-ink/55">Fixed gift card value · digital delivery</p>
            </div>
            <label className="block text-sm font-bold text-ink/70">
              Quantity
              <input
                name="quantity"
                type="number"
                min={1}
                max={50}
                required
                value={quantity}
                onChange={(event) => setQuantity(Math.max(1, Math.min(50, Number(event.target.value) || 1)))}
                className="mt-2 w-full rounded-2xl border border-forest/15 bg-white px-4 py-3 text-base outline-none ring-forest/20 transition focus:ring-4 sm:w-28"
              />
            </label>
            <div className="sm:text-right">
              <p className="text-sm font-bold text-ink/70">Estimated total</p>
              <p className="mt-1 font-serif text-3xl font-bold text-burgundy">CAD ${total}</p>
            </div>
          </div>
        </div>
        <Field label="Delivery date" name="deliveryDate" type="date" />
        <div className="hidden md:block" />
        <Field label="Recipient name" name="recipientName" required />
        <Field label="Recipient email" name="recipientEmail" type="email" required />
        <Field label="Sender name" name="senderName" required />
        <Field label="Sender email" name="senderEmail" type="email" required />
        <div className="md:col-span-2">
          <Field label="Gift message" name="message" textarea />
        </div>
        <button className="btn-gradient rounded-full px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-burgundy/25 md:col-span-2"><span className="relative z-10">Save Gift Card Request</span></button>
        {status ? <p className="font-semibold text-burgundy md:col-span-2">{status}</p> : null}
      </form>
      </Reveal>
    </section>
  );
}

function TeamGrid({ team }: { team: TeamMember[] }) {
  const directions = ["left", "up", "right"] as const;
  return (
    <section id="team" className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <Reveal from="up">
        <SectionHeading eyebrow="Our Team" title="Experienced hands, calm energy, genuine care." />
        <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-7 text-ink/70 sm:text-base sm:leading-8">
          Meet our trusted partners in pet care across the GTA — professionals who bring genuine care and expertise to every interaction.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {team.map((member, index) => (
          <Reveal key={member.slug} from={directions[index % directions.length]} delay={index * 0.1}>
            <article className="group h-full rounded-[2rem] bg-white p-5 shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-burgundy/15 sm:p-7">
              <div className="mb-6 h-1.5 w-16 rounded-full bg-gradient-to-r from-coral to-burgundy transition-all duration-500 group-hover:w-28" />
              <div className="p-5 sm:p-7">
                <h2 className="font-serif text-3xl text-forest sm:text-4xl">{member.name}</h2>
                <p className="mt-1 font-bold text-burgundy">{member.role}</p>
                <p className="mt-4 leading-7 text-ink/65">{member.bio}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {member.credentials.map((credential) => <span key={credential} className="rounded-full bg-sage px-3 py-1 text-xs">{credential}</span>)}
                </div>
                {member.instagram ? (
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-burgundy hover:underline">
                    @{member.instagram.split('/').filter(Boolean).pop()}
                  </a>
                ) : null}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ReviewImageSlider() {
  const total = 22;
  const images = Array.from({ length: total }, (_, i) => `/images/reviews/${i + 1}.png`);
  const [current, setCurrent] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % total), 3500);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <section className="relative overflow-hidden bg-cream py-14 md:py-20">
      <div className="animate-float pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-coral/10 to-transparent blur-3xl" />
      <div className="animate-float-delayed pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-gradient-to-tl from-burgundy/10 to-transparent blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-4 md:px-8">
        <Reveal from="up">
          <SectionHeading eyebrow="Trusted care" title="We are a team of #petpeople and #petparents." />
        </Reveal>

        <div className="relative mt-12">
          {/* Slides */}
          <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-black/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={images[current]}
                  alt={`Client review ${current + 1}`}
                  width={900}
                  height={600}
                  className="w-full object-contain"
                  priority={current === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev / Next arrows */}
          <button
            onClick={prev}
            className="absolute -left-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white shadow-lg transition hover:bg-sage sm:-left-6"
            aria-label="Previous review"
          >
            <ChevronDown className="h-5 w-5 rotate-90 text-forest" />
          </button>
          <button
            onClick={next}
            className="absolute -right-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white shadow-lg transition hover:bg-sage sm:-right-6"
            aria-label="Next review"
          >
            <ChevronDown className="h-5 w-5 -rotate-90 text-forest" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-6 flex flex-wrap justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cx("h-2 rounded-full transition-all duration-300", i === current ? "w-6 bg-coral" : "w-2 bg-forest/20")}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <p className="mt-3 text-center text-xs text-ink/45">{current + 1} / {total}</p>

        {/* Book Now CTA */}
        <Reveal from="up" delay={0.1}>
          <div className="mt-8 flex justify-center">
            <Link
              href="/services/meet-and-greet"
              className="btn-gradient group inline-flex items-center gap-2 rounded-full py-2 pl-6 pr-2 font-bold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              Book Now
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-burgundy transition group-hover:scale-110">
                <PawPrint className="h-5 w-5" />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TestimonialsSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const published = testimonials.filter((t) => t.status !== "draft" && !t.sample);
  const items = published.length ? published : testimonials.slice(0, 6);
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || items.length <= 1) return;
    const timer = setInterval(() => setActive((prev) => (prev + 1) % items.length), 4500);
    return () => clearInterval(timer);
  }, [items.length, reducedMotion]);

  return (
    <section className="relative overflow-hidden bg-cream py-14 md:py-20">
      <div className="animate-float pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-coral/10 to-transparent blur-3xl" />
      <div className="animate-float-delayed pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-gradient-to-tl from-burgundy/10 to-transparent blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <Reveal from="up">
          <SectionHeading eyebrow="What pet parents say" title="Trusted by families across the GTA." />
        </Reveal>

        {/* Slider */}
        <div className="relative mt-12 overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-[0.22,1,0.36,1]"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {items.map((t) => (
              <div key={t.slug} className="w-full shrink-0 px-2 sm:px-4">
                <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5 sm:p-10">
                  <p className="text-gradient text-xl">{"★".repeat(t.rating)}</p>
                  <p className="mt-5 font-serif text-xl leading-relaxed text-ink sm:text-2xl">{`"${t.quote}"`}</p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-coral to-burgundy text-sm font-bold text-white shadow-lg">
                      {t.reviewer.charAt(0)}
                    </span>
                    <div>
                      <p className="font-bold text-forest">{t.reviewer}</p>
                      <p className="text-xs text-ink/55">{t.petName} · {t.service}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          {items.length > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cx("h-2 rounded-full transition-all duration-300", i === active ? "w-8 bg-coral" : "w-2 bg-forest/25")}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Book Now CTA */}
        <Reveal from="up" delay={0.1}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/booking"
              className="btn-gradient group inline-flex items-center gap-2 rounded-full py-2 pl-6 pr-2 font-bold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              Book Now
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-burgundy transition group-hover:scale-110">
                <PawPrint className="h-5 w-5" />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TestimonialsPreview({ testimonials, full, embedded }: { testimonials: Testimonial[]; full?: boolean; embedded?: boolean }) {
  const items = full ? testimonials : testimonials.slice(0, 3);
  const directions = ["left", "up", "right"] as const;
  const published = items.filter((item) => item.status !== "draft");
  const list = published.length ? published : items;

  if (embedded) {
    return (
      <div>
        <Reveal from="up">
          <SectionHeading eyebrow="Trusted care" title="Pet parents should feel the care before they book." />
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {list.map((testimonial, index) => (
            <Reveal key={testimonial.slug} from={directions[index % directions.length]} delay={index * 0.1}>
              <article className="h-full rounded-[1.5rem] border border-forest/10 bg-cream p-4 transition duration-300 hover:border-coral/40 sm:p-5">
                <p className="text-sm text-coral">{"★".repeat(testimonial.rating)}</p>
                <p className="mt-2 text-sm leading-6 text-ink/75">{`"${testimonial.quote}"`}</p>
                <p className="mt-4 text-sm font-bold text-forest">{testimonial.reviewer}</p>
                <p className="text-xs text-ink/55">{testimonial.petName} · {testimonial.service}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-animated relative overflow-hidden py-12 text-white md:py-16">
      <div className="animate-float absolute -left-20 top-16 h-80 w-80 rounded-full bg-gradient-to-br from-coral/25 to-transparent blur-3xl" />
      <div className="animate-float-delayed absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-gradient-to-tl from-burgundy/30 to-transparent blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <Reveal from="up">
          <SectionHeading eyebrow="Trusted care" title="We are a team of #petpeople and #petparents." inverse />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {list.map((testimonial, index) => (
            <Reveal key={testimonial.slug} from={directions[index % directions.length]} delay={index * 0.12}>
              <article className="h-full rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/15 to-white/5 p-5 backdrop-blur transition duration-500 hover:-translate-y-2 hover:border-coral/40 hover:shadow-2xl hover:shadow-black/30 sm:p-6">
                <p className="text-gradient text-lg">{"★".repeat(testimonial.rating)}</p>
                <p className="mt-4 text-sm leading-7 text-white/80 sm:text-base sm:leading-8">{`"${testimonial.quote}"`}</p>
                <p className="mt-5 font-bold">{testimonial.reviewer}</p>
                <p className="text-sm text-white/60">{testimonial.petName} · {testimonial.service}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryPreview({ images }: { images: ImageAsset[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-24">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal from="left">
          <SectionHeading eyebrow="Gallery preview" title="A warm visual rhythm of walks, stays and care details." align="left" />
        </Reveal>
        <Reveal from="right" delay={0.1}>
          <Button href="/gallery" variant="outline">Open Gallery</Button>
        </Reveal>
      </div>
      <ImageRibbon images={images.slice(0, 10)} />
    </section>
  );
}

function ShopPreview({ products }: { products: Product[] }) {
  const merch = products.filter((product) => !product.slug.includes("gift-card")).slice(0, 2);
  return (
    <section className="bg-white py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal from="up">
          <SectionHeading eyebrow="Boutique preview" title="Dog Dad and Dog Mom merch — coming soon in 2026." />
        </Reveal>
        <div className="mt-12 grid gap-10">
          {merch.map((product, index) => {
            const imageFirst = index % 2 === 0;
            return (
              <Reveal key={product.slug} from={imageFirst ? "left" : "right"} delay={index * 0.12}>
                <Link
                  href={`/shop/${product.slug}`}
                  className="group grid items-center gap-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-cream to-peach/40 p-4 shadow-lg shadow-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-burgundy/15 sm:p-6 lg:grid-cols-2 lg:gap-10"
                >
                  <div className={cx("overflow-hidden rounded-[1.5rem]", !imageFirst && "lg:order-2")}>
                    <Image
                      className="h-64 w-full object-contain transition duration-700 group-hover:scale-105 sm:h-80"
                      {...imageProps(product.images[0])}
                      alt={product.images[0].alt}
                    />
                  </div>
                  <div className={cx("px-2 sm:px-4", !imageFirst && "lg:order-1")}>
                    <h3 className="font-serif text-3xl text-forest transition-colors duration-300 group-hover:text-burgundy sm:text-4xl md:text-5xl">
                      {product.title}
                    </h3>
                    <p className="mt-3 text-ink/60">{product.description}</p>
                    <div className="mt-5 flex flex-wrap items-end gap-3">
                      {product.compareAtPriceLabel ? (
                        <span className="font-serif text-xl text-ink/35 line-through sm:text-2xl">{product.compareAtPriceLabel}</span>
                      ) : null}
                      <span className="font-serif text-3xl font-bold text-burgundy sm:text-4xl">{product.priceLabel}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BrandMarquee({ dark }: { dark?: boolean }) {
  const words = ["Dog Daycare", "Overnight Boarding", "Dog Walking", "Grooming", "Pet Shuttle", "Calm Environments", "Certified Care", "Toronto & GTA"];
  const row = [...words, ...words];
  return (
    <div className={cx("relative overflow-hidden border-y py-5", dark ? "border-white/10 bg-ink" : "border-forest/10 bg-gradient-to-r from-cream via-peach/40 to-cream")}>
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
        {row.map((word, index) => (
          <span key={`${word}-${index}`} className="flex items-center gap-8">
            <span className={cx("font-serif text-2xl italic sm:text-3xl", dark ? "text-white/80" : "text-gradient-forest")}>{word}</span>
            <PawPrint className={cx("h-5 w-5", dark ? "text-coral" : "text-burgundy/60")} />
          </span>
        ))}
      </div>
    </div>
  );
}

function ProcessSection() {
  const steps = [
    { title: "Choose Your Service", body: "Browse our services and select the care your pet needs." },
    { title: "Pick a Date & Time", body: "Pick a date & time with your service provider and preferred location." },
    { title: "Confirm & Pay", body: "Secure your booking by completing the payment process online, in store or Interac." },
    { title: "You're All Set!", body: "Receive your confirmation and get ready for your pet's visit.", highlight: "Customers should expect text and email, either or both." },
  ];
  const directions = ["left", "up", "right", "down"] as const;
  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-sage/40 to-cream" />
      <div className="animate-float absolute right-0 top-10 h-72 w-72 rounded-full bg-gradient-to-bl from-coral/15 to-transparent blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <Reveal from="up">
          <SectionHeading eyebrow="How booking works" title="Four calm steps from hello to care." />
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map((step, index) => (
            <Reveal key={step.title} from={directions[index % directions.length]} delay={index * 0.1}>
              <div className="group relative h-full overflow-hidden rounded-[1.5rem] bg-white p-6 shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-burgundy/15 sm:rounded-[2rem] sm:p-7">
                <div className="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-0 bg-gradient-to-r from-coral to-burgundy transition-transform duration-500 group-hover:scale-x-100" />
                <span className="text-gradient font-serif text-4xl sm:text-5xl">0{index + 1}</span>
                <h3 className="mt-4 font-serif text-xl text-forest sm:text-2xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{step.body}</p>
                {step.highlight && <p className="mt-2 text-sm font-black leading-6 text-gradient">{step.highlight}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SunnyismSection() {
  return (
    <section className="relative overflow-hidden py-12 text-white md:py-16">
      <div className="bg-gradient-animated absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:px-8">
        <Reveal from="left">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/15 shadow-2xl sm:rounded-[2rem]">
            <Image className="h-72 w-full object-cover sm:h-[26rem]" {...imageProps(aboutStoryImages[0])} alt="Sunnyism.Pro #DogDad" />
          </div>
        </Reveal>
        <Reveal from="right" delay={0.1}>
          <p className="text-xs font-semibold tracking-wide text-peach sm:text-sm">Trusted care</p>
          <h2 className="mt-3 font-serif text-[1.75rem] leading-[1.12] tracking-tight sm:text-3xl md:text-4xl">
            Meet Sunnyism.Pro <span className="text-gradient italic">#DogDad</span>
          </h2>
          <p className="mt-2 text-sm text-white/70">Thoughts, vision, and the journey ahead.</p>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
            At Hand &amp; Paw, we offer structured services for pets of discerning pet owners. Our mission is simple: to provide safe and professional care that ensures a calm environment and comfort for your pets while you&apos;re away. Since 2021 we have built trust through consistent nurturing services for your pet&apos;s well-being in Greater Toronto area.
          </p>
          <div className="mt-7">
            <Button href="/our-vision" variant="light">Our Vision</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function BookingCTA({ image = homePage.storyImages[4] }: { image?: ImageAsset }) {
  return (
    <section className="relative overflow-hidden py-16 text-white md:py-24">
      <Image className="absolute inset-0 h-full w-full object-cover" {...imageProps(image, "100vw")} alt={image.alt} />
      <div className="bg-gradient-animated absolute inset-0 opacity-85" />
      <div className="animate-float absolute left-10 top-8 h-52 w-52 rounded-full bg-gradient-to-br from-coral/30 to-transparent blur-3xl" />
      <div className="animate-float-delayed absolute bottom-6 right-10 h-64 w-64 rounded-full bg-gradient-to-tl from-peach/25 to-transparent blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
        <motion.span
          className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-coral to-burgundy shadow-2xl shadow-coral/40"
          initial={{ scale: 0, rotate: -90 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <PawPrint className="h-8 w-8 text-white" />
        </motion.span>
        <Reveal from="up" delay={0.1}>
          <h2 className="font-serif text-[1.85rem] leading-tight tracking-tight sm:text-3xl md:text-4xl">
            Ready to join the <span className="text-gradient italic">DTdogs.ca</span>?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8">Tell us about your pet and we will help you choose the right care experience.</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/booking">Book Now</Button>
            <a href={`${brand.whatsapp}?text=${encodeURIComponent("Hi DTdogs.ca — I'd like to message about care.")}`} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20 sm:w-auto">
              Message us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactPanel() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-3">
      <Reveal from="left" delay={0}>
        <InfoCard icon={<Phone />} title="Phone" body={brand.phone} href={`tel:${brand.phone}`} />
      </Reveal>
      <Reveal from="up" delay={0.1}>
        <InfoCard icon={<CalendarDays />} title="Hours" body={`${brand.hours}. ${brand.boardingNote}`} />
      </Reveal>
      <Reveal from="right" delay={0.2}>
        <InfoCard icon={<PawPrint />} title="Email" body={brand.email} href={`mailto:${brand.email}`} />
      </Reveal>
    </section>
  );
}

function InfoCard({ icon, title, body, href }: { icon: React.ReactNode; title: string; body: string; href?: string }) {
  const content = (
    <div className="group h-full rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-burgundy/15 sm:p-8">
      <div className="mb-6 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-forest to-burgundy text-white shadow-lg shadow-forest/20 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">{icon}</div>
      <h2 className="text-gradient-forest font-serif text-3xl sm:text-4xl">{title}</h2>
      <p className="mt-3 leading-7 text-ink/65">{body}</p>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}

function ImageCollage({ images, dark }: { images: ImageAsset[]; dark?: boolean }) {
  return (
    <>
      <div className="grid gap-3 sm:hidden">
        <Image className="h-52 w-full rounded-[1.5rem] object-cover shadow-2xl" {...imageProps(images[0])} alt={images[0].alt} />
        <div className="grid grid-cols-2 gap-3">
          <Image className="h-36 w-full rounded-[1.25rem] object-cover shadow-xl" {...imageProps(images[1] ?? images[0])} alt={(images[1] ?? images[0]).alt} />
          <div className="relative">
            <Image className="h-36 w-full rounded-[1.25rem] object-cover shadow-xl" {...imageProps(images[2] ?? images[0])} alt={(images[2] ?? images[0]).alt} />
            <div className={cx("absolute inset-x-2 bottom-2 rounded-xl px-3 py-2 shadow-lg", dark ? "bg-white/95 text-ink" : "bg-forest/90 text-white")}>
              <p className={cx("font-serif text-sm leading-tight", dark && "text-gradient-forest")}>Calm care</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden min-h-[34rem] sm:block">
        <motion.div
          className="absolute left-8 top-0 h-80 w-[68%]"
          initial={{ opacity: 0, x: -48, y: 24, rotate: -2 }}
          whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image className="h-full w-full rounded-[3rem] object-cover shadow-2xl" {...imageProps(images[0])} alt={images[0].alt} />
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-0 h-72 w-[54%]"
          initial={{ opacity: 0, x: 48, y: 40 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image className="h-full w-full rounded-[2.5rem] object-cover shadow-2xl" {...imageProps(images[1] ?? images[0])} alt={(images[1] ?? images[0]).alt} />
        </motion.div>
        <motion.div
          className="animate-float absolute bottom-0 left-0 h-52 w-48"
          initial={{ opacity: 0, y: 56, scale: 0.75 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Image className="h-full w-full rounded-[2rem] border-8 border-cream object-cover shadow-2xl" {...imageProps(images[2] ?? images[0], "200px")} alt={(images[2] ?? images[0]).alt} />
        </motion.div>
        <motion.div
          className={cx("absolute right-8 top-12 rounded-[2rem] p-5 shadow-xl", dark ? "bg-gradient-to-br from-white to-peach/60 text-ink" : "bg-gradient-to-br from-forest to-burgundy text-white")}
          initial={{ opacity: 0, x: 40, y: -24 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <p className={cx("font-serif text-3xl", dark && "text-gradient-forest")}>Calm care</p>
          <p className="max-w-44 text-sm opacity-70">Safety, comfort and connection in every routine.</p>
        </motion.div>
      </div>
    </>
  );
}

function ImageRibbon({ images }: { images: ImageAsset[] }) {
  const directions = ["left", "up", "right", "down"] as const;
  return (
    <div className={cx("-mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:mx-0 sm:mt-12 sm:gap-5 sm:px-0", images.length <= 3 && "sm:justify-center")}>
      {images.map((image, index) => (
        <Reveal key={`${image.id}-${index}`} from={directions[index % directions.length]} delay={(index % 5) * 0.08} className="w-[78vw] max-w-sm shrink-0 snap-start sm:w-auto sm:min-w-[18rem]">
          <figure className="group overflow-hidden rounded-[1.5rem] bg-white shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-burgundy/15 sm:rounded-[2rem]">
            <div className="overflow-hidden">
              <Image className="h-52 w-full object-cover transition duration-700 group-hover:scale-110 sm:h-72" {...imageProps(image, "320px")} alt={image.alt} loading="lazy" />
            </div>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

function SectionHeading({ eyebrow, title, align = "center", inverse }: { eyebrow?: string; title: string; align?: "center" | "left"; inverse?: boolean }) {
  return (
    <div className={cx(align === "center" && "mx-auto text-center", "max-w-4xl")}>
      {eyebrow ? (
        <p className={cx("mb-3 inline-flex max-w-full flex-wrap items-center justify-center gap-2 text-xs font-semibold tracking-wide sm:mb-4 sm:gap-3 sm:text-sm", inverse ? "text-peach" : "text-burgundy", align === "left" && "justify-start")}>
          <span className={cx("hidden h-px w-8 sm:block", inverse ? "bg-gradient-to-r from-transparent to-peach" : "bg-gradient-to-r from-transparent to-burgundy")} />
          {eyebrow}
          <span className={cx("hidden h-px w-8 sm:block", inverse ? "bg-gradient-to-l from-transparent to-peach" : "bg-gradient-to-l from-transparent to-burgundy")} />
        </p>
      ) : null}
      <h2 className={cx("font-serif text-[1.5rem] leading-[1.12] tracking-tight sm:text-[1.75rem] md:text-[2rem] lg:text-[2.4rem]", inverse ? "text-white" : "text-gradient-forest")}>{title}</h2>
      <motion.div
        className={cx("mt-5 h-1 rounded-full bg-gradient-to-r from-coral via-burgundy to-forest sm:mt-6", align === "center" ? "mx-auto w-20 sm:w-24" : "w-20 sm:w-24")}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

function Button({
  href,
  children,
  variant = "solid",
  className,
  arrow = "right",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "light" | "outline";
  className?: string;
  arrow?: "right" | "down" | "none";
}) {
  const ArrowIcon = arrow === "down" ? ChevronDown : ArrowRight;
  return (
    <Link
      href={href}
      className={cx(
        "group/btn inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-center font-bold transition duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-95 sm:w-auto",
        variant === "solid" && "btn-gradient text-white shadow-lg shadow-burgundy/25 hover:shadow-2xl hover:shadow-coral/40",
        variant === "light" && "border border-white/30 bg-white/10 text-white backdrop-blur transition-colors hover:border-coral/60 hover:bg-white/20",
        variant === "outline" && "border border-forest/20 bg-transparent text-forest hover:border-transparent hover:bg-gradient-to-r hover:from-burgundy hover:to-coral hover:text-white hover:shadow-xl hover:shadow-burgundy/25",
        className,
      )}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {arrow !== "none" ? (
          <ArrowIcon
            className={cx(
              "h-4 w-4 transition-transform duration-300",
              arrow === "down" ? "group-hover/btn:translate-y-0.5" : "group-hover/btn:translate-x-1",
            )}
          />
        ) : null}
      </span>
    </Link>
  );
}

function InfoPill({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg shadow-black/5">
      <p className="text-xs font-semibold tracking-wide text-burgundy">{title}</p>
      <p className="mt-2 text-ink/70">{value}</p>
    </div>
  );
}

function revealOffset(from: "left" | "right" | "up" | "down" | "scale" = "up") {
  switch (from) {
    case "left":
      return { opacity: 0, x: -64, y: 0 };
    case "right":
      return { opacity: 0, x: 64, y: 0 };
    case "down":
      return { opacity: 0, x: 0, y: -48 };
    case "scale":
      return { opacity: 0, scale: 0.92, y: 24 };
    case "up":
    default:
      return { opacity: 0, x: 0, y: 48 };
  }
}

function PageEnter({ children, pageKey }: { children: React.ReactNode; pageKey: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      key={pageKey}
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Reveal({
  children,
  delay = 0,
  from = "up",
  once = true,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  from?: "left" | "right" | "up" | "down" | "scale";
  once?: boolean;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : revealOffset(from)}
      whileInView={reducedMotion ? undefined : { opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, margin: "-40px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Footer({ services }: { services: Service[] }) {
  const serviceLinks = services
    .filter((service) => service.status !== "coming-soon" && service.status !== "draft")
    .map((service) => ({ label: service.name, href: `/services/${service.slug}` }));

  return (
    <footer className="relative isolate overflow-hidden text-white">
      <Image
        src={FOOTER_BG_SRC}
        alt=""
        fill
        className="object-cover object-[72%_center] md:object-[80%_center]"
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/78 to-forest/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-forest/35" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(circle at 18% 40%, #e89373 0.7px, transparent 1.1px)", backgroundSize: "42px 42px" }} />

      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-14 md:px-8 md:pb-8 md:pt-20">
        <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            {/* Eyebrow */}
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-peach">
              <PawPrint className="h-3.5 w-3.5" /> Structured pet care · Downtown Toronto &amp; GTA
            </p>
            {/* Logo + Welcome heading */}
            <div className="flex items-center gap-4">
              <span className="relative grid h-24 w-24 shrink-0 place-items-center sm:h-28 sm:w-28">
                <Image src={LOGO_SRC} alt="DTdogs.ca" width={112} height={112} className="h-full w-full object-contain" />
              </span>
              <div>
                <p className="font-serif text-2xl leading-tight text-white sm:text-3xl">
                  Welcome to DT<span className="text-gradient">d</span>ogs.ca
                </p>
                <p className="mt-1 text-xs text-white/60">
                  (Formerly Known As{" "}
                  <a href="https://dtdogs.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white/90">Handandpaw.ca</a>
                  {" / "}
                  <a href="https://dtdogs.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white/90">Handandpaw.in</a>
                  )
                </p>
              </div>
            </div>
            {/* Description */}
            <p className="mt-5 max-w-md text-sm leading-7 text-white/85">
              Professional, structured pet care in Downtown Toronto, proudly serving the GTA year-round. We are a team of #petpeople and #petparents.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/booking"
              className="btn-gradient inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg shadow-coral/30 transition hover:-translate-y-0.5"
            >
              Book appointment <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`${brand.whatsapp}?text=${encodeURIComponent("Hi DTdogs.ca — I'd like to message about booking.")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/15 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/25"
            >
              Message us on WhatsApp
            </a>
          </div>
        </div>

        {/* Info strip */}
        <div className="mt-10 grid gap-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:p-5">
          {/* Business Hours */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-peach">
              <Clock className="h-3.5 w-3.5" /> Business Hours
            </p>
            <p className="text-sm text-white/85">Monday – Sunday</p>
            <p className="text-sm font-semibold text-white">7:00 AM – 9:00 PM</p>
            <p className="mt-2 text-xs text-white/60">{brand.boardingNote}</p>
          </div>

          {/* Payments */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-peach">
              <ShieldCheck className="h-3.5 w-3.5" /> Payments
            </p>
            <div className="flex flex-wrap gap-2">
              {["VISA", "Mastercard", "Amex", "Interac", "Gift Card"].map((m) => (
                <span key={m} className="rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/85">{m}</span>
              ))}
            </div>
            <p className="mt-2 text-xs text-white/55">Pay online, in store, or after confirmation.</p>
          </div>

          {/* Contact & Social */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-peach">
              <Mail className="h-3.5 w-3.5" /> Contact & Social
            </p>
            <div className="flex flex-col gap-2">
              <a href={brand.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white/85 transition hover:text-peach">
                <svg className="h-4 w-4 shrink-0 text-peach" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a href={`mailto:${brand.email}`} className="inline-flex items-center gap-2 text-sm text-white/85 transition hover:text-peach">
                <Mail className="h-4 w-4 shrink-0 text-peach" /> {brand.email}
              </a>
              <div className="mt-1 flex gap-3">
                <a href="https://instagram.com/dtdogs.ca" target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/85 transition hover:border-peach/50 hover:text-peach">
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a href="https://google.com" target="_blank" rel="noreferrer" aria-label="Google" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/85 transition hover:border-peach/50 hover:text-peach">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-peach">
              <MapPin className="h-3.5 w-3.5" /> Base Location
            </p>
            <p className="text-sm text-white/85">218 Queen Street East</p>
            <p className="text-sm text-white/85">Toronto, M5A 1S3</p>
            <a
              href="https://www.google.com/maps/place/218+Queen+St+E,+Toronto,+ON+M5A+1S3"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/60 transition hover:text-peach"
            >
              <MapPin className="h-3 w-3" /> View on Google Maps
            </a>
          </div>
        </div>

        <div className="grid gap-10 border-t border-white/15 pt-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-serif text-2xl text-white sm:text-3xl">Contact Us</h3>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <a href={brand.whatsapp} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-sm text-white/90 backdrop-blur-md transition hover:border-peach/50 hover:text-peach">
                <svg className="h-3.5 w-3.5 shrink-0 text-peach" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span className="truncate">{brand.phone}</span>
              </a>
              <a href={`mailto:${brand.email}`} className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-sm text-white/90 backdrop-blur-md transition hover:border-peach/50 hover:text-peach">
                <Mail className="h-3.5 w-3.5 shrink-0 text-peach" /> <span className="truncate">{brand.email}</span>
              </a>
              <a href="https://instagram.com/dtdogs.ca" target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/90 backdrop-blur-md transition hover:border-peach/50 hover:text-peach">
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
          <FooterColumn title="Services" links={serviceLinks} />
          <FooterColumn title="Explore" links={[{ label: "Our Vision", href: "/our-vision" }, { label: "Bundle", href: "/pricing" }, { label: "Gallery", href: "/gallery" }, { label: "Shop", href: "/shop" }, { label: "FAQ", href: "/faq" }, { label: "Blogs", href: "/blog" }, { label: "Contact", href: "/contact" }]} />
          <FooterColumn title="Policy and Community" links={[{ label: "Policy", href: "/policy" }]} footer="#PetPeople" />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DTdogs.ca. All rights reserved.</p>
          <p>Owned and managed by <a href="https://sunnyism.pro/" target="_blank" rel="noreferrer" className="text-white/70 transition hover:text-peach">Sunnyism.Pro</a>.</p>
          <p>Designed and Developed by <a href="https://bizzonedigital.com" target="_blank" rel="noreferrer" className="text-white/70 transition hover:text-peach">BizzOne Digital</a>.</p>
        </div>
      </div>
    </footer>
  );
}

function PaymentLogos({ light = false }: { light?: boolean } = {}) {
  const items = [
    { label: "Visa", mark: "VISA" },
    { label: "Mastercard", mark: "MC" },
    { label: "Amex", mark: "AMEX" },
    { label: "Interac", mark: "Interac" },
    { label: "Bitcoin", mark: "₿" },
    { label: "DTdogs Gift Card", mark: "Gift" },
  ];
  return (
    <div className={cx(light ? "mt-2" : "mt-6")}>
      <p className={cx("mb-3 text-xs font-semibold tracking-wide", light ? "text-burgundy" : "text-peach")}>We accept</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.label}
            title={item.label}
            className={cx(
              "inline-flex h-9 min-w-[3.25rem] items-center justify-center rounded-lg px-2.5 text-[11px] font-bold tracking-wide shadow-sm",
              light ? "border border-forest/15 bg-cream text-forest" : "border border-white/25 bg-white text-forest",
            )}
          >
            {item.mark}
          </span>
        ))}
      </div>
    </div>
  );
}

function FooterColumn({
  title,
  links,
  subtitle,
  footer,
}: {
  title: string;
  links: { label: string; href: string; comingSoon?: boolean }[];
  subtitle?: string;
  footer?: string;
}) {
  return (
    <div>
      <h3 className="font-serif text-2xl text-white sm:text-3xl">{title}</h3>
      {subtitle && <p className="mt-1 text-xs font-semibold tracking-wide text-peach">{subtitle}</p>}
      <div className="mt-5 grid gap-2.5">
        {links.map((link) =>
          link.comingSoon ? (
            <span key={`${link.href}-${link.label}`} className="w-fit text-sm text-white/75">
              {link.label}
              <span className="mt-0.5 block text-[11px] font-medium tracking-wide text-peach/90">Community / client login coming soon</span>
            </span>
          ) : (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="w-fit text-sm text-white/75 transition-all duration-300 hover:translate-x-1 hover:text-peach"
            >
              {link.label}
            </Link>
          ),
        )}
      </div>
      {footer && <p className="mt-4 text-xs font-semibold tracking-wide text-peach">{footer}</p>}
    </div>
  );
}

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
  hours: "Monday-Sunday, 7:00 AM-7:00 PM",
  boardingNote: "Boarding available 24/7 according to city bylaws and confirmed booking arrangements.",
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
  "about-1": "/images/about/about-1.png",
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
  if (image.page === "gallery") return galleryImageUrl(image.order) ?? localImageUrls[image.id] ?? image.url;
  if (image.page === "treats") return treatImageUrl(image.order) ?? localImageUrls[image.id] ?? image.url;
  return localImageUrls[image.id] ?? image.url;
}

function productImages(product: Product) {
  const giftCardImages: Record<string, ImageAsset> = {
    "gift-card-50": asset("gift-card-50-image", "DTdogs $50 gift card", "Premium DTdogs digital gift card product image for CAD $50", "/images/shop/gift50.png"),
    "gift-card-100": asset("gift-card-100-image", "DTdogs $100 gift card", "Premium DTdogs digital gift card product image for CAD $100", "/images/shop/gift100.png"),
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
  asset("about-1", "Founder care portrait", "Pet-care professional sitting with a happy dog in a bright care space", "/images/about/about-1.png"),
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
  "bath-and-nails": asset("service-bath-and-nails-hero", "Bath and Nails", "Freshly washed dog receiving gentle spa and paw care", "/images/services/service-bath-and-nails.png"),
  "full-haircut": asset("service-full-haircut-hero", "Full Haircut", "Perfectly styled dog after a premium full haircut", "/images/services/service-full-haircut.png"),
  "bath-and-tidy": asset("service-bath-and-tidy-hero", "Bath and Tidy", "Dog receiving light maintenance grooming in a bright salon", "/images/services/service-bath-and-tidy.png"),
  "meet-and-greet": asset("service-meet-and-greet-hero", "Meet and Greet", "Caregiver warmly meeting a curious dog for the first time", "/images/services/service-meet-and-greet.png"),
  "dog-walking-1-hour": asset("service-dog-walking-1hr-hero", "One-hour Dog Walking", "Happy dog enjoying a structured golden-hour Toronto walk", "/images/services/service-dog-walking-1hr.png"),
  "dog-walking-30-minutes": asset("service-dog-walking-30-hero", "Thirty-minute Dog Walking", "Small dog enjoying a focused neighbourhood walk", "/images/services/service-dog-walking-30.png"),
  "house-sitting-one-night": asset("service-house-sitting-night-hero", "Overnight House Sitting", "Dog resting comfortably during cozy overnight in-home care", "/images/services/service-house-sitting-night.png"),
  "house-sitting-full-day": asset("service-house-sitting-day-hero", "Full-day House Sitting", "Dog enjoying attentive daytime companionship at home", "/images/services/service-house-sitting-day.png"),
  "house-sitting-half-day": asset("service-house-sitting-half-hero", "Half-day House Sitting", "Caregiver preparing a calm midday routine for a dog at home", "/images/services/service-house-sitting-half.png"),
  "pet-visit": asset("service-pet-visit-hero", "Pet Visit", "Dog greeting a professional caregiver during an in-home visit", "/images/services/service-pet-visit.png"),
  "guided-pet-excursion": asset("service-excursion-hero", "Guided Pet Excursion", "Adventure-ready dog exploring a scenic green park trail", "/images/services/service-excursion.png"),
  "training-and-classes": asset("service-training-hero", "Training and Classes", "Calm dog participating in a modern positive training class", "/images/services/service-training.png"),
  "dog-grooming": asset("service-dog-grooming-hero", "Dog Grooming", "Refined grooming tools and a beautifully groomed dog", "/images/services/service-dog-grooming.png"),
  "dog-half-daycare": asset("service-half-daycare-hero", "Dog Half Daycare", "Dogs resting calmly in a bright supervised daycare room", "/images/services/service-half-daycare.png"),
  "dog-boarding-one-night": asset("service-boarding-hero", "Dog Boarding", "Calm dog resting in a boutique-style overnight boarding suite", "/images/services/service-boarding.png"),
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
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
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
                    className="text-xs uppercase tracking-[0.28em] text-peach sm:text-sm sm:tracking-[0.5em]"
                    initial={{ opacity: 0, letterSpacing: "0.1em" }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                  >
                    DTdogs.ca
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
    <Link href="/" className="group flex shrink-0 items-center gap-2.5">
      {ready ? (
        <Image
          src={LOGO_SRC}
          alt="DT Dogs at Hand & Paw"
          width={200}
          height={64}
          className="h-10 w-auto object-contain sm:h-14 md:h-16"
          priority
        />
      ) : (
        <>
          <span className={cx("grid h-11 w-11 place-items-center rounded-full shadow-md transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105", inverted ? "bg-white text-forest" : "bg-forest text-white")}>
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className={cx("block text-[11px] font-extrabold uppercase tracking-[0.12em]", inverted ? "text-white" : "text-forest")}>DT Dogs</span>
            <span className={cx("block text-[9px] font-semibold uppercase tracking-[0.18em]", inverted ? "text-white/70" : "text-ink/55")}>at Hand & Paw</span>
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
            <a href={`tel:${brand.phone}`} className="inline-flex items-center gap-1.5 transition hover:text-peach">
              <Phone className="h-3 w-3 shrink-0 text-peach" /> <span className="truncate">{brand.phone}</span>
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
            <a href="https://facebook.com/dtdogs.ca" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-[11px] font-bold transition hover:text-peach">
              f
            </a>
            <span className="hidden text-white/80 min-[380px]:inline">@DTdogs.ca</span>
          </div>
        </div>
      </div>

      <div className={cx("px-2 pt-2 transition-all duration-500 sm:px-3 sm:pt-3 md:px-5", solid && "pb-2")}>
        <div className={cx("mx-auto flex max-w-[1400px] items-center justify-between gap-2 rounded-full border border-white/70 bg-white/95 px-2.5 py-2 shadow-[0_12px_40px_rgba(32,37,34,0.12)] backdrop-blur-xl transition-all duration-500 sm:gap-3 sm:px-5 sm:py-2.5", solid && "shadow-[0_16px_48px_rgba(32,37,34,0.16)]")}>
          <BrandLogo />

          <nav className="hidden items-center gap-0.5 text-[13px] font-semibold text-ink/75 xl:flex 2xl:gap-1">
            {nav.map((item) =>
              item.label === "Services" ? (
                <div className="group relative -my-3 py-3" key={item.href}>
                  <Link href={item.href} className={cx("flex items-center gap-1 rounded-full px-3 py-2 transition hover:text-burgundy", pathname.startsWith("/services") && "text-burgundy")}>
                    Services <ChevronDown className="h-3.5 w-3.5" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-50 max-h-[70vh] w-[min(24rem,90vw)] -translate-x-1/2 overflow-y-auto rounded-[1.75rem] border border-forest/5 bg-white p-3 opacity-0 shadow-2xl shadow-black/10 transition group-hover:visible group-hover:opacity-100">
                    {services.slice(0, 12).map((service) => {
                      const thumb = servicePrimaryImage(service);
                      return (
                      <Link key={service.slug} href={`/services/${service.slug}`} className="group/card flex gap-3 rounded-3xl p-3 transition hover:bg-burgundy/10">
                        <Image className="h-16 w-20 rounded-2xl object-cover" {...imageProps(thumb, "80px")} alt={thumb.alt} />
                        <span>
                          <span className="block font-serif text-lg text-forest">{service.name}</span>
                          <span className="line-clamp-2 text-xs leading-5 text-ink/60">{service.summary}</span>
                        </span>
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
            <Link href="/booking" className="group inline-flex items-center gap-1.5 rounded-full bg-forest py-1.5 pl-3.5 pr-1.5 text-xs font-bold text-white transition hover:bg-burgundy sm:gap-2 sm:pl-5 sm:text-sm md:inline-flex">
              <span className="hidden min-[360px]:inline">Book</span>
              <span className="hidden sm:inline">Now</span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-forest transition group-hover:scale-110 sm:h-8 sm:w-8">
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
              <Link href="/booking" onClick={() => setOpen(false)} className="rounded-full bg-coral px-6 py-3.5 text-center font-bold text-ink transition hover:bg-burgundy hover:text-white">
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
    { label: "Certified Care", icon: ShieldCheck },
    { label: "24/7 CCTV", icon: Camera },
    { label: "Calm Environment", icon: Heart },
    { label: "GTA Service", icon: MapPin },
  ];
  const stats = [
    { label: "Happy Pets", value: "1,200+", icon: PawPrint },
    { label: "Happy Families", value: "900+", icon: Users },
    { label: "Years of Care", value: "4+", icon: CalendarDays },
    { label: "Trusted Care", value: "100%", icon: ShieldCheck },
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
              className="object-cover object-[72%_center] md:object-center"
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
          className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-center px-4 pb-32 pt-40 sm:px-6 sm:pb-28 sm:pt-36 md:pb-32 md:pt-40 lg:pt-36"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <motion.div
            className="max-w-xl lg:max-w-2xl"
            initial={reducedMotion ? false : { opacity: 0, x: -72 }}
            animate={enter ? { opacity: 1, x: 0 } : reducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -72 }}
            transition={{ duration: 1, ease }}
          >
            <motion.p
              className="mb-4 inline-flex max-w-full flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-peach sm:mb-5 sm:text-xs sm:tracking-[0.28em]"
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
              Structured pet care across the Greater Toronto Area
            </motion.p>

            <h1 className="font-serif text-[2.65rem] leading-[0.95] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              <motion.span
                className="inline-block"
                initial={reducedMotion ? false : { opacity: 0, x: -56 }}
                animate={enter ? { opacity: 1, x: 0 } : { opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -56 }}
                transition={{ duration: 0.95, delay: enter ? 0.18 : 0, ease }}
              >
                Welcome to
              </motion.span>{" "}
              <motion.span
                className="relative inline-block italic"
                initial={reducedMotion ? false : { opacity: 0, x: -48, scale: 0.96 }}
                animate={enter ? { opacity: 1, x: 0, scale: 1 } : { opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -48, scale: reducedMotion ? 1 : 0.96 }}
                transition={{ duration: 1.05, delay: enter ? 0.32 : 0, ease }}
              >
                <span className="text-gradient">DTdogs.ca</span>
                <motion.span
                  className="absolute -bottom-1 left-2"
                  initial={reducedMotion ? false : { scale: 0, rotate: -30 }}
                  animate={enter ? { scale: 1, rotate: 0 } : { scale: reducedMotion ? 1 : 0, rotate: reducedMotion ? 0 : -30 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14, delay: enter ? 0.75 : 0 }}
                >
                  <Heart className="h-4 w-4 fill-white text-white sm:h-5 sm:w-5" />
                </motion.span>
              </motion.span>
            </h1>

            <motion.p
              className="mt-6 max-w-lg text-base leading-7 text-white/85 sm:text-lg sm:leading-8"
              initial={reducedMotion ? false : { opacity: 0, x: -40 }}
              animate={enter ? { opacity: 1, x: 0 } : { opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -40 }}
              transition={{ duration: 0.9, delay: enter ? 0.42 : 0, ease }}
            >
              Make new paw friends at DTdogs.ca while your pet enjoys calm, professional care in a comfortable home-style environment.
            </motion.p>

            <motion.div
              className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4"
              initial={reducedMotion ? false : { opacity: 0, x: -36 }}
              animate={enter ? { opacity: 1, x: 0 } : { opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -36 }}
              transition={{ duration: 0.85, delay: enter ? 0.55 : 0, ease }}
            >
              <Link
                href="/booking"
                className="btn-gradient animate-glow inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 sm:w-auto"
              >
                Book a Meet & Greet <PawPrint className="h-4 w-4" />
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

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-6 sm:gap-x-8">
              {trustItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-2 text-sm text-white/85"
                  initial={reducedMotion ? false : { opacity: 0, x: -28 }}
                  animate={enter ? { opacity: 1, x: 0 } : { opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -28 }}
                  transition={{ duration: 0.55, delay: enter ? 0.7 + index * 0.08 : 0, ease }}
                  whileHover={reducedMotion ? undefined : { y: -3, color: "#f8d5c5" }}
                >
                  <item.icon className="h-4 w-4 text-peach" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
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
            >
              <Heart className="mb-2 h-5 w-5 fill-coral text-coral" />
            </motion.div>
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
                <p className="font-serif text-xl leading-none sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[11px] leading-tight text-white/70 sm:text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <BrandMarquee />

      <section className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="animate-float pointer-events-none absolute left-0 top-8 h-64 w-64 rounded-full bg-gradient-to-br from-coral/15 to-transparent blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <Reveal from="left">
            <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-forest/15 sm:rounded-[3rem]">
              <Image className="h-80 w-full object-cover sm:h-[30rem]" {...imageProps(homeSupportingImages.story)} alt={homeSupportingImages.story.alt} />
            </div>
          </Reveal>
          <Reveal from="right" delay={0.1}>
            <SectionHeading eyebrow="Our mission" title="Structured, nurturing pet care designed for comfort, safety and peace of mind." align="left" />
            <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70 sm:text-xl sm:leading-9">
              At Hand & Paw, we offer structured services for pets of discerning pet owners. Our mission is simple: to provide safe and professional care that ensures a calm environment and comfort for your pets while you&apos;re away. Since 2021, we have built trust through consistent, nurturing services focused on your pet&apos;s well-being throughout the Greater Toronto Area.
            </p>
          </Reveal>
        </div>
      </section>

      <ServiceGrid services={services} preview />

      <section className="bg-white py-14 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-2 xl:gap-14">
          <Reveal from="left">
            <SectionHeading eyebrow="Why choose us" title="Uncompromised care for your pet's happiness." align="left" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {["Food safety and hygiene monitored", "Comfortable, adjusted temperature", "Certified first-aid and canine behaviour knowledge", "24/7 CCTV surveillance", "Controlled group sizes", "Secure handling and calm routines"].map((item, index) => (
                <Reveal key={item} from={index % 2 === 0 ? "left" : "right"} delay={index * 0.06}>
                  <div className="group rounded-[1.5rem] bg-gradient-to-br from-sage/70 to-sage/35 p-5 transition-all duration-500 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-peach/60 hover:to-sage/40 hover:shadow-xl hover:shadow-forest/10">
                    <span className="mb-4 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-forest to-burgundy text-white shadow-lg shadow-forest/20 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                      <Check className="h-4 w-4" />
                    </span>
                    <p className="font-semibold text-ink">{item}</p>
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

      <ProcessSection />
      <TestimonialsPreview testimonials={testimonials} />
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
}: {
  page: PageContent;
  services: Service[];
  pricing: PricingPackage[];
  faqs: Faq[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  products: Product[];
  team: TeamMember[];
}) {
  return (
    <PageEnter pageKey={page.slug}>
      <Hero page={page} />
      {page.slug === "services" ? <ServiceGrid services={services} /> : null}
      {page.slug === "pricing" ? <PricingGrid pricing={pricing} /> : null}
      {page.slug === "gallery" ? <GalleryGrid images={page.blocks[0]?.images ?? []} /> : null}
      {page.slug === "treats" ? <TreatsGallery images={page.blocks[0]?.images ?? []} /> : null}
      {page.slug === "testimonials" ? <TestimonialsPreview testimonials={testimonials} full /> : null}
      {page.slug === "faq" ? <GroupedFaqPage faqs={faqs} images={page.hero.images} /> : null}
      {page.slug === "blog" ? <BlogGrid posts={blogPosts} /> : null}
      {page.slug === "booking" ? (
        <Suspense fallback={<section className="mx-auto max-w-5xl px-4 py-20 text-center text-ink/60">Loading booking form…</section>}>
          <BookingForm services={services} />
        </Suspense>
      ) : null}
      {page.slug === "team" ? <TeamGrid team={team} /> : null}
      {page.slug === "gift-cards" ? <GiftCardForm /> : null}
      {page.slug === "shop" || page.slug === "gift-cards" ? (
        <ProductGrid
          products={
            page.slug === "gift-cards"
              ? products.filter((product) => product.slug.includes("gift-card"))
              : products
          }
          merchLayout={page.slug === "shop"}
        />
      ) : null}
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
    <section className="relative overflow-hidden bg-forest pt-36 text-white md:pt-40">
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
      <div className="relative mx-auto grid max-w-7xl items-end gap-8 px-4 py-12 sm:gap-10 md:px-8 md:py-24 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <motion.p
            className="mb-4 inline-flex max-w-full flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-peach sm:mb-5 sm:gap-3 sm:text-sm sm:tracking-[0.34em]"
            initial={reducedMotion ? false : { opacity: 0, x: -56, y: 16 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.85, ease }}
          >
            <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-peach sm:block" />
            {page.hero.eyebrow}
          </motion.p>
          <motion.h1
            className="font-serif text-[2.35rem] leading-[1.02] drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)] sm:text-5xl md:text-7xl lg:text-8xl"
            initial={reducedMotion ? false : { opacity: 0, x: -72 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.12, ease }}
          >
            {page.hero.title}
          </motion.h1>
          <motion.p
            className="mt-6 max-w-2xl text-base leading-7 text-white/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)] sm:text-lg sm:leading-8"
            initial={reducedMotion ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease }}
          >
            {page.hero.body}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            initial={reducedMotion ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.42, ease }}
          >
            {page.hero.primaryCta ? <Button href={page.hero.primaryCta.href}>{page.hero.primaryCta.label}</Button> : null}
            {page.hero.secondaryCta ? <Button href={page.hero.secondaryCta.href} variant="light">{page.hero.secondaryCta.label}</Button> : null}
          </motion.div>
        </div>
        {heroImages.length ? (
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
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <Reveal from={blockIndex % 2 === 0 ? "left" : "right"}>
        <SectionHeading eyebrow={block.eyebrow} title={block.title} />
        {block.body ? <p className="mx-auto mt-6 max-w-3xl text-center text-base leading-8 text-ink/70 sm:text-lg">{block.body}</p> : null}
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
      <section className="relative overflow-hidden bg-forest pt-36 text-white md:pt-40">
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
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:gap-10 md:px-8 md:py-24 lg:grid-cols-2">
          <div>
            <motion.p
              className="mb-4 inline-flex max-w-full flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-peach sm:mb-5 sm:gap-3 sm:text-sm sm:tracking-[0.34em]"
              initial={reducedMotion ? false : { opacity: 0, x: -56, y: 16 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.85, ease }}
            >
              <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-peach sm:block" />
              {comingSoon ? "Coming Soon" : service.eyebrow}
            </motion.p>
            <motion.h1
              className="font-serif text-[2.5rem] leading-[1.02] drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)] sm:text-6xl md:text-8xl"
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
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
              {service.priceTiers.map((tier, index) => (
                <Reveal key={tier.label} from={directions[index % directions.length]} delay={index * 0.08}>
                  <div className="rounded-[1.25rem] border border-forest/10 bg-cream p-4 text-center shadow-lg shadow-black/5 sm:rounded-[1.5rem] sm:p-5">
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
          <ImageRibbon images={heroImages} />
        </div>
      </section>
      <FaqList faqs={service.faqs.map((faq, index) => ({ slug: `${service.slug}-${index}`, category: service.name, ...faq }))} />
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
                      sizeLabel === tier.label ? "bg-forest text-white" : "bg-sage text-ink hover:bg-peach/50",
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
  const visibleServices = preview ? services.slice(0, 3) : services;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-24">
      <Reveal from="up">
        <SectionHeading eyebrow="Signature services" title="Every service has its own care story, images and booking path." />
      </Reveal>
      <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
        {visibleServices.map((service, index) => (
          <Reveal key={service.slug} from={directions[index % directions.length]} delay={(index % 6) * 0.08}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
      {preview ? (
        <Reveal from="up" delay={0.15} className="mt-10 text-center">
          <Button href="/services">View All Services</Button>
        </Reveal>
      ) : null}
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const comingSoon = service.status === "coming-soon";
  const cardImage = servicePrimaryImage(service);

  return (
    <Link href={`/services/${service.slug}`} className="group relative overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5 transition duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-burgundy/20">
      <div className="pointer-events-none absolute inset-0 z-10 rounded-[2rem] opacity-0 ring-2 ring-inset ring-coral/50 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative h-60 overflow-hidden sm:h-72">
        <Image className="h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-1" {...imageProps(cardImage)} alt={cardImage.alt} />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute left-5 top-5 rounded-full bg-gradient-to-r from-cream to-peach px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-forest shadow-lg">
          {comingSoon ? "Coming Soon" : service.eyebrow}
        </span>
      </div>
      <div className="relative p-5 sm:p-7">
        <h3 className="font-serif text-[1.75rem] leading-tight text-forest transition-colors duration-300 group-hover:text-burgundy sm:text-4xl">{service.name}</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-forest/70">
          {service.duration ? <span>{service.duration}</span> : null}
          {service.duration && service.priceLabel ? <span>•</span> : null}
          {service.priceLabel ? <span className="text-burgundy">{service.priceLabel}</span> : null}
        </div>
        <p className="mt-3 leading-7 text-ink/65 sm:min-h-20">{service.summary}</p>
        <span className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-burgundy to-coral bg-clip-text font-bold text-transparent">
          {comingSoon ? "View Details" : "Learn More"} <ArrowRight className="h-4 w-4 text-burgundy transition duration-300 group-hover:translate-x-2" />
        </span>
      </div>
    </Link>
  );
}

function PricingGrid({ pricing }: { pricing: PricingPackage[] }) {
  const packages = pricing.filter((item) => item.status !== "hidden");
  const directions = ["left", "up", "right", "down"] as const;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <Reveal from="up">
        <div className="mb-10 text-center md:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-burgundy">Dog Daycare, Boarding & Dog Walks</p>
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
                  className="btn-gradient mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-lg transition hover:-translate-y-0.5"
                >
                  Select
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
  const categories = ["All", ...Array.from(new Set(images.flatMap((image) => image.tags ?? []).filter(Boolean)))];
  const visible = filter === "All" ? images : images.filter((image) => image.tags?.includes(filter));

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
        {categories.map((category) => (
          <button key={category} onClick={() => setFilter(category)} className={cx("shrink-0 rounded-full px-5 py-3 text-sm font-bold capitalize transition-all duration-300 hover:-translate-y-0.5", filter === category ? "bg-gradient-to-r from-forest to-burgundy text-white shadow-lg shadow-forest/25" : "bg-white text-ink hover:bg-sage")}>
            {category.replace("-", " ")}
          </button>
        ))}
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
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/admin/media" variant="outline">Manage Images</Button>
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
          <Button href="/booking">Start Booking</Button>
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
    <section id="booking-form" className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
      <Reveal from="up">
      <form onSubmit={submit} className="rounded-[1.75rem] bg-white p-3.5 shadow-2xl shadow-black/10 sm:rounded-[2rem] sm:p-5 md:rounded-[2.5rem] md:p-8">
        <input type="hidden" name="service" value={bookingServiceLabel} />
        <input type="hidden" name="packageSelection" value={packageSelection} />
        <input type="hidden" name="addonSelected" value={includeAddon ? "true" : "false"} />
        <input type="hidden" name="estimatedTotal" value={total === null ? selectedService?.priceLabel ?? "" : formatMoney(total)} />

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {steps.map((label, index) => (
            <button key={label} type="button" onClick={() => setStep(index)} className={cx("shrink-0 rounded-full px-3.5 py-2.5 text-xs font-bold sm:px-4 sm:py-3 sm:text-sm", step === index ? "bg-forest text-white" : "bg-sage text-ink")}>
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
              <button key={label} type="button" onClick={() => setStep(index)} className={cx("mb-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm", step === index ? "bg-coral text-ink" : index < step ? "bg-white/10 text-white" : "text-white/55")}>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 text-xs">{index < step ? "✓" : index + 1}</span>
                {label}
              </button>
            ))}
          </aside>

          <div className="grid gap-5 md:grid-cols-2">
            <div className={cx(step === 0 ? "contents" : "hidden")}>
              <div className="md:col-span-2">
                <h3 className="font-serif text-3xl text-forest">Choose a service</h3>
                <p className="mt-2 text-sm text-ink/60">Select your care option, then optionally add the +{serviceAddOn.priceLabel} add-on.</p>
              </div>
              <label className="block text-sm font-bold text-ink/70 md:col-span-2">
                Selected service
                <select required={step === 0} value={selectedServiceSlug} onChange={(event) => setSelectedServiceSlug(event.target.value)} className="mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-base outline-none ring-forest/20 transition focus:ring-4">
                  <option value="" disabled>Choose</option>
                  {bookableServices.map((service) => (
                    <option key={service.slug} value={service.slug}>
                      {serviceBookingLabel(service, bookableServices)}
                    </option>
                  ))}
                </select>
              </label>

              {selectedService?.priceTiers?.length ? (
                <div className="md:col-span-2">
                  <p className="text-sm font-bold text-ink/70">Dog size</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedService.priceTiers.map((tier) => (
                      <button key={tier.label} type="button" onClick={() => setSizeLabel(tier.label)} className={cx("rounded-full px-4 py-2 text-sm font-bold transition", sizeLabel === tier.label ? "bg-forest text-white" : "bg-sage text-ink hover:bg-peach/50")}>
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
                <p className="mt-2 font-serif text-4xl text-forest">{total === null ? selectedService?.priceLabel ?? "Request quote" : formatMoney(total)}</p>
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
              <Field label="Preferred date" name="preferredDate" type="date" required={step === 2} />
              <Field label="Preferred time" name="preferredTime" type="time" required={step === 2} />
              <Field label="Pickup time" name="pickupTime" type="time" />
              <Field label="Drop-off time" name="dropoffTime" type="time" />
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
              <button type="button" onClick={() => setStep(Math.min(steps.length - 1, step + 1))} className="btn-gradient rounded-full px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-burgundy/25"><span className="relative z-10">Continue</span></button>
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
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {giftCards.map((product, index) => {
                const primaryImage = productImages(product)[0];
                return (
                  <Reveal key={product.slug} from={index % 2 === 0 ? "left" : "right"} delay={index * 0.1}>
                    <Link
                      href={`/shop/${product.slug}`}
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving gift card request...");
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/gift-cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setStatus(response.ok ? "Gift card request saved. Payment is pending until checkout is configured." : "Unable to save gift card request.");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <section id="gift-card-form" className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
      <Reveal from="up">
      <form onSubmit={submit} className="grid gap-5 rounded-[2rem] bg-white p-5 shadow-xl shadow-black/5 md:grid-cols-2 md:p-8">
        <div className="md:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">Gift Card Purchase</p>
          <h2 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">Choose $50 or $100 digital delivery.</h2>
          <p className="mt-3 leading-8 text-ink/65">No fake payment success state is shown. Requests save as Payment Pending until payment credentials are configured.</p>
        </div>
        <Field label="Denomination" name="denomination" as="select" required options={["CAD $50", "CAD $100"]} />
        <Field label="Delivery date" name="deliveryDate" type="date" />
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function TestimonialsPreview({ testimonials, full }: { testimonials: Testimonial[]; full?: boolean }) {
  const items = full ? testimonials : testimonials.slice(0, 3);
  const directions = ["left", "up", "right"] as const;
  return (
    <section className="bg-gradient-animated relative overflow-hidden py-14 text-white md:py-24">
      <div className="animate-float absolute -left-20 top-16 h-80 w-80 rounded-full bg-gradient-to-br from-coral/25 to-transparent blur-3xl" />
      <div className="animate-float-delayed absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-gradient-to-tl from-burgundy/30 to-transparent blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <Reveal from="up">
          <SectionHeading eyebrow="Trusted care" title="Pet parents should feel the care before they book." inverse />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((testimonial, index) => (
            <Reveal key={testimonial.slug} from={directions[index % directions.length]} delay={index * 0.12}>
              <article className="h-full rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/15 to-white/5 p-5 backdrop-blur transition duration-500 hover:-translate-y-2 hover:border-coral/40 hover:shadow-2xl hover:shadow-black/30 sm:p-6">
                <Image className="h-48 w-full rounded-[1.5rem] object-cover sm:h-52" {...imageProps(testimonial.image)} alt={testimonial.image.alt} />
                <p className="mt-5 text-gradient text-lg">{"★".repeat(testimonial.rating)}</p>
                <p className="mt-4 leading-8 text-white/80">{`"${testimonial.quote}"`}</p>
                <p className="mt-5 font-bold">{testimonial.reviewer} {testimonial.sample ? "(sample placeholder)" : ""}</p>
                <p className="text-sm text-white/60">{testimonial.petName} • {testimonial.service}</p>
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
                      className="h-64 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-80"
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
  const steps = ["Tell us about your pet", "Select the service", "Confirm the booking", "Relax while we provide professional care"];
  const directions = ["left", "up", "right", "down"] as const;
  return (
    <section className="relative overflow-hidden py-14 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-sage/40 to-cream" />
      <div className="animate-float absolute right-0 top-10 h-72 w-72 rounded-full bg-gradient-to-bl from-coral/15 to-transparent blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <Reveal from="up">
          <SectionHeading eyebrow="How booking works" title="Four calm steps from hello to care." />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step} from={directions[index % directions.length]} delay={index * 0.1}>
              <div className="group relative h-full overflow-hidden rounded-[2rem] bg-white p-7 shadow-xl shadow-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-burgundy/15">
                <div className="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-0 bg-gradient-to-r from-coral to-burgundy transition-transform duration-500 group-hover:scale-x-100" />
                <span className="text-gradient font-serif text-5xl sm:text-6xl">0{index + 1}</span>
                <p className="mt-5 font-semibold leading-7">{step}</p>
              </div>
            </Reveal>
          ))}
        </div>
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
          <Sparkles className="h-8 w-8 text-white" />
        </motion.span>
        <Reveal from="up" delay={0.1}>
          <h2 className="font-serif text-[2.15rem] leading-none sm:text-5xl md:text-7xl">
            Ready to join the <span className="text-gradient italic">DTdogs clan</span>?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">Tell us about your pet and we will help you choose the right care experience.</p>
          <div className="mt-8">
            <Button href="/booking">Book a Meet & Greet</Button>
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
            <figcaption className="p-3.5 text-sm text-ink/65 sm:p-4">{image.caption ?? image.title}</figcaption>
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
        <p className={cx("mb-3 inline-flex max-w-full flex-wrap items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] sm:mb-4 sm:gap-3 sm:text-sm sm:tracking-[0.34em]", inverse ? "text-peach" : "text-transparent bg-clip-text bg-gradient-to-r from-burgundy via-coral to-burgundy", align === "left" && "justify-start")}>
          <span className={cx("hidden h-px w-8 sm:block", inverse ? "bg-gradient-to-r from-transparent to-peach" : "bg-gradient-to-r from-transparent to-burgundy")} />
          {eyebrow}
          <span className={cx("hidden h-px w-8 sm:block", inverse ? "bg-gradient-to-l from-transparent to-peach" : "bg-gradient-to-l from-transparent to-burgundy")} />
        </p>
      ) : null}
      <h2 className={cx("font-serif text-[1.85rem] leading-[1.05] sm:text-5xl md:text-7xl", inverse ? "text-white" : "text-gradient-forest")}>{title}</h2>
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

function Button({ href, children, variant = "solid", className }: { href: string; children: React.ReactNode; variant?: "solid" | "light" | "outline"; className?: string }) {
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
        {children} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
      </span>
    </Link>
  );
}

function InfoPill({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg shadow-black/5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-burgundy">{title}</p>
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
    .filter((service) => service.status !== "coming-soon")
    .slice(0, 8)
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

      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md sm:text-xs sm:tracking-[0.28em]">
              DTdogs.ca · Hand &amp; Paw · GTA Pet Care
            </p>
            <div className="flex items-center gap-3">
              <span className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-full border border-white/30 bg-white/15 shadow-lg shadow-black/20 backdrop-blur-md">
                <Image src={LOGO_SRC} alt="DTdogs.ca" width={40} height={40} className="h-10 w-10 object-contain" />
              </span>
              <div>
                <p className="font-serif text-3xl leading-none sm:text-4xl">DTdogs.ca</p>
                <p className="mt-1 text-xs uppercase tracking-[0.28em] text-peach">Hand &amp; Paw</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
              Structured, attentive pet care across the Greater Toronto Area — designed around safety, comfort and calm routines.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-ink shadow-lg shadow-coral/30 transition hover:-translate-y-0.5 hover:bg-peach"
            >
              Book Appointment <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/15 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/25"
            >
              Explore Services
            </Link>
          </div>
        </div>

        <div className="grid gap-10 border-t border-white/15 pt-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-serif text-2xl text-white sm:text-3xl">Stay connected</h3>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/75">{brand.hours}</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <a href={`tel:${brand.phone}`} className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-sm text-white/90 backdrop-blur-md transition hover:border-peach/50 hover:text-peach">
                <Phone className="h-3.5 w-3.5 shrink-0 text-peach" /> <span className="truncate">{brand.phone}</span>
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
          <FooterColumn title="Explore" links={[{ label: "About", href: "/about" }, { label: "Pricing", href: "/pricing" }, { label: "Gallery", href: "/gallery" }, { label: "Shop", href: "/shop" }, { label: "FAQ", href: "/faq" }, { label: "Journal", href: "/blog" }, { label: "Contact", href: "/contact" }]} />
          <FooterColumn title="Policies" links={[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: "Cancellation", href: "/cancellation-policy" }, { label: "Admin", href: "/admin" }]} />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DTdogs.ca. Owned and managed by Sunnyism.Pro.</p>
          <p className="text-white/50">Calm care for pets across the GTA.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-serif text-2xl text-white sm:text-3xl">{title}</h3>
      <div className="mt-5 grid gap-2.5">
        {links.map((link) => (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            className="w-fit text-sm text-white/75 transition-all duration-300 hover:translate-x-1 hover:text-peach"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

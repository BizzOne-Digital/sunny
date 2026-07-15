"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, Check, ChevronDown, Menu, PawPrint, Phone, Sparkles, X } from "lucide-react";
import type { BlogPost, Faq, ImageAsset, PageContent, PricingPackage, Product, Service, TeamMember, Testimonial } from "@/lib/site";

const brand = {
  phone: "+1 (437) 937-5112",
  email: "connect@dtdogs.ca",
  hours: "Monday-Sunday, 7:00 AM-7:00 PM",
  boardingNote: "Boarding available 24/7 according to city bylaws and confirmed booking arrangements.",
};

const unsplash = "https://images.unsplash.com";
const asset = (id: string, title: string, alt: string, path: string): ImageAsset => ({
  id,
  title,
  alt,
  url: `${unsplash}/${path}`,
  width: 1600,
  height: 1100,
  status: "published",
});

const homePage = {
  heroImages: [
    asset("hero-caregiver", "Calm dog with caregiver", "Calm dog sitting beside a caring handler in warm natural light", "photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=1800&q=82"),
    asset("floating-pup", "Happy relaxed dog portrait", "Happy relaxed dog portrait against a warm interior background", "photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=82"),
    asset("walk-toronto", "Neighbourhood dog walk", "Dog enjoying a structured neighbourhood walk in Toronto", "photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1400&q=82"),
    asset("boarding-home", "Home style boarding rest", "Dog resting comfortably in a clean home style boarding environment", "photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1400&q=82"),
    asset("daycare-play", "Supervised daycare play", "Dogs enjoying supervised social play in a bright daycare setting", "photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1400&q=82"),
  ],
  storyImages: [
    asset("about-founder", "Founder care portrait", "Pet-care professional connecting with a calm dog", "photo-1598134493136-7b63ebbd7b3b?auto=format&fit=crop&w=1400&q=82"),
    asset("facility", "Clean care environment", "Bright clean care environment prepared for pet comfort", "photo-1601758177266-bc599de87707?auto=format&fit=crop&w=1600&q=82"),
    asset("toronto-lifestyle", "Toronto pet lifestyle", "Dog and caregiver enjoying a Toronto neighbourhood setting", "photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=1600&q=82"),
    asset("pet-visit", "In-home pet visit", "Caregiver offering gentle attention during an in-home pet visit", "photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1400&q=82"),
    asset("trust-full", "Trusted calm routine", "Dog relaxing during a calm supervised care routine", "photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=1800&q=82"),
  ],
  galleryImages: [
    asset("gallery-01", "Dog walking moment", "Dog enjoying a structured walk", "photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1400&q=82"),
    asset("gallery-02", "Boarding comfort", "Dog resting in a home-style care space", "photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1400&q=82"),
    asset("gallery-03", "Daycare play", "Dogs playing under supervision", "photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1400&q=82"),
    asset("gallery-04", "Care portrait", "Calm dog portrait in natural light", "photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=82"),
    asset("gallery-05", "Grooming detail", "Well-groomed dog looking comfortable", "photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1400&q=82"),
    asset("gallery-06", "Chauffeur ride", "Dog safely seated for transport", "photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1400&q=82"),
    asset("gallery-07", "Toronto lifestyle", "Dog and caregiver outdoors", "photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=1600&q=82"),
    asset("gallery-08", "Paw detail", "Close-up of a dog's paw", "photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1400&q=82"),
    asset("gallery-09", "Care environment", "Bright clean pet-care environment", "photo-1601758177266-bc599de87707?auto=format&fit=crop&w=1600&q=82"),
    asset("gallery-10", "Booking moment", "Calm dog-care moment", "photo-1544568100-847a948585b9?auto=format&fit=crop&w=1800&q=82"),
  ],
};

const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Gallery", href: "/gallery" },
  { label: "Shop", href: "/shop" },
  { label: "Journal", href: "/blog" },
  { label: "More", href: "/team" },
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function imageProps(image: ImageAsset, sizes = "(min-width: 1024px) 50vw, 100vw") {
  return {
    src: image.url,
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
      <main className="min-h-screen overflow-hidden bg-cream text-ink">{children}</main>
      <Footer services={services} />
    </>
  );
}

function IntroWrapper() {
  const [show, setShow] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || sessionStorage.getItem("dtdogs_intro_seen")) return;

    const showTimer = window.setTimeout(() => setShow(true), 0);
    const hideTimer = window.setTimeout(() => {
      sessionStorage.setItem("dtdogs_intro_seen", "true");
      setShow(false);
    }, 3200);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [reducedMotion]);

  const skip = () => {
    sessionStorage.setItem("dtdogs_intro_seen", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && !reducedMotion ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-forest text-white"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.75, ease: [0.77, 0, 0.175, 1] } }}
        >
          <button onClick={skip} className="absolute right-5 top-5 rounded-full border border-white/30 px-4 py-2 text-sm">
            Skip
          </button>
          <motion.div
            className="absolute h-[38rem] w-[38rem] rounded-full bg-coral/20 blur-3xl"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
          <motion.div
            className="relative flex flex-col items-center gap-6 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
          >
            <PawPrint className="h-10 w-10 text-peach sm:h-14 sm:w-14" />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/70 sm:text-sm sm:tracking-[0.5em]">DTdogs.ca / Hand & Paw</p>
              <h1 className="font-serif text-4xl italic sm:text-5xl md:text-8xl">Care begins with trust.</h1>
            </div>
            <motion.div
              className="h-1 w-72 rounded-full bg-white/25"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.4, ease: "easeInOut" }}
            />
            <p className="px-4 text-base text-white/80 sm:text-lg">Care, Comfort & Companionship</p>
          </motion.div>
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
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-screen origin-top bg-forest"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
    />
  );
}

function Navigation({ services }: { services: Service[] }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cx("fixed inset-x-0 top-0 z-50 transition-all duration-500", solid ? "bg-cream/90 shadow-xl shadow-black/5 backdrop-blur-xl" : "bg-transparent")}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-forest text-white shadow-lg shadow-forest/20">
            <PawPrint className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-serif text-2xl leading-none text-ink">DTdogs</span>
            <span className="block text-[10px] uppercase tracking-[0.28em] text-ink/60">Hand & Paw</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-ink/75 lg:flex">
          {nav.map((item) =>
            item.label === "Services" ? (
              <div className="group relative -my-4 py-4" key={item.href}>
                <Link href={item.href} className="flex items-center gap-1 transition hover:text-burgundy">
                  Services <ChevronDown className="h-4 w-4" />
                </Link>
                <div className="invisible absolute left-1/2 top-full max-h-[70vh] w-[24rem] -translate-x-1/2 overflow-y-auto rounded-[2rem] bg-white p-3 opacity-0 shadow-2xl shadow-black/10 transition group-hover:visible group-hover:opacity-100">
                  {services.slice(0, 10).map((service) => (
                    <Link key={service.slug} href={`/services/${service.slug}`} className="group/card flex gap-3 rounded-3xl p-3 transition hover:bg-burgundy/10">
                      <Image className="h-16 w-20 rounded-2xl object-cover" {...imageProps(service.images[0], "80px")} alt={service.images[0].alt} />
                      <span>
                        <span className="block font-serif text-lg text-forest">{service.name}</span>
                        <span className="line-clamp-2 text-xs leading-5 text-ink/60">{service.summary}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : item.label === "More" ? (
              <div className="group relative -my-4 py-4" key={item.href}>
                <span className="flex cursor-default items-center gap-1 transition hover:text-burgundy">
                  More <ChevronDown className="h-4 w-4" />
                </span>
                <div className="invisible absolute right-0 top-full grid w-56 gap-1 rounded-[1.5rem] bg-white p-3 opacity-0 shadow-2xl shadow-black/10 transition group-hover:visible group-hover:opacity-100">
                  {["/team", "/testimonials", "/faq", "/contact"].map((href) => (
                    <Link key={href} href={href} className="rounded-2xl px-4 py-3 capitalize transition hover:bg-burgundy/10 hover:text-burgundy">
                      {href.replace("/", "").replace("-", " ") || "Home"}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="transition hover:text-burgundy">
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/booking" className="hidden rounded-full bg-forest px-5 py-3 text-sm font-bold text-white shadow-lg shadow-forest/20 transition hover:-translate-y-0.5 hover:bg-burgundy md:inline-flex">
            Book Now
          </Link>
          <button onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-full border border-forest/15 bg-white/80 lg:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-[90] overflow-y-auto bg-forest p-6 text-white lg:hidden" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}>
            <button onClick={() => setOpen(false)} className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-white/20" aria-label="Close navigation">
              <X className="h-5 w-5" />
            </button>
            <div className="mt-10 grid gap-4 font-serif text-3xl sm:text-4xl">
              {[...nav.filter((item) => item.label !== "More"), { label: "Team", href: "/team" }, { label: "Testimonials", href: "/testimonials" }, { label: "FAQ", href: "/faq" }, { label: "Contact", href: "/contact" }].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/booking" onClick={() => setOpen(false)} className="rounded-full bg-coral px-6 py-3 font-bold text-ink transition hover:bg-burgundy hover:text-white">
                Book Now
              </Link>
              <a href={`tel:${brand.phone}`} className="rounded-full border border-white/30 px-6 py-3">
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
  return (
    <>
      <section className="relative overflow-hidden bg-forest pt-24 text-white md:min-h-screen md:pt-28">
        <div className="absolute inset-0 opacity-35">
          <Image className="h-full w-full object-cover" priority {...imageProps(homePage.heroImages[0], "100vw")} alt={homePage.heroImages[0].alt} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest/85 to-black/55" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <p className="mb-5 text-xs uppercase tracking-[0.24em] text-peach sm:text-sm sm:tracking-[0.34em]">Structured pet care across the Greater Toronto Area</p>
            <h1 className="font-serif text-5xl leading-[0.92] sm:text-6xl md:text-8xl lg:text-9xl">
              Welcome to <span className="italic text-peach">DTdogs.ca</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              Make new paw friends at DTdogs.ca while your pet enjoys calm, professional care in a comfortable home-style environment.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/booking">Book a Meet & Greet</Button>
              <Button href="/services" variant="light">Explore Services</Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
              {["Certified Care", "24/7 CCTV", "Calm Environment", "GTA Service"].map((chip) => (
                <span key={chip} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative min-h-[26rem] sm:min-h-[34rem]">
              <Image className="absolute right-0 top-0 h-[22rem] w-[82%] rounded-[2rem] object-cover shadow-2xl sm:h-[30rem] sm:rounded-[3rem]" priority {...imageProps(homePage.heroImages[1], "(min-width: 1024px) 40vw, 80vw")} alt={homePage.heroImages[1].alt} />
              <Image className="absolute bottom-0 left-0 h-52 w-40 rounded-[1.75rem] border-4 border-forest object-cover shadow-2xl sm:h-72 sm:w-60 sm:rounded-[2.5rem] sm:border-8" {...imageProps(homePage.heroImages[2], "240px")} alt={homePage.heroImages[2].alt} />
              <div className="absolute bottom-5 right-2 rounded-[1.5rem] bg-white p-4 text-ink shadow-2xl sm:bottom-8 sm:right-6 sm:rounded-[2rem] sm:p-5">
                <p className="font-serif text-2xl text-forest sm:text-3xl">Since 2021</p>
                <p className="max-w-48 text-sm text-ink/60">Consistent, nurturing services for your pet&apos;s well-being.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <Reveal>
          <SectionHeading eyebrow="Our mission" title="Structured, nurturing pet care designed for comfort, safety and peace of mind." />
          <p className="mx-auto mt-6 max-w-4xl text-center text-base leading-8 text-ink/70 sm:text-xl sm:leading-9">
            At Hand & Paw, we offer structured services for pets of discerning pet owners. Our mission is simple: to provide safe and professional care that ensures a calm environment and comfort for your pets while you&apos;re away. Since 2021, we have built trust through consistent, nurturing services focused on your pet&apos;s well-being throughout the Greater Toronto Area.
          </p>
        </Reveal>
      </section>

      <ServiceGrid services={services.slice(0, 9)} />

      <section className="bg-white py-14 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-2 xl:gap-14">
          <Reveal>
            <SectionHeading eyebrow="Why choose us" title="Uncompromised care for your pet's happiness." align="left" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {["Food safety and hygiene monitored", "Comfortable, adjusted temperature", "Certified first-aid and canine behaviour knowledge", "24/7 CCTV surveillance", "Controlled group sizes", "Secure handling and calm routines"].map((item) => (
                <div key={item} className="rounded-[1.5rem] bg-sage/55 p-5">
                  <Check className="mb-4 h-5 w-5 text-forest" />
                  <p className="font-semibold text-ink">{item}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <ImageCollage images={homePage.storyImages} />
        </div>
      </section>

      <ProcessSection />
      <TestimonialsPreview testimonials={testimonials} />
      <GalleryPreview images={homePage.galleryImages} />
      <ShopPreview products={products} />
      <BookingCTA />
    </>
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
    <>
      <Hero page={page} />
      {page.slug === "services" ? <ServiceGrid services={services} /> : null}
      {page.slug === "pricing" ? <PricingGrid pricing={pricing} /> : null}
      {page.slug === "gallery" ? <GalleryGrid images={page.blocks[0]?.images ?? []} /> : null}
      {page.slug === "testimonials" ? <TestimonialsPreview testimonials={testimonials} full /> : null}
      {page.slug === "faq" ? <GroupedFaqPage faqs={faqs} images={page.hero.images} /> : null}
      {page.slug === "blog" ? <BlogGrid posts={blogPosts} /> : null}
      {page.slug === "booking" ? <BookingForm services={services} /> : null}
      {page.slug === "team" ? <TeamGrid team={team} /> : null}
      {page.slug === "gift-cards" ? <GiftCardForm /> : null}
      {page.slug === "shop" || page.slug === "gift-cards" ? <ProductGrid products={page.slug === "gift-cards" ? products.filter((product) => product.slug.includes("gift-card")) : products} /> : null}
      {page.slug === "contact" ? <ContactPanel /> : null}
      {page.blocks.map((block, index) => (
        <ContentBlock key={`${block.title}-${index}`} block={block} />
      ))}
      {!["booking", "contact"].includes(page.slug) ? <BookingCTA /> : null}
    </>
  );
}

function Hero({ page }: { page: PageContent }) {
  const main = page.hero.images[0];
  return (
    <section className="relative overflow-hidden bg-forest pt-24 text-white md:pt-32">
      <div className="absolute inset-0 opacity-35">
        <Image className="h-full w-full object-cover" priority {...imageProps(main, "100vw")} alt={main.alt} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest/90 to-black/50" />
      <div className="relative mx-auto grid max-w-7xl items-end gap-10 px-4 py-14 md:px-8 md:py-24 lg:grid-cols-[1fr_0.9fr]">
        <Reveal>
          <p className="mb-5 text-xs uppercase tracking-[0.24em] text-peach sm:text-sm sm:tracking-[0.34em]">{page.hero.eyebrow}</p>
          <h1 className="font-serif text-4xl leading-[0.98] sm:text-5xl md:text-7xl lg:text-8xl">{page.hero.title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">{page.hero.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {page.hero.primaryCta ? <Button href={page.hero.primaryCta.href}>{page.hero.primaryCta.label}</Button> : null}
            {page.hero.secondaryCta ? <Button href={page.hero.secondaryCta.href} variant="light">{page.hero.secondaryCta.label}</Button> : null}
          </div>
        </Reveal>
        <ImageCollage images={page.hero.images.slice(0, 5)} dark />
      </div>
    </section>
  );
}

function ContentBlock({ block }: { block: PageContent["blocks"][number] }) {
  if (block.type === "gallery" || block.type === "faq" || block.type === "shop" || block.type === "testimonials") return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <Reveal>
        <SectionHeading eyebrow={block.eyebrow} title={block.title} />
        {block.body ? <p className="mx-auto mt-6 max-w-3xl text-center text-base leading-8 text-ink/70 sm:text-lg">{block.body}</p> : null}
      </Reveal>
      {block.items?.length ? (
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {block.items.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5">
              {item.image ? <Image className="h-64 w-full object-cover" {...imageProps(item.image)} alt={item.image.alt} /> : null}
              <div className="p-5 sm:p-7">
                <h3 className="font-serif text-2xl text-forest sm:text-3xl">{item.title}</h3>
                <p className="mt-3 leading-7 text-ink/65">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
      {block.images?.length ? <ImageRibbon images={block.images.slice(0, 8)} /> : null}
    </section>
  );
}

export function ServiceDetail({ service, related }: { service: Service; related: Service[] }) {
  return (
    <>
      <section className="relative bg-forest pt-24 text-white md:pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:px-8 md:py-24 lg:grid-cols-2">
          <Reveal>
            <p className="mb-5 text-xs uppercase tracking-[0.24em] text-peach sm:text-sm sm:tracking-[0.34em]">{service.eyebrow}</p>
            <h1 className="font-serif text-5xl leading-[0.92] sm:text-6xl md:text-8xl">{service.name}</h1>
            <p className="mt-6 text-base leading-7 text-white/80 sm:text-lg sm:leading-8">{service.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/booking">Book This Service</Button>
              <Button href="/pricing" variant="light">{service.priceLabel ?? "Request Pricing"}</Button>
            </div>
          </Reveal>
          <ImageCollage images={service.images} dark />
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 md:px-8 md:py-24 lg:grid-cols-3">
        {[
          ["Who it is for", service.forWhom],
          ["Benefits", service.benefits.join(" • ")],
          ["What is included", service.includes.join(" • ")],
        ].map(([title, body]) => (
          <Reveal key={title}>
            <div className="h-full rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
              <h2 className="font-serif text-3xl text-forest sm:text-4xl">{title}</h2>
              <p className="mt-5 leading-8 text-ink/70">{body}</p>
            </div>
          </Reveal>
        ))}
      </section>
      <section className="bg-sage/55 py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading eyebrow="Service process" title="A calm path from request to care." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, index) => (
              <div key={step} className="rounded-[2rem] bg-white p-7">
                <span className="font-serif text-4xl text-coral sm:text-5xl">0{index + 1}</span>
                <p className="mt-4 font-semibold leading-7">{step}</p>
              </div>
            ))}
          </div>
          <ImageRibbon images={service.images} />
        </div>
      </section>
      <FaqList faqs={service.faqs.map((faq, index) => ({ slug: `${service.slug}-${index}`, category: service.name, ...faq }))} />
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <SectionHeading eyebrow="Related services" title="Care that pairs well with this service." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {related.map((item) => <ServiceCard key={item.slug} service={item} />)}
        </div>
      </section>
      <BookingCTA image={service.images[4] ?? service.images[0]} />
    </>
  );
}

export function BlogDetail({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  return (
    <>
      <article className="bg-cream pt-24 md:pt-32">
        <div className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
          <p className="text-xs uppercase tracking-[0.24em] text-burgundy sm:text-sm sm:tracking-[0.34em]">{post.category}</p>
          <h1 className="mt-5 font-serif text-4xl leading-[0.98] text-forest sm:text-5xl md:text-7xl">{post.title}</h1>
          <p className="mt-6 text-base leading-8 text-ink/70 sm:text-lg">{post.excerpt}</p>
          <Image className="mt-10 h-72 w-full rounded-[2rem] object-cover sm:h-[34rem] sm:rounded-[3rem]" priority {...imageProps(post.featuredImage, "100vw")} alt={post.featuredImage.alt} />
          <div className="prose prose-lg mt-12 max-w-none text-ink/75">
            <p>{post.body}</p>
          </div>
          <ImageRibbon images={post.inlineImages} />
        </div>
      </article>
      {related.length ? <BlogGrid posts={related} title="Related notes" /> : null}
      <BookingCTA />
    </>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const [selected, setSelected] = useState(product.images[0]);
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-28 md:px-8 md:pb-20 md:pt-36 lg:grid-cols-2">
        <div>
          <Image className="h-80 w-full rounded-[2rem] object-cover sm:h-[38rem] sm:rounded-[3rem]" priority {...imageProps(selected, "(min-width: 1024px) 50vw, 100vw")} alt={selected.alt} />
          <div className="mt-4 grid grid-cols-5 gap-3">
            {product.images.slice(0, 5).map((image) => (
              <button key={image.id} onClick={() => setSelected(image)} className="overflow-hidden rounded-2xl border-2 border-transparent focus:border-forest">
                <Image className="h-16 w-full object-cover sm:h-24" {...imageProps(image, "120px")} alt={image.alt} />
              </button>
            ))}
          </div>
        </div>
        <div className="self-center">
          <p className="text-xs uppercase tracking-[0.24em] text-burgundy sm:text-sm sm:tracking-[0.34em]">Catalogue / Inquiry mode</p>
          <h1 className="mt-5 font-serif text-4xl leading-none text-forest sm:text-6xl">{product.title}</h1>
          <p className="mt-6 text-base leading-8 text-ink/70 sm:text-xl">{product.description}</p>
          <p className="mt-6 font-serif text-3xl text-burgundy sm:text-4xl">{product.priceLabel}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <InfoPill title="Sizes" value={product.sizes.join(", ")} />
            <InfoPill title="Colours" value={product.colors.join(", ")} />
            <InfoPill title="Inventory" value={`${product.inventory ?? 0} editable in CMS`} />
            <InfoPill title="Status" value={product.status} />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact">Ask About This Product</Button>
            <Button href="/shop" variant="outline">Back to Shop</Button>
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-24">
      <SectionHeading eyebrow="Signature services" title="Every service has its own care story, images and booking path." />
      <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => <ServiceCard key={service.slug} service={service} />)}
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.slug}`} className="group overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5 transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-forest/10">
      <div className="relative h-60 overflow-hidden sm:h-72">
        <Image className="h-full w-full object-cover transition duration-700 group-hover:scale-110" {...imageProps(service.images[0])} alt={service.images[0].alt} />
        <span className="absolute left-5 top-5 rounded-full bg-cream px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-forest">{service.eyebrow}</span>
      </div>
      <div className="p-5 sm:p-7">
        <h3 className="font-serif text-3xl text-forest sm:text-4xl">{service.name}</h3>
        <p className="mt-3 leading-7 text-ink/65 sm:min-h-20">{service.summary}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-bold text-burgundy">
          Learn More <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function PricingGrid({ pricing }: { pricing: PricingPackage[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pricing.map((item) => (
          <article key={item.slug} className={cx("rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5 sm:p-8", item.featured && "ring-2 ring-coral")}>
            {item.featured ? <span className="rounded-full bg-coral/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-burgundy">Featured</span> : null}
            <h2 className="mt-5 font-serif text-3xl text-forest sm:text-4xl">{item.service}</h2>
            <p className="mt-3 font-bold text-burgundy">{item.priceLabel}</p>
            <p className="mt-2 text-sm text-ink/55">{item.duration}</p>
            <ul className="mt-6 space-y-3">
              {item.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-6 text-ink/70">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-forest" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button href="/booking" variant="outline" className="mt-8">Request Quote</Button>
          </article>
        ))}
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
          <button key={category} onClick={() => setFilter(category)} className={cx("shrink-0 rounded-full px-5 py-3 text-sm font-bold capitalize transition", filter === category ? "bg-forest text-white" : "bg-white text-ink hover:bg-sage")}>
            {category.replace("-", " ")}
          </button>
        ))}
      </div>
      <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {visible.map((image, index) => (
          <button key={`${image.id}-${index}`} onClick={() => setActive(image)} className="mb-5 block w-full overflow-hidden rounded-[2rem] bg-white text-left shadow-xl shadow-black/5">
            <Image className="h-auto w-full object-cover transition duration-500 hover:scale-105" {...imageProps(image, "(min-width: 1024px) 33vw, 100vw")} alt={image.alt} loading={index < 3 ? "eager" : "lazy"} />
            <div className="p-5">
              <p className="font-serif text-2xl text-forest">{image.title}</p>
              <p className="mt-1 text-sm text-ink/60">{image.caption ?? image.alt}</p>
            </div>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {active ? (
          <motion.div className="fixed inset-0 z-[95] grid place-items-center bg-black/80 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button onClick={() => setActive(null)} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white" aria-label="Close image">
              <X className="h-5 w-5" />
            </button>
            <motion.div className="max-h-[90vh] max-w-5xl overflow-auto rounded-[2rem] bg-white" initial={{ scale: 0.94 }} animate={{ scale: 1 }}>
              <Image className="max-h-[78vh] w-full object-contain" {...imageProps(active, "90vw")} alt={active.alt} />
              <div className="p-5">
                <h3 className="font-serif text-3xl text-forest">{active.title}</h3>
                <p className="text-ink/65">{active.caption ?? active.alt}</p>
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
        <h2 className="mt-4 font-serif text-4xl text-forest">Still have questions?</h2>
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
      <h2 className="font-serif text-3xl text-forest sm:text-5xl">{title}</h2>
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
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const steps = ["Service Selection", "Pet & Hooman", "Date & Time", "Contact", "Pet Details", "Checkout / Deposit", "Confirmation"];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Submitting...");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, policyAgreement: data.policyAgreement === "on" }),
    });
    setStatus(response.ok ? "Booking request received. We will contact you soon." : "Something went wrong. Please review the form and try again.");
    if (response.ok) form.reset();
  }

  return (
    <section id="booking-form" className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
      <form onSubmit={submit} className="rounded-[2rem] bg-white p-4 shadow-2xl shadow-black/10 sm:p-5 md:rounded-[2.5rem] md:p-8">
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {steps.map((label, index) => (
            <button key={label} type="button" onClick={() => setStep(index)} className={cx("shrink-0 rounded-full px-4 py-3 text-sm font-bold", step === index ? "bg-forest text-white" : "bg-sage text-ink")}>
              {index + 1}. {label}
            </button>
          ))}
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
                <p className="mt-2 text-sm text-ink/60">Select daycare, boarding, walking, grooming or shuttle inquiry.</p>
              </div>
              <Field label="Selected service" name="service" as="select" required={step === 0} options={uniqueOptions(["Dog Daycare", "Overnight Boarding", "Dog Walking", "Dog Grooming", "Shuttle Service", ...services.map((service) => service.name)])} />
              <Field label="Package or duration" name="packageSelection" as="select" options={["Request pricing", "Half day", "Full day", "Overnight", "Morning walk", "Midday walk", "Afternoon walk", "Evening walk"]} />
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
                <p className="mt-3 leading-7 text-ink/70">Payments are not configured in this build. This request will be saved as Payment Pending until Stripe or another payment provider is configured.</p>
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
            <h3 className="mt-3 font-serif text-3xl text-forest">Request first, payment after confirmation.</h3>
            <p className="mt-4 text-sm leading-7 text-ink/65">Service availability, capacity, deposit amount, blackout dates and final payment terms remain admin-controlled.</p>
          </aside>
        </div>
        <div className="mt-8 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => setStep(Math.max(0, step - 1))} className="rounded-full border border-forest/20 px-5 py-3 font-bold">
              Back
            </button>
            {step < steps.length - 1 ? (
              <button type="button" onClick={() => setStep(Math.min(steps.length - 1, step + 1))} className="rounded-full bg-forest px-5 py-3 font-bold text-white transition hover:bg-burgundy">
                Continue
              </button>
            ) : (
              <button type="submit" className="rounded-full bg-forest px-6 py-3 font-bold text-white transition hover:bg-burgundy">
                Submit Booking Request
              </button>
            )}
          </div>
          {status ? <p className="font-semibold text-burgundy">{status}</p> : null}
        </div>
      </form>
    </section>
  );
}

function Field({ label, name, type = "text", required, textarea, as, options }: { label: string; name: string; type?: string; required?: boolean; textarea?: boolean; as?: "select"; options?: string[] }) {
  const className = "mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 outline-none ring-forest/20 transition focus:ring-4";
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

function BlogGrid({ posts, title = "Latest from The Paw Journal" }: { posts: BlogPost[]; title?: string }) {
  return (
    <section id="posts" className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <SectionHeading eyebrow="Journal" title={title} />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5">
            <Image className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-80" {...imageProps(post.featuredImage)} alt={post.featuredImage.alt} />
            <div className="p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-burgundy">{post.category}</p>
              <h2 className="mt-3 font-serif text-3xl text-forest sm:text-4xl">{post.title}</h2>
              <p className="mt-3 leading-7 text-ink/65">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="grid gap-6 md:grid-cols-2">
        {products.map((product) => (
          <Link key={product.slug} href={`/shop/${product.slug}`} className="group overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5">
            <Image className="h-80 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[32rem]" {...imageProps(product.images[0])} alt={product.images[0].alt} />
            <div className="p-5 sm:p-7">
              <h2 className="font-serif text-3xl text-forest sm:text-4xl">{product.title}</h2>
              <p className="mt-3 text-ink/65">{product.description}</p>
              <p className="mt-4 font-bold text-burgundy">{product.priceLabel}</p>
            </div>
          </Link>
        ))}
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
        <button className="rounded-full bg-forest px-6 py-3 font-bold text-white transition hover:bg-burgundy md:col-span-2">Save Gift Card Request</button>
        {status ? <p className="font-semibold text-burgundy md:col-span-2">{status}</p> : null}
      </form>
    </section>
  );
}

function TeamGrid({ team }: { team: TeamMember[] }) {
  return (
    <section id="team" className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <article key={member.slug} className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5">
            <Image className="h-72 w-full object-cover sm:h-96" {...imageProps(member.image)} alt={member.image.alt} />
            <div className="p-5 sm:p-7">
              <h2 className="font-serif text-3xl text-forest sm:text-4xl">{member.name}</h2>
              <p className="mt-1 font-bold text-burgundy">{member.role}</p>
              <p className="mt-4 leading-7 text-ink/65">{member.bio}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {member.credentials.map((credential) => <span key={credential} className="rounded-full bg-sage px-3 py-1 text-xs">{credential}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TestimonialsPreview({ testimonials, full }: { testimonials: Testimonial[]; full?: boolean }) {
  const items = full ? testimonials : testimonials.slice(0, 3);
  return (
    <section className="bg-forest py-14 text-white md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading eyebrow="Trusted care" title="Pet parents should feel the care before they book." inverse />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((testimonial) => (
            <article key={testimonial.slug} className="rounded-[2rem] bg-white/10 p-5 backdrop-blur sm:p-6">
              <Image className="h-48 w-full rounded-[1.5rem] object-cover sm:h-52" {...imageProps(testimonial.image)} alt={testimonial.image.alt} />
              <p className="mt-5 text-peach">{"★".repeat(testimonial.rating)}</p>
              <p className="mt-4 leading-8 text-white/80">{`"${testimonial.quote}"`}</p>
              <p className="mt-5 font-bold">{testimonial.reviewer} {testimonial.sample ? "(sample placeholder)" : ""}</p>
              <p className="text-sm text-white/60">{testimonial.petName} • {testimonial.service}</p>
            </article>
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
        <SectionHeading eyebrow="Gallery preview" title="A warm visual rhythm of walks, stays and care details." align="left" />
        <Button href="/gallery" variant="outline">Open Gallery</Button>
      </div>
      <ImageRibbon images={images.slice(0, 10)} />
    </section>
  );
}

function ShopPreview({ products }: { products: Product[] }) {
  return (
    <section className="bg-white py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading eyebrow="Boutique preview" title="Dog Mom and Dog Dad apparel, ready for final product photography." />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {products.slice(0, 2).map((product) => (
            <Link key={product.slug} href={`/shop/${product.slug}`} className="group grid overflow-hidden rounded-[2rem] bg-cream md:grid-cols-2">
              <Image className="h-72 w-full object-cover transition duration-500 group-hover:scale-105 sm:min-h-80 md:h-full" {...imageProps(product.images[0])} alt={product.images[0].alt} />
              <div className="p-5 sm:p-8">
                <h3 className="font-serif text-3xl text-forest sm:text-4xl">{product.title}</h3>
                <p className="mt-4 leading-7 text-ink/65">{product.description}</p>
                <p className="mt-5 font-bold text-burgundy">{product.priceLabel}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = ["Tell us about your pet", "Select the service", "Confirm the booking", "Relax while we provide professional care"];
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-24">
      <SectionHeading eyebrow="How booking works" title="Four calm steps from hello to care." />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step} className="rounded-[2rem] bg-white p-7 shadow-xl shadow-black/5">
            <span className="font-serif text-5xl text-coral sm:text-6xl">0{index + 1}</span>
            <p className="mt-5 font-semibold leading-7">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BookingCTA({ image = homePage.storyImages[4] }: { image?: ImageAsset }) {
  return (
    <section className="relative overflow-hidden py-16 text-white md:py-24">
      <Image className="absolute inset-0 h-full w-full object-cover" {...imageProps(image, "100vw")} alt={image.alt} />
      <div className="absolute inset-0 bg-forest/80" />
      <div className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
        <Sparkles className="mx-auto mb-6 h-10 w-10 text-peach" />
        <h2 className="font-serif text-4xl leading-none sm:text-5xl md:text-7xl">Ready to join the DTdogs clan?</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">Tell us about your pet and we will help you choose the right care experience.</p>
        <div className="mt-8">
          <Button href="/booking">Book a Meet & Greet</Button>
        </div>
      </div>
    </section>
  );
}

function ContactPanel() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-3">
      <InfoCard icon={<Phone />} title="Phone" body={brand.phone} href={`tel:${brand.phone}`} />
      <InfoCard icon={<CalendarDays />} title="Hours" body={`${brand.hours}. ${brand.boardingNote}`} />
      <InfoCard icon={<PawPrint />} title="Email" body={brand.email} href={`mailto:${brand.email}`} />
    </section>
  );
}

function InfoCard({ icon, title, body, href }: { icon: React.ReactNode; title: string; body: string; href?: string }) {
  const content = (
    <div className="h-full rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
      <div className="mb-6 grid h-12 w-12 place-items-center rounded-full bg-sage text-forest">{icon}</div>
      <h2 className="font-serif text-3xl text-forest sm:text-4xl">{title}</h2>
      <p className="mt-3 leading-7 text-ink/65">{body}</p>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}

function ImageCollage({ images, dark }: { images: ImageAsset[]; dark?: boolean }) {
  return (
    <Reveal>
      <div className="relative min-h-[26rem] sm:min-h-[34rem]">
        <Image className="absolute left-3 top-0 h-64 w-[76%] rounded-[2rem] object-cover shadow-2xl sm:left-8 sm:h-80 sm:w-[68%] sm:rounded-[3rem]" {...imageProps(images[0])} alt={images[0].alt} />
        <Image className="absolute bottom-10 right-0 h-56 w-[58%] rounded-[1.75rem] object-cover shadow-2xl sm:h-72 sm:w-[54%] sm:rounded-[2.5rem]" {...imageProps(images[1] ?? images[0])} alt={(images[1] ?? images[0]).alt} />
        <Image className="absolute bottom-0 left-0 h-40 w-36 rounded-[1.5rem] border-4 border-cream object-cover shadow-2xl sm:h-52 sm:w-48 sm:rounded-[2rem] sm:border-8" {...imageProps(images[2] ?? images[0], "200px")} alt={(images[2] ?? images[0]).alt} />
        <div className={cx("absolute right-2 top-8 rounded-[1.5rem] p-4 shadow-xl sm:right-8 sm:top-12 sm:rounded-[2rem] sm:p-5", dark ? "bg-white text-ink" : "bg-forest text-white")}>
          <p className="font-serif text-2xl sm:text-3xl">Calm care</p>
          <p className="max-w-44 text-sm opacity-70">Safety, comfort and connection in every routine.</p>
        </div>
      </div>
    </Reveal>
  );
}

function ImageRibbon({ images }: { images: ImageAsset[] }) {
  return (
    <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:mt-12 sm:gap-5 sm:px-0">
      {images.map((image, index) => (
        <figure key={`${image.id}-${index}`} className="min-w-[80vw] snap-start overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5 sm:min-w-[18rem]">
          <Image className="h-60 w-full object-cover sm:h-72" {...imageProps(image, "320px")} alt={image.alt} loading="lazy" />
          <figcaption className="p-4 text-sm text-ink/65">{image.caption ?? image.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function SectionHeading({ eyebrow, title, align = "center", inverse }: { eyebrow?: string; title: string; align?: "center" | "left"; inverse?: boolean }) {
  return (
    <div className={cx(align === "center" && "mx-auto text-center", "max-w-4xl")}>
      {eyebrow ? <p className={cx("mb-4 text-xs font-bold uppercase tracking-[0.24em] sm:text-sm sm:tracking-[0.34em]", inverse ? "text-peach" : "text-burgundy")}>{eyebrow}</p> : null}
      <h2 className={cx("font-serif text-4xl leading-[0.98] sm:text-5xl md:text-7xl", inverse ? "text-white" : "text-forest")}>{title}</h2>
    </div>
  );
}

function Button({ href, children, variant = "solid", className }: { href: string; children: React.ReactNode; variant?: "solid" | "light" | "outline"; className?: string }) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-center font-bold transition duration-300 hover:-translate-y-0.5 sm:w-auto",
        variant === "solid" && "bg-coral text-ink shadow-lg shadow-coral/20 hover:bg-burgundy hover:text-white",
        variant === "light" && "border border-white/30 bg-white/10 text-white backdrop-blur",
        variant === "outline" && "border border-forest/20 bg-transparent text-forest hover:border-burgundy hover:bg-burgundy hover:text-white",
        className,
      )}
    >
      {children} <ArrowRight className="h-4 w-4" />
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

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 34 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Footer({ services }: { services: Service[] }) {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-8 md:py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-coral text-ink"><PawPrint /></span>
            <div>
              <p className="font-serif text-3xl">DTdogs.ca</p>
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">Hand & Paw</p>
            </div>
          </div>
          <p className="mt-6 max-w-md leading-8 text-white/65">DTdogs.ca provides structured, attentive pet care across the Greater Toronto Area, with services designed around safety, comfort and calm routines.</p>
          <p className="mt-6 text-sm text-white/45">© {new Date().getFullYear()} DTdogs.ca. Owned and managed by Sunnyism.Pro.</p>
        </div>
        <FooterColumn title="Services" links={services.slice(0, 6).map((service) => ({ label: service.name, href: `/services/${service.slug}` }))} />
        <FooterColumn title="Explore" links={[{ label: "About", href: "/about" }, { label: "Pricing", href: "/pricing" }, { label: "Gallery", href: "/gallery" }, { label: "FAQ", href: "/faq" }, { label: "Journal", href: "/blog" }, { label: "Contact", href: "/contact" }]} />
        <FooterColumn title="Contact" links={[{ label: brand.email, href: `mailto:${brand.email}` }, { label: brand.phone, href: `tel:${brand.phone}` }, { label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: "Cancellation", href: "/cancellation-policy" }, { label: "Admin", href: "/admin" }]} />
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-serif text-2xl text-peach">{title}</h3>
      <div className="mt-5 grid gap-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-sm text-white/65 transition hover:text-white">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

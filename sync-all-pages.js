/**
 * SYNC ALL PAGES CONTENT TO DATABASE
 * 
 * This syncs ALL website pages with their current content:
 * - Home page
 * - Services page  
 * - About page (Our Vision)
 * - FAQ page
 * - Contact page
 * - Pricing page (Bundle)
 * - Gallery page
 * - Blog page
 * - Team page
 * - Shop page
 * - Gift Cards page
 * - Testimonials page
 * - Policy pages
 * - Treats page
 * 
 * Run with: node sync-all-pages.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/dtdogs';
const MONGODB_DB = 'dtdogs';

// All pages with their current content from the website
const pages = [
  {
    slug: "home",
    title: "Home",
    navTitle: "Home",
    seoTitle: "DTdogs.ca | Professional Pet Care in Downtown Toronto & GTA",
    metaDescription: "Premium dog walking, boarding, daycare, grooming & training across Downtown Toronto and the GTA. Structured care for your pet.",
    hero: {
      eyebrow: "Professional pet care across the Greater Toronto Area",
      title: "Calm care for every part of your pet's routine.",
      body: "From walks to overnight stays, grooming to training — structured pet care delivered by #petpeople who understand Downtown Toronto life.",
      primaryCta: { label: "Book Now", href: "/booking" },
      secondaryCta: { label: "View Services", href: "/services" },
      images: []
    },
    blocks: [],
    status: "published"
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
      images: []
    },
    blocks: [],
    status: "published"
  },
  {
    slug: "our-vision",
    title: "Our Vision",
    navTitle: "About",
    seoTitle: "About DTdogs.ca | Our Story & Vision for Pet Care in Toronto",
    metaDescription: "Meet the team behind DTdogs.ca — structured, transparent pet care built for Downtown Toronto families and their pets.",
    hero: {
      eyebrow: "Our foundation",
      title: "Built on calm routines, honest updates and Downtown Toronto life.",
      body: "We believe every pet deserves structured care, clear communication and handlers who treat them like family.",
      primaryCta: { label: "Meet the Team", href: "/team" },
      secondaryCta: { label: "View Services", href: "/services" },
      images: []
    },
    blocks: [
      {
        type: "story",
        eyebrow: "Founder story",
        title: "A vision rooted in trust and transparency.",
        body: "DTdogs.ca was built to serve pet parents across Downtown Toronto and the GTA with the kind of care we'd want for our own pets — structured routines, honest communication and handlers who genuinely care.",
        images: []
      }
    ],
    status: "published"
  },
  {
    slug: "faq",
    title: "FAQ",
    navTitle: "FAQ",
    seoTitle: "DTdogs.ca FAQs | Pet Care Questions Answered",
    metaDescription: "Get answers to common questions about dog daycare, boarding, grooming, walking and pet care services across Toronto.",
    hero: {
      eyebrow: "Questions answered",
      title: "Everything you need to know about DTdogs care.",
      body: "Browse frequently asked questions about booking, services, policies and pet requirements.",
      primaryCta: { label: "Book Now", href: "/booking" },
      secondaryCta: { label: "Contact Us", href: "/contact" },
      images: []
    },
    blocks: [],
    status: "published"
  },
  {
    slug: "contact",
    title: "Contact",
    navTitle: "Contact",
    seoTitle: "Contact DTdogs.ca | Get in Touch for Pet Care in Toronto",
    metaDescription: "Contact DTdogs.ca for pet care inquiries, bookings and questions. Serving Downtown Toronto and across the GTA.",
    hero: {
      eyebrow: "Get in touch",
      title: "Let's talk about your pet's care.",
      body: "Have questions about services, booking or pet requirements? We're here to help.",
      primaryCta: { label: "Book Now", href: "/booking" },
      secondaryCta: { label: "WhatsApp Us", href: "https://wa.me/14379375112" },
      images: []
    },
    blocks: [],
    status: "published"
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
      images: []
    },
    blocks: [],
    status: "published"
  },
  {
    slug: "gallery",
    title: "Gallery",
    navTitle: "Gallery",
    seoTitle: "DTdogs.ca Gallery | Pet Care Photos from Toronto & GTA",
    metaDescription: "A visual journal of safe stays, happy walks and structured pet-care across Downtown Toronto and the GTA.",
    hero: {
      eyebrow: "The DTdogs clan, in their element",
      title: "A visual journal of safe stays, happy walks and Structured pet-care.",
      body: "Real moments from Downtown Toronto and across the GTA — walks, boarding, daycare and everyday care with our #petpeople.",
      primaryCta: { label: "Book Now", href: "/booking" },
      secondaryCta: { label: "View Services", href: "/services" },
      images: []
    },
    blocks: [],
    status: "published"
  },
  {
    slug: "blog",
    title: "Blog",
    navTitle: "Blog",
    seoTitle: "DTdogs.ca Blog | Pet Care Tips & Stories from Toronto",
    metaDescription: "Read pet care guides, training tips and stories from DTdogs.ca — serving Downtown Toronto and the GTA.",
    hero: {
      eyebrow: "Care guides & stories",
      title: "Insights from the DTdogs journal.",
      body: "Pet care tips, training advice and stories from Downtown Toronto and across the GTA.",
      primaryCta: { label: "View All Posts", href: "/blog" },
      secondaryCta: { label: "Contact Us", href: "/contact" },
      images: []
    },
    blocks: [],
    status: "published"
  },
  {
    slug: "team",
    title: "Our Team",
    navTitle: "Our Team",
    seoTitle: "Meet the DTdogs.ca Team | Pet Care Professionals in Toronto",
    metaDescription: "Meet the #petpeople behind DTdogs.ca — experienced caregivers serving Downtown Toronto and across the GTA.",
    hero: {
      eyebrow: "Meet the #petpeople",
      title: "The handlers behind every walk, stay and care moment.",
      body: "We are a team of #petpeople and #petparents — experienced, certified and passionate about structured pet care across Toronto.",
      primaryCta: { label: "Book Now", href: "/booking" },
      secondaryCta: { label: "View Services", href: "/services" },
      images: []
    },
    blocks: [
      {
        type: "story",
        eyebrow: "Our team",
        title: "Experienced caregivers across the GTA.",
        body: "Each team member brings professional training, genuine care and a commitment to the structured routines that keep pets calm and happy.",
        images: []
      }
    ],
    status: "published"
  },
  {
    slug: "shop",
    title: "Shop",
    navTitle: "Shop",
    seoTitle: "DTdogs.ca Shop | Pet Parent Apparel & Gift Cards",
    metaDescription: "Shop DTdogs.ca apparel for dog moms and dads, plus digital gift cards for pet care services.",
    hero: {
      eyebrow: "For #petparents",
      title: "Apparel and gift cards for the DTdogs community.",
      body: "Dog Mom and Dog Dad long-sleeve shirts, plus digital gift cards for pet care services.",
      primaryCta: { label: "View Products", href: "/shop" },
      secondaryCta: { label: "Gift Cards", href: "/gift-cards" },
      images: []
    },
    blocks: [],
    status: "published"
  },
  {
    slug: "gift-cards",
    title: "Gift Cards",
    navTitle: "Gift Cards",
    seoTitle: "DTdogs.ca Gift Cards | Give the Gift of Pet Care",
    metaDescription: "Purchase DTdogs.ca digital gift cards for pet care services across Downtown Toronto and the GTA.",
    hero: {
      eyebrow: "Give the gift of care",
      title: "DTdogs.ca digital gift cards.",
      body: "Perfect for pet parents — redeemable for walks, boarding, daycare, grooming and all DTdogs services.",
      primaryCta: { label: "Purchase Gift Card", href: "/shop" },
      secondaryCta: { label: "View Services", href: "/services" },
      images: []
    },
    blocks: [],
    status: "published"
  },
  {
    slug: "testimonials",
    title: "Testimonials",
    navTitle: "Reviews",
    seoTitle: "DTdogs.ca Reviews | Pet Parent Testimonials from Toronto",
    metaDescription: "Read reviews and testimonials from pet parents across Downtown Toronto and the GTA who trust DTdogs.ca.",
    hero: {
      eyebrow: "Client stories",
      title: "Trusted by pet parents across Toronto.",
      body: "Real reviews from families who trust DTdogs.ca for walks, boarding, daycare and everyday pet care.",
      primaryCta: { label: "Book Now", href: "/booking" },
      secondaryCta: { label: "View Services", href: "/services" },
      images: []
    },
    blocks: [],
    status: "published"
  },
  {
    slug: "treats",
    title: "Treats",
    navTitle: "Treats",
    seoTitle: "DTdogs.ca Treats | Special Treats for the Dogs",
    metaDescription: "Explore special treats and goodies for the DTdogs clan.",
    hero: {
      eyebrow: "For the clan",
      title: "Treats for the Dogs",
      body: "Special goodies and treats for our favorite furry friends.",
      primaryCta: { label: "Ask About Treats", href: "/contact" },
      secondaryCta: { label: "View Services", href: "/services" },
      images: []
    },
    blocks: [],
    status: "published"
  },
  {
    slug: "policy",
    title: "Policies",
    navTitle: "Policies",
    seoTitle: "DTdogs.ca Policies | Terms, Privacy & Care Guidelines",
    metaDescription: "Read DTdogs.ca policies including terms of service, privacy policy and pet care guidelines.",
    hero: {
      eyebrow: "Our policies",
      title: "Clear terms for transparent care.",
      body: "Review our terms of service, privacy policy, cancellation policy and care guidelines.",
      primaryCta: { label: "Contact Us", href: "/contact" },
      secondaryCta: { label: "Book Now", href: "/booking" },
      images: []
    },
    blocks: [
      {
        type: "story",
        title: "Terms of Service",
        body: "By using DTdogs.ca services, you agree to our terms and conditions. All bookings are subject to availability and confirmation.",
        images: []
      },
      {
        type: "story",
        title: "Privacy Policy",
        body: "We respect your privacy and protect your personal information. Your data is used only for booking and service purposes.",
        images: []
      },
      {
        type: "story",
        title: "Cancellation Policy",
        body: "Cancellations require advance notice. Please contact us via WhatsApp or email as soon as possible.",
        images: []
      }
    ],
    status: "published"
  }
];

async function syncAllPages() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Sync ALL Pages with content
    console.log('📦 Syncing ALL pages with complete content...');
    
    for (const page of pages) {
      await db.collection('pages').updateOne(
        { slug: page.slug },
        { $set: page },
        { upsert: true }
      );
      console.log(`✅ Synced: ${page.title} (${page.slug})`);
    }
    
    console.log(`\n✅ Synced ${pages.length} pages with complete content\n`);

    console.log('✅ All page content synced successfully!');
    console.log('💡 Now go to admin panel and edit any page');
    console.log('💡 Changes will appear on frontend immediately');

  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

syncAllPages();

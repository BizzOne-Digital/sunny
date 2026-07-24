/**
 * SYNC COMPLETE HOME PAGE WITH ALL SECTIONS
 * 
 * Syncs entire home page with:
 * - Hero section
 * - Stats cards (Happy Pets, Pet Parents, Experience, Care & Attention)
 * - Our Vision section with image
 * - Why Choose Us section with 6 points
 * - Trusted care section
 * - How booking works (4 steps)
 * - Meet Founder section
 * - Gallery preview section
 * - Shop preview section
 * 
 * Run with: node sync-home-page-full.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/dtdogs';
const MONGODB_DB = 'dtdogs';

// Complete home page with ALL sections
const homePageFull = {
  slug: "home",
  title: "Home",
  navTitle: "Home",
  seoTitle: "DTdogs.ca | Professional Pet Care in Downtown Toronto & GTA",
  metaDescription: "Premium dog walking, boarding, daycare, grooming & training across Downtown Toronto and the GTA. Structured care for your pet.",
  
  // Hero Section
  hero: {
    eyebrow: "Structured pet care · Downtown Toronto & GTA",
    title: "Welcome to DTdogs.ca",
    subtitle: "(Formerly Known As: Handandpaw.ca / Handandpaw.in)",
    body: "Professional, structured pet care in Downtown Toronto, proudly serving the GTA year-round. We are team of #petpeople and #petparents.",
    primaryCta: { label: "Book Now", href: "/booking" },
    secondaryCta: { label: "Explore Services", href: "/services" },
    images: [],
    badge: {
      title: "Since 2021",
      subtitle: "Consistent, nurturing services for your pet's well-being"
    }
  },
  
  // Page Sections (blocks)
  blocks: [
    // Stats Cards Section
    {
      type: "stats",
      eyebrow: "",
      title: "Our Impact",
      body: "",
      items: [
        {
          icon: "🐾",
          title: "Happy Pets",
          body: "Happy Pets & Counting",
          image: null
        },
        {
          icon: "👨‍👩‍👧‍👦",
          title: "Pet Parents",
          body: "Hundreds of petparents and counting",
          image: null
        },
        {
          icon: "⭐",
          title: "Experience",
          body: "4+ years of serving across GTA and counting",
          image: null
        },
        {
          icon: "❤️",
          title: "Care & Attention",
          body: "100% care with intentions",
          image: null
        }
      ],
      images: []
    },
    
    // Our Vision Section with Image
    {
      type: "story",
      eyebrow: "Our Vision",
      title: "Professional and structured pet care in Downtown Toronto, serving across the GTA in every season.",
      body: "DTdogs.ca (formerly known as Handandpaw.ca / Handandpaw.in) offers structured pet care for discerning pet parents. Located in Downtown, Toronto — serving across GTA and operating all season. We are a team of #petpeople and #petparents. Our vision is simple: safe, professional care in a calm, home-style environment — with clear updates while you're away.",
      primaryCta: { label: "Read Our Vision", href: "/our-vision" },
      images: [
        {
          id: "about-1",
          title: "Our Vision",
          alt: "Pet-care professional sitting with a happy dog",
          url: "/images/about/about-1.jpg",
          width: 800,
          height: 1000,
          status: "published"
        }
      ]
    },
    
    // Our Services Section
    {
      type: "cards",
      eyebrow: "Our services",
      title: "Structured care services for every reason in the GTA",
      body: "From walks to overnight stays, grooming to training — professional pet care delivered by #petpeople who understand the rhythm of Downtown Toronto life.",
      primaryCta: { label: "View All Services", href: "/services" },
      items: [],
      images: []
    },
    
    // Why Choose Us Section
    {
      type: "features",
      eyebrow: "Why choose us",
      title: "Uncompromised care for your pet's happiness.",
      body: "",
      items: [
        {
          icon: "✓",
          title: "Food safety and hygiene monitored",
          body: "",
          image: null
        },
        {
          icon: "✓",
          title: "Comfortable, adjusted temperature",
          body: "",
          image: null
        },
        {
          icon: "✓",
          title: "Certified first-aid and canine behaviour knowledge",
          body: "",
          image: null
        },
        {
          icon: "✓",
          title: "24/7 CCTV surveillance",
          body: "",
          image: null
        },
        {
          icon: "✓",
          title: "Controlled group sizes",
          body: "",
          image: null
        },
        {
          icon: "✓",
          title: "Secure handling and calm routines",
          body: "",
          image: null
        }
      ],
      images: [
        {
          id: "home-why-a",
          title: "Calm care",
          alt: "Dog resting comfortably in care environment",
          url: "/images/home/home-why-a.png",
          width: 600,
          height: 400,
          status: "published"
        },
        {
          id: "home-why-b",
          title: "Safe play",
          alt: "Dog enjoying safe outdoor activity",
          url: "/images/home/home-why-b.png",
          width: 600,
          height: 400,
          status: "published"
        }
      ]
    },
    
    // Trusted Care Section
    {
      type: "testimonials",
      eyebrow: "Trusted care",
      title: "We are a team of #petpeople and #petparents.",
      body: "",
      primaryCta: { label: "Read More", href: "/testimonials" },
      items: [],
      images: []
    },
    
    // How Booking Works Section
    {
      type: "process",
      eyebrow: "How booking works",
      title: "Four calm steps from hello to care.",
      body: "",
      items: [
        {
          number: "01",
          title: "Choose Your Service",
          body: "Browse our services and select the care that best suits your pet's needs.",
          image: null
        },
        {
          number: "02",
          title: "Pick a Date & Time",
          body: "Pick a date & time with your pet name, provide straightforward contact.",
          image: null
        },
        {
          number: "03",
          title: "Confirm & Pay",
          body: "Sign up your meet-greet, requesting insurance and guidance, we are ready to serve.",
          image: null
        },
        {
          number: "04",
          title: "You're All Set!",
          body: "Review your confirmation and get ready for your pet's care. Customer's peace-of-mind plan and escort always connect with us.",
          image: null
        }
      ],
      images: []
    },
    
    // Meet Founder Section
    {
      type: "founder",
      eyebrow: "Trusted idea",
      title: "Meet Sunnyism.Pro #DogDad",
      body: "At new & this, we offer structured services for years of discerning pet owners. Our mission is simple: to provide safe and professional care that ensures a calm environment that is comfort for your pets while you're away. Since 2021, we have built trust through transparent re-routing agencies for your pet's well-being. If familiar Toronto-driven.",
      primaryCta: { label: "Our Vision", href: "/our-vision" },
      images: [
        {
          id: "about-founder",
          title: "Founder",
          alt: "Founder with pet",
          url: "/images/about/about-founder.webp",
          width: 800,
          height: 1000,
          status: "published"
        }
      ]
    },
    
    // Gallery Preview Section
    {
      type: "gallery",
      eyebrow: "Gallery preview",
      title: "A warm visual rhythm of walks, stays and care details.",
      body: "",
      primaryCta: { label: "Open Gallery", href: "/gallery" },
      items: [],
      images: [
        {
          id: "gallery-1",
          url: "/images/gallery/gallery-1.png",
          alt: "Dog walk",
          title: "Gallery preview 1",
          width: 400,
          height: 400,
          status: "published"
        },
        {
          id: "gallery-2",
          url: "/images/gallery/gallery-2.png",
          alt: "Dog care",
          title: "Gallery preview 2",
          width: 400,
          height: 400,
          status: "published"
        },
        {
          id: "gallery-3",
          url: "/images/gallery/gallery-3.png",
          alt: "Dog daycare",
          title: "Gallery preview 3",
          width: 400,
          height: 400,
          status: "published"
        }
      ]
    },
    
    // Shop Preview Section
    {
      type: "shop",
      eyebrow: "Booking preview",
      title: "Dog Dad and Dog Mom merch — coming soon in 2026.",
      body: "",
      primaryCta: { label: "Shop Now", href: "/shop" },
      items: [],
      images: []
    }
  ],
  
  status: "published"
};

async function syncHomePageFull() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    console.log('📦 Syncing COMPLETE Home Page with ALL sections...\n');
    
    await db.collection('pages').updateOne(
      { slug: 'home' },
      { $set: homePageFull },
      { upsert: true }
    );
    
    console.log('✅ Synced Home page with:');
    console.log('  ✓ Hero section (with badge)');
    console.log('  ✓ Stats cards (4 items)');
    console.log('  ✓ Our Vision section (with image)');
    console.log('  ✓ Services preview');
    console.log('  ✓ Why Choose Us (6 features + 2 images)');
    console.log('  ✓ Trusted care section');
    console.log('  ✓ How booking works (4 steps)');
    console.log('  ✓ Meet Founder section (with image)');
    console.log('  ✓ Gallery preview (3 images)');
    console.log('  ✓ Shop preview section');
    
    console.log('\n✅ Home page fully synced!');
    console.log('💡 Go to admin/pages and edit Home page');
    console.log('💡 All sections are now editable!');

  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

syncHomePageFull();

/**
 * SYNC OUR VISION PAGE WITH ALL SECTIONS
 * 
 * Syncs complete our-vision page with:
 * - Hero section
 * - Team section (eyebrow, title, body - team members come from team collection)
 * - Our Story section (3 images + text)
 * - What Guides Us section (3 cards with images)
 * - Our Vision section (multiple images + text)
 * 
 * Run with: node sync-our-vision-page.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/dtdogs';
const MONGODB_DB = 'dtdogs';

const ourVisionPage = {
  slug: "our-vision",
  title: "Our Vision",
  navTitle: "Our Vision",
  seoTitle: "Our Vision | DTdogs.ca | Professional Pet Care Philosophy",
  metaDescription: "Learn about DTdogs.ca's vision for professional, structured pet care in Toronto. Safety, calm routines, and genuine care for your pets.",
  
  // Hero Section
  hero: {
    eyebrow: "Care designed around calm, trust and connection",
    title: "Professional pet care with warmth, structure and real attention.",
    body: "Since 2021, DTdogs.ca has served pet families across the Greater Toronto Area through consistent, nurturing care. Our vision is simple: structured, professional services in a calm environment — with honest communication so every pet parent can leave with confidence.",
    primaryCta: { label: "Book Now", href: "/booking" },
    secondaryCta: { label: "Book Care", href: "/booking" },
    images: []
  },
  
  // Page Sections (blocks)
  blocks: [
    // Team Section
    {
      type: "cards",
      eyebrow: "Our Team",
      title: "Experienced hands, calm energy, genuine care.",
      body: "Meet our trusted partners in pet care across the GTA — professionals who bring genuine care and expertise to every interaction.",
      items: [],
      images: []
    },
    
    // Our Story Section
    {
      type: "story",
      eyebrow: "Our Story",
      title: "Care that feels calm, predictable and personal.",
      body: "At DTdogs.ca, we provide structured pet-care services for discerning pet parents. Every routine is designed to support safety, comfort and emotional well-being while pets are away from home or receiving care in their own familiar environment.",
      images: [
        {
          id: "about-1",
          title: "Pet care professional with dog",
          alt: "Pet-care professional sitting with a happy dog in a bright care space",
          url: "/images/about/about-1.jpg",
          width: 1024,
          height: 1280,
          status: "published"
        },
        {
          id: "about-2",
          title: "Clean care environment",
          alt: "Bright clean dog-care environment with calm dogs resting",
          url: "/images/about/about-2.png",
          width: 1024,
          height: 576,
          status: "published"
        },
        {
          id: "about-3",
          title: "Toronto dog walk",
          alt: "Dog handler walking a happy dog through a leafy neighbourhood",
          url: "/images/about/about-3.png",
          width: 819,
          height: 1024,
          status: "published"
        }
      ]
    },
    
    // What Guides Us Section
    {
      type: "imageGrid",
      eyebrow: "What guides us",
      title: "Safety before speed, calm before chaos.",
      body: "",
      items: [
        {
          title: "Structured routines",
          body: "Pets thrive when care is predictable, attentive and tailored to individual personality.",
          image: {
            id: "structured-routines-card",
            title: "Structured routines",
            alt: "Calm dog receiving gentle structured care in a premium indoor setting",
            url: "/images/about/Structured-Routines-Card.jpg",
            width: 1400,
            height: 1050,
            status: "published"
          }
        },
        {
          title: "Honest communication",
          body: "Clear updates help pet parents feel connected while away.",
          image: {
            id: "honest-communication-card",
            title: "Honest communication",
            alt: "Happy dog near a smartphone and care notebook for owner updates",
            url: "/images/about/Honest-Communication-Card.jpg",
            width: 1400,
            height: 1050,
            status: "published"
          }
        },
        {
          title: "Clean environments",
          body: "Food safety, hygiene and comfort are treated as core care standards.",
          image: {
            id: "clean-environments-card",
            title: "Clean environments",
            alt: "Clean modern pet-care environment with a happy dog and caregiver",
            url: "/images/about/Clean-Environments-Card.jpg",
            width: 1400,
            height: 1050,
            status: "published"
          }
        }
      ],
      images: []
    },
    
    // Our Vision Section
    {
      type: "gallery",
      eyebrow: "Our Vision",
      title: "Dependable care, clean routines and reliable communication.",
      body: "We envision a safer, structured rhythm for pets and their people — structured services, honest updates, and home-style comfort that pet parents can trust while they are away.",
      items: [],
      images: [
        {
          id: "floating-pup-2",
          title: "Calm dog portrait",
          alt: "Happy relaxed dog sitting calmly in a warm modern indoor space",
          url: "/images/home/floating-pup-2.webp",
          width: 1200,
          height: 1200,
          status: "published"
        },
        {
          id: "booking-bg-2",
          title: "Care planning moment",
          alt: "Calm dog near a neatly arranged care checklist, leash and notebook",
          url: "/images/booking/booking-bg-2.webp",
          width: 1800,
          height: 1100,
          status: "published"
        },
        {
          id: "trust-full",
          title: "Trusted calm routine",
          alt: "Dog relaxing during a calm supervised care routine",
          url: "/images/home/trust-full.webp",
          width: 1800,
          height: 1000,
          status: "published"
        },
        {
          id: "pet-visit",
          title: "In-home pet visit",
          alt: "Caregiver offering gentle attention during an in-home pet visit",
          url: "/images/services/servicespet-visit.webp",
          width: 1400,
          height: 1000,
          status: "published"
        }
      ]
    }
  ],
  
  status: "published"
};

async function syncOurVisionPage() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    console.log('📦 Syncing Our Vision Page with ALL sections...\n');
    
    await db.collection('pages').updateOne(
      { slug: 'our-vision' },
      { $set: ourVisionPage },
      { upsert: true }
    );
    
    console.log('✅ Synced Our Vision page with:');
    console.log('  ✓ Hero section');
    console.log('  ✓ Team section (eyebrow, title, body)');
    console.log('  ✓ Our Story section (3 images + text)');
    console.log('  ✓ What Guides Us section (3 cards with images)');
    console.log('  ✓ Our Vision section (4 images + text)');
    
    console.log('\n✅ Our Vision page fully synced!');
    console.log('💡 Go to admin/pages and edit Our Vision page');
    console.log('💡 All sections are now editable!');

  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

syncOurVisionPage();

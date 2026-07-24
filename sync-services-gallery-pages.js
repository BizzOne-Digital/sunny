/**
 * SYNC SERVICES & GALLERY PAGES
 * 
 * Syncs services and gallery pages with editable hero sections
 * 
 * Run with: node sync-services-gallery-pages.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/dtdogs';
const MONGODB_DB = 'dtdogs';

const servicesPage = {
  slug: "services",
  title: "Services",
  navTitle: "Services",
  seoTitle: "Pet Care Services | DTdogs.ca | Toronto & GTA",
  metaDescription: "Professional pet care services in Toronto and GTA - dog walking, boarding, daycare, grooming, and training.",
  
  hero: {
    eyebrow: "Our Services",
    title: "Professional pet care with warmth, structure and real attention.",
    body: "Structured care options for every season in the GTA.",
    primaryCta: { label: "Book Now", href: "/booking" },
    secondaryCta: { label: "Contact Us", href: "/contact" },
    images: []
  },
  
  blocks: [],
  status: "published"
};

const galleryPage = {
  slug: "gallery",
  title: "Gallery",
  navTitle: "Gallery",
  seoTitle: "Gallery | DTdogs.ca | Pet Care Photos",
  metaDescription: "View our gallery of happy pets enjoying professional care across Toronto and GTA.",
  
  hero: {
    eyebrow: "Gallery",
    title: "A warm visual rhythm of walks, stays and care details.",
    body: "Moments from real care days across Downtown Toronto and the GTA.",
    primaryCta: { label: "Book Now", href: "/booking" },
    secondaryCta: { label: "Contact Us", href: "/contact" },
    images: []
  },
  
  blocks: [
    {
      type: "gallery",
      eyebrow: "Our Gallery",
      title: "See our work",
      body: "",
      images: []
    }
  ],
  status: "published"
};

async function syncPages() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    console.log('📦 Syncing Services & Gallery Pages...\n');
    
    // Sync services page
    await db.collection('pages').updateOne(
      { slug: 'services' },
      { $set: servicesPage },
      { upsert: true }
    );
    console.log('✅ Synced Services page');
    
    // Sync gallery page
    await db.collection('pages').updateOne(
      { slug: 'gallery' },
      { $set: galleryPage },
      { upsert: true }
    );
    console.log('✅ Synced Gallery page');
    
    console.log('\n✅ Both pages fully synced!');
    console.log('💡 Now you can edit these pages from: Admin → Pages');
    console.log('💡 Changes will reflect on frontend after refresh!');

  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

syncPages();

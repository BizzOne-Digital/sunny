/**
 * SYNC PRICING/BUNDLE PAGE
 * 
 * Syncs pricing page with:
 * - Hero section (editable)
 * - Pricing section heading (editable eyebrow, title, body)
 * - Pricing packages come from separate 'pricing' collection
 * 
 * Run with: node sync-pricing-page.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/dtdogs';
const MONGODB_DB = 'dtdogs';

const pricingPage = {
  slug: "pricing",
  title: "Bundle",
  navTitle: "Bundle",
  seoTitle: "Pricing & Packages | DTdogs.ca | Pet Care Bundles",
  metaDescription: "Choose from our structured pet care packages - daycare, boarding, and dog walks. Transparent pricing for every dog size.",
  
  // Hero Section
  hero: {
    eyebrow: "Dog Daycare, Boarding & Dog Walks",
    title: "Clear packages for structured play, enrichment and overnight care.",
    body: "Choose pay-as-you-go daycare, overnight boarding, or value packages — all with structured enrichment activities.",
    primaryCta: { label: "Book Now", href: "/booking" },
    secondaryCta: { label: "Contact Us", href: "/contact" },
    images: []
  },
  
  // Pricing Section (heading only - packages come from pricing collection)
  blocks: [
    {
      type: "cards",
      eyebrow: "Dog daycare, boarding & dog walks",
      title: "Choose your package",
      body: "",
      items: [],
      images: []
    }
  ],
  
  status: "published"
};

async function syncPricingPage() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    console.log('📦 Syncing Pricing/Bundle Page...\n');
    
    await db.collection('pages').updateOne(
      { slug: 'pricing' },
      { $set: pricingPage },
      { upsert: true }
    );
    
    console.log('✅ Synced Pricing page with:');
    console.log('  ✓ Hero section (eyebrow, title, body, CTAs)');
    console.log('  ✓ Pricing section heading (eyebrow, title, body)');
    
    console.log('\n💡 IMPORTANT:');
    console.log('  • Hero section ab editable hai: Pages → Pricing');
    console.log('  • Pricing packages manage karne ke liye: Admin → Pricing');
    console.log('  • Pricing packages alag se "pricing" collection mein hain\n');
    
    console.log('✅ Pricing page fully synced!');

  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

syncPricingPage();

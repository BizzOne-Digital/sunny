/**
 * CHECK AND CLEAN ALL UNWANTED PAGES
 * 
 * First lists all pages, then deletes unwanted ones
 * 
 * Run with: node check-and-clean-pages.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/dtdogs';
const MONGODB_DB = 'dtdogs';

// Pages we WANT to keep
const pagesToKeep = [
  'home',
  'services',
  'our-vision',
  'faq',
  'contact',
  'pricing',
  'gallery',
  'blog',
  'team',
  'shop',
  'gift-cards',
  'testimonials',
  'treats',
  'policy'  // Keep this one general policy page
];

async function checkAndCleanPages() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // First, list all pages
    console.log('📋 Current pages in database:\n');
    const allPages = await db.collection('pages').find({}).toArray();
    
    allPages.forEach(page => {
      const keep = pagesToKeep.includes(page.slug);
      const marker = keep ? '✅ KEEP' : '❌ DELETE';
      console.log(`${marker} - ${page.title || page.slug} (${page.slug})`);
    });

    console.log('\n🗑️  Deleting unwanted pages...\n');
    
    // Delete pages not in the keep list
    for (const page of allPages) {
      if (!pagesToKeep.includes(page.slug)) {
        const result = await db.collection('pages').deleteOne({ slug: page.slug });
        if (result.deletedCount > 0) {
          console.log(`✅ Deleted: ${page.title || page.slug} (${page.slug})`);
        }
      }
    }
    
    console.log(`\n✅ Cleanup complete!`);
    console.log(`💡 Kept ${pagesToKeep.length} pages`);
    console.log('💡 Refresh admin panel to see changes');

  } catch (error) {
    console.error('❌ Operation failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

checkAndCleanPages();

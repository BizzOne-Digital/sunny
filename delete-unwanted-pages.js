/**
 * DELETE UNWANTED PAGES FROM DATABASE
 * 
 * This deletes these pages from admin panel:
 * - About Us
 * - Terms and Conditions
 * - Cancellation Policy
 * - Privacy Policy
 * - Refund and Return Policy
 * - Policies
 * 
 * Run with: node delete-unwanted-pages.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/dtdogs';
const MONGODB_DB = 'dtdogs';

// Pages to delete (by slug)
const pagesToDelete = [
  'about-us',
  'terms-and-conditions',
  'cancellation-policy',
  'privacy-policy',
  'refund-and-return-policy',
  'policies'
];

async function deleteUnwantedPages() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    console.log('🗑️  Deleting unwanted pages...\n');
    
    for (const slug of pagesToDelete) {
      const result = await db.collection('pages').deleteOne({ slug });
      if (result.deletedCount > 0) {
        console.log(`✅ Deleted: ${slug}`);
      } else {
        console.log(`⚠️  Not found: ${slug}`);
      }
    }
    
    console.log(`\n✅ Cleanup complete!`);
    console.log('💡 Refresh admin panel to see changes');

  } catch (error) {
    console.error('❌ Delete failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

deleteUnwantedPages();

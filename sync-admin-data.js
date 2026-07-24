/**
 * Sync script to populate MongoDB admin panel with seed data from site.ts
 * 
 * This script syncs:
 * - Services (7 current services)
 * - Products (3 products: gift card + merch)
 * - Team members (6 members)
 * - FAQs
 * - Pricing packages
 * 
 * Run with: node sync-admin-data.js
 */

const mongoose = require('mongoose');

// Use hardcoded values from .env.local
const MONGODB_URI = 'mongodb://127.0.0.1:27017/dtdogs';
const MONGODB_DB = 'dtdogs';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function syncAdminData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Sync Services
    console.log('\n📦 Syncing Services...');
    
    // First, clear ALL existing services
    await db.collection('services').deleteMany({});
    console.log('✅ Cleared old services');
    
    const services = [
      { slug: 'dog-walking', name: 'Dog Walking', status: 'published' },
      { slug: 'grooming', name: 'Pet Grooming', status: 'published' },
      { slug: 'daycare', name: 'Day Care', status: 'published' },
      { slug: 'boarding', name: 'Boarding', status: 'published' },
      { slug: 'nail-trim', name: 'Nail Trimming', status: 'published' },
      { slug: 'behaviour-training', name: 'Behaviour Training', status: 'published' },
      { slug: 'pet-dental-cleaning', name: 'Pet Dental Cleaning', status: 'published' }
    ];

    for (const service of services) {
      await db.collection('services').insertOne(service);
    }
    console.log(`✅ Synced ${services.length} services`);

    // Sync Products
    console.log('\n📦 Syncing Products...');
    const products = [
      {
        slug: 'gift-card-150',
        title: 'DTdogs Digital Gift Card - $150',
        description: 'One gift card value: CAD $150. Buy as many as you need for friends, family, or pet parents.',
        priceLabel: 'CAD $150',
        status: 'inquiry',
        inventory: 999
      },
      {
        slug: 'dog-dad-merch',
        title: 'Dog Dad Merch',
        description: 'Coming Soon #2026',
        priceLabel: '$33.00',
        compareAtPriceLabel: '$41.00',
        status: 'coming-soon',
        inventory: 0
      },
      {
        slug: 'dog-mom-merch',
        title: 'Dog Mom Merch',
        description: 'Coming Soon #2026',
        priceLabel: '$33.00',
        compareAtPriceLabel: '$41.00',
        status: 'coming-soon',
        inventory: 0
      }
    ];

    for (const product of products) {
      await db.collection('products').updateOne(
        { slug: product.slug },
        { $set: product },
        { upsert: true }
      );
    }
    console.log(`✅ Synced ${products.length} products`);

    // Sync Team Members
    console.log('\n📦 Syncing Team Members...');
    const team = [
      {
        slug: 'sunny',
        name: 'Sunny',
        role: 'Founder · Sunnyism.Pro #DogDad',
        bio: 'Meet Sunnyism.Pro #DogDad — thoughts, vision, and the journey ahead for DTdogs.ca across Downtown Toronto and the GTA.',
        credentials: ['Founder', 'GTA Pet Care'],
        status: 'published'
      },
      {
        slug: 'pawmily',
        name: 'PawMily',
        role: 'Toronto',
        bio: 'Grooming, walks, sitting services across Toronto.',
        credentials: ['Grooming', 'Dog Walking', 'Pet Sitting'],
        instagram: 'https://www.instagram.com/pawmily.ca/',
        status: 'published'
      },
      {
        slug: 'yazz',
        name: 'Yazz',
        role: 'East Toronto',
        bio: 'Professional grooming services in East Toronto.',
        credentials: ['Grooming'],
        instagram: 'https://www.instagram.com/kiss.the.paws/',
        status: 'published'
      },
      {
        slug: 'suzanne',
        name: 'Suzanne',
        role: 'West Toronto',
        bio: 'Sunny Paws Grooming — professional pet grooming in West Toronto.',
        credentials: ['Grooming'],
        instagram: 'https://www.instagram.com/sunny.pawsgrooming/',
        status: 'published'
      },
      {
        slug: 'shanice',
        name: 'Shanice',
        role: 'All Over Canada',
        bio: 'The Prudent Tooth Fairy — professional teeth cleaning service across Canada.',
        credentials: ['Teeth Cleaning'],
        instagram: 'https://www.instagram.com/theprudenttoothfairy/',
        status: 'published'
      },
      {
        slug: 'cass',
        name: 'Cass',
        role: 'Canada',
        bio: 'Wagging Through Life — professional pet sitter across Canada.',
        credentials: ['Pet Sitting'],
        instagram: 'https://www.instagram.com/wagging_through_life/',
        status: 'published'
      }
    ];

    for (const member of team) {
      await db.collection('teammembers').updateOne(
        { slug: member.slug },
        { $set: member },
        { upsert: true }
      );
    }
    console.log(`✅ Synced ${team.length} team members`);

    console.log('\n✅ All data synced successfully!');
    console.log('💡 You can now view updated data in admin panel');

  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

syncAdminData();

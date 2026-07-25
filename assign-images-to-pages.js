// Script to assign existing images to their respective pages
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/dtdogs";

async function assignImagesToPages() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const mediaCollection = db.collection("mediaassets");

    // Get all media items
    const allMedia = await mediaCollection.find({}).toArray();
    console.log(`\nFound ${allMedia.length} total media items`);

    // Image ID to page mapping based on the site structure
    const imagePageMap = {
      // Home page images
      "hero-caregiver": "home",
      "floating-pup": "home",
      "floating-pup-2": "home",
      "walk-toronto": "home",
      "boarding-home": "home",
      "daycare-play": "home",
      "trust-full": "home",
      "hero-wave": "home",
      "home-story-generated": "home",
      "home-why-a-generated": "home",
      "home-why-b-generated": "home",
      "home-gallery-generated": "home",
      "home-booking-generated": "home",

      // About page images
      "about-founder": "about",
      "about-1": "about",
      "about-2": "about",
      "about-3": "about",
      "about-generated-hero": "about",
      "structured-routines-card": "about",
      "honest-communication-card": "about",
      "clean-environments-card": "about",
      "facility": "about",
      "toronto-lifestyle": "about",
      "booking-bg-2": "about",

      // Services page images
      "services-generated-hero": "services",
      "service-dog-walking-hero": "services",
      "service-grooming-hero": "services",
      "service-daycare-hero": "services",
      "service-boarding-hero": "services",
      "service-nail-trim-hero": "services",
      "service-behaviour-training-hero": "services",
      "service-pet-dental-cleaning-hero": "services",
      "pet-visit": "services",
      "house-sitting": "services",
      "chauffeur": "services",
      "grooming": "services",
      "nails": "services",
      "training": "services",
      "excursion": "services",
      "behaviour-training1": "services",
      "behaviour-training2": "services",
      "nail-trimming1": "services",
      "nail-trimming2": "services",
      "dog-boarding1": "services",
      "dog-boarding2": "services",
      "daycare1": "services",
      "daycare2": "services",
      "dog-grooming1": "services",
      "dog-grooming2": "services",
      "dog-walking1": "services",
      "dog-walking2": "services",
      "pet-cleaning": "services",
      "pet-cleaning1": "services",
      "pet-cleaning2": "services",

      // Pricing page
      "pricing-generated-hero": "pricing",

      // Gallery page
      "gallery-generated-hero": "gallery",
      "gallery-hero-1": "gallery",
      "gallery-hero-2": "gallery",
      "gallery-hero-3": "gallery",

      // Shop page images
      "shop-mom": "shop",
      "shop-dad": "shop",
      "shop-hero-1": "shop",
      "shop-hero-2": "shop",
      "shop-generated-hero": "shop",
      "gift-card-50-image": "shop",
      "gift-card-100-image": "shop",

      // Testimonials page
      "testimonial-pet": "testimonials",
      "testimonials-generated-hero": "testimonials",

      // Blog page
      "blog-cover": "blog",
      "blog-generated-hero": "blog",

      // Contact page
      "contact-dog": "contact",
      "contact-generated-hero": "contact",

      // Team page
      "team-generated-hero": "team",

      // FAQ page
      "faq-generated-hero": "faq",

      // Booking page
      "booking-bg": "booking",
      "booking-generated-hero": "booking",

      // Treats page
      "treats-generated-hero": "treats",

      // Policy pages
      "policy-care": "policy",
      "privacy-generated-hero": "policy",
      "terms-generated-hero": "policy",
      "cancellation-generated-hero": "policy",

      // Gift cards
      "gift-cards-generated-hero": "gift-cards",
    };

    let updatedCount = 0;
    let skippedCount = 0;

    for (const media of allMedia) {
      // Check if this image ID is in our mapping
      const assignedPage = imagePageMap[media.id];

      if (assignedPage) {
        // Update the page field
        await mediaCollection.updateOne(
          { _id: media._id },
          { $set: { page: assignedPage } }
        );
        console.log(`✅ Assigned "${media.id}" to "${assignedPage}" page`);
        updatedCount++;
      } else {
        // Check if it's a gallery slot image
        if (media.id && media.id.startsWith("gallery-slot-")) {
          await mediaCollection.updateOne(
            { _id: media._id },
            { $set: { page: "gallery" } }
          );
          console.log(`✅ Assigned "${media.id}" to "gallery" page`);
          updatedCount++;
        } else {
          console.log(`⏭️  Skipped "${media.id}" (no mapping found)`);
          skippedCount++;
        }
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ Assignment complete!");
    console.log(`Updated: ${updatedCount} images`);
    console.log(`Skipped: ${skippedCount} images`);
    console.log("=".repeat(50));

    // Show page counts
    console.log("\nImages per page:");
    const pages = [
      "home",
      "about",
      "services",
      "pricing",
      "gallery",
      "shop",
      "testimonials",
      "blog",
      "contact",
      "team",
    ];

    for (const page of pages) {
      const count = await mediaCollection.countDocuments({ page });
      console.log(`  ${page}: ${count} images`);
    }

    const unassigned = await mediaCollection.countDocuments({
      $or: [{ page: "" }, { page: null }, { page: { $exists: false } }],
    });
    console.log(`  unassigned: ${unassigned} images`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

assignImagesToPages();

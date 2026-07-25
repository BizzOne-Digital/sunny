// Script to sync hardcoded media library images to MongoDB
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/dtdogs";

// Image ID to page mapping
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

  // About page images
  "about-founder": "about",
  "about-1": "about",
  "about-2": "about",
  "about-3": "about",
  "structured-routines-card": "about",
  "honest-communication-card": "about",
  "clean-environments-card": "about",
  "facility": "about",
  "toronto-lifestyle": "about",
  "booking-bg-2": "about",

  // Services page images
  "pet-visit": "services",
  "house-sitting": "services",
  "chauffeur": "services",
  "grooming": "services",
  "nails": "services",
  "training": "services",
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
  "excursion": "services",

  // Shop page images
  "shop-mom": "shop",
  "shop-dad": "shop",
  "shop-hero-1": "shop",
  "shop-hero-2": "shop",
  "gift-card-50-image": "shop",
  "gift-card-100-image": "shop",

  // Testimonials page
  "testimonial-pet": "testimonials",

  // Blog page
  "blog-cover": "blog",

  // Contact page
  "contact-dog": "contact",

  // Policy pages
  "policy-care": "policy",
};

async function syncMediaToDB() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    const mediaCollection = db.collection("mediaassets");

    // Import the hardcoded media from site.ts
    // Since we can't import ES modules in this script, we'll manually define the key images
    const keyImages = [
      {
        id: "hero-caregiver",
        title: "Calm dog with caregiver",
        alt: "Calm dog sitting beside a caring handler in warm natural light",
        url: "/images/home/hero-caregiver.webp",
        width: 1800,
        height: 1200,
        page: "home",
        tags: ["hero", "care"],
        status: "published",
      },
      {
        id: "floating-pup",
        title: "Happy relaxed dog portrait",
        alt: "Happy relaxed dog portrait against a warm interior background",
        url: "/images/home/floating-pup.webp",
        width: 1200,
        height: 1500,
        page: "home",
        tags: ["portrait"],
        status: "published",
      },
      {
        id: "walk-toronto",
        title: "Neighbourhood dog walk",
        alt: "Dog enjoying a structured neighbourhood walk in Toronto",
        url: "/images/services/serviceswalk-toronto.webp",
        width: 1400,
        height: 1000,
        page: "home",
        tags: ["dog-walking"],
        status: "published",
      },
      {
        id: "boarding-home",
        title: "Home style boarding rest",
        alt: "Dog resting comfortably in a clean home style boarding environment",
        url: "/images/services/servicesboarding-home.webp",
        width: 1400,
        height: 1000,
        page: "home",
        tags: ["boarding"],
        status: "published",
      },
      {
        id: "daycare-play",
        title: "Supervised daycare play",
        alt: "Dogs enjoying supervised social play in a bright daycare setting",
        url: "/images/services/servicesdaycare-play.webp",
        width: 1400,
        height: 1000,
        page: "home",
        tags: ["daycare"],
        status: "published",
      },
      {
        id: "about-founder",
        title: "Founder care portrait",
        alt: "Pet-care professional connecting with a calm dog",
        url: "/images/about/about-founder.webp",
        width: 1400,
        height: 1600,
        page: "about",
        tags: ["team"],
        status: "published",
      },
      {
        id: "facility",
        title: "Clean care environment",
        alt: "Bright clean care environment prepared for pet comfort",
        url: "/images/about/facility.webp",
        width: 1600,
        height: 1000,
        page: "about",
        tags: ["facility"],
        status: "published",
      },
      {
        id: "grooming",
        title: "Grooming detail",
        alt: "Well-groomed dog with a calm confident expression",
        url: "/images/services/servicesgrooming.webp",
        width: 1400,
        height: 1000,
        page: "services",
        tags: ["grooming"],
        status: "published",
      },
      {
        id: "shop-mom",
        title: "Dog Mom long-sleeve shirt",
        alt: "Dog Mom long-sleeve shirt product photography placeholder",
        url: "/images/shop/shop-mom.webp",
        width: 1200,
        height: 1400,
        page: "shop",
        tags: ["product"],
        status: "published",
      },
      {
        id: "shop-dad",
        title: "Dog Dad long-sleeve shirt",
        alt: "Dog Dad long-sleeve shirt product photography placeholder",
        url: "/images/shop/shop-dad.webp",
        width: 1200,
        height: 1400,
        page: "shop",
        tags: ["product"],
        status: "published",
      },
      {
        id: "testimonial-pet",
        title: "Happy client dog",
        alt: "Happy client dog looking comfortable and cared for",
        url: "/images/testimonial/testimonial-pet.webp",
        width: 1200,
        height: 1200,
        page: "testimonials",
        tags: ["testimonial"],
        status: "published",
      },
      {
        id: "blog-cover",
        title: "Care guide journal cover",
        alt: "Dog resting while pet-care notes are prepared nearby",
        url: "/images/blog/blog-cover.webp",
        width: 1400,
        height: 1000,
        page: "blog",
        tags: ["journal"],
        status: "published",
      },
      {
        id: "contact-dog",
        title: "Friendly contact portrait",
        alt: "Friendly dog portrait inviting pet parents to contact DTdogs",
        url: "/images/contact/contact-dog.webp",
        width: 1400,
        height: 1100,
        page: "contact",
        tags: ["contact"],
        status: "published",
      },
    ];

    let addedCount = 0;
    let existingCount = 0;

    for (const image of keyImages) {
      const exists = await mediaCollection.findOne({ id: image.id });

      if (exists) {
        // Update page field if missing
        if (!exists.page) {
          await mediaCollection.updateOne(
            { id: image.id },
            { $set: { page: image.page } }
          );
          console.log(`✅ Updated page for "${image.id}" → ${image.page}`);
        } else {
          console.log(`⏭️  "${image.id}" already exists`);
        }
        existingCount++;
      } else {
        await mediaCollection.insertOne(image);
        console.log(`✅ Added "${image.id}" → ${image.page}`);
        addedCount++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ Sync complete!");
    console.log(`Added: ${addedCount} images`);
    console.log(`Already existed: ${existingCount} images`);
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

syncMediaToDB();

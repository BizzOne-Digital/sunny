const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/dtdogs";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const gallerySchema = new mongoose.Schema({
  id: String,
  title: String,
  alt: String,
  caption: String,
  url: String,
  width: Number,
  height: Number,
  tags: [String],
  status: String,
  order: Number,
}, { timestamps: true });

const Gallery = mongoose.model("Gallery", gallerySchema);

async function seedGallery() {
  try {
    console.log("🖼️ Seeding gallery images...\n");

    // Delete existing gallery images
    await Gallery.deleteMany({});
    console.log("✅ Cleared existing gallery");

    const galleryImages = [
      // Service Images
      {
        id: "gallery-1",
        title: "Dog Walking in Toronto",
        alt: "Dog enjoying a structured neighbourhood walk in Toronto",
        caption: "Professional dog walking services across GTA",
        url: "/images/services/dog-walking1.png",
        width: 1400,
        height: 1000,
        tags: ["Dog Walking", "Toronto Adventures"],
        status: "published",
        order: 1,
      },
      {
        id: "gallery-2",
        title: "Professional Dog Grooming",
        alt: "Dog receiving professional grooming care",
        url: "/images/services/dog-grooming1.png",
        width: 1400,
        height: 1000,
        tags: ["Grooming", "Care"],
        status: "published",
        order: 2,
      },
      {
        id: "gallery-3",
        title: "Dog Daycare Fun",
        alt: "Dogs enjoying supervised daycare play",
        url: "/images/services/daycare1.png",
        width: 1400,
        height: 1000,
        tags: ["Daycare", "Happy Clients"],
        status: "published",
        order: 3,
      },
      {
        id: "gallery-4",
        title: "Comfortable Boarding",
        alt: "Dogs resting comfortably in boarding environment",
        url: "/images/services/dog-boarding1.png",
        width: 1400,
        height: 1000,
        tags: ["Boarding", "Care"],
        status: "published",
        order: 4,
      },
      {
        id: "gallery-5",
        title: "Nail Trimming Service",
        alt: "Gentle nail trimming for dog paw care",
        url: "/images/services/nail-trimming1.png",
        width: 1400,
        height: 1000,
        tags: ["Grooming", "Care"],
        status: "published",
        order: 5,
      },
      {
        id: "gallery-6",
        title: "Behaviour Training",
        alt: "Dog receiving positive behaviour training",
        url: "/images/services/Behaviour-Training1.webp",
        width: 1400,
        height: 1000,
        tags: ["Training", "Team"],
        status: "published",
        order: 6,
      },
      {
        id: "gallery-7",
        title: "Pet Dental Cleaning",
        alt: "Professional pet dental care and teeth brushing",
        url: "/images/services/pet-cleaning.png",
        width: 1400,
        height: 1000,
        tags: ["Grooming", "Care"],
        status: "published",
        order: 7,
      },
      {
        id: "gallery-8",
        title: "Dog Walking Adventure",
        alt: "Calm structured neighbourhood dog walk",
        url: "/images/services/dog-walking2.png",
        width: 1400,
        height: 1000,
        tags: ["Dog Walking", "Toronto Adventures"],
        status: "published",
        order: 8,
      },
      {
        id: "gallery-9",
        title: "Grooming Session",
        alt: "Calm dog being professionally groomed",
        url: "/images/services/dog-grooming2.png",
        width: 1400,
        height: 1000,
        tags: ["Grooming", "Happy Clients"],
        status: "published",
        order: 9,
      },
      {
        id: "gallery-10",
        title: "Supervised Daycare",
        alt: "Dogs enjoying safe daycare environment",
        url: "/images/services/daycare2.png",
        width: 1400,
        height: 1000,
        tags: ["Daycare", "Care"],
        status: "published",
        order: 10,
      },
      {
        id: "gallery-11",
        title: "Overnight Boarding",
        alt: "Comfortable overnight dog boarding care",
        url: "/images/services/dog-boarding2.png",
        width: 1400,
        height: 1000,
        tags: ["Boarding", "Trust"],
        status: "published",
        order: 11,
      },
      {
        id: "gallery-12",
        title: "Professional Nail Care",
        alt: "Professional dog nail trimming service",
        url: "/images/services/nail-trimming2.png",
        width: 1400,
        height: 1000,
        tags: ["Grooming", "Care"],
        status: "published",
        order: 12,
      },
      // About Images
      {
        id: "gallery-13",
        title: "Clean Care Environment",
        alt: "Bright clean dog-care environment with calm dogs resting",
        caption: "Our facility - clean, comfortable, and safe",
        url: "/images/about/about-2.png",
        width: 1024,
        height: 576,
        tags: ["Facility", "Behind The Scenes"],
        status: "published",
        order: 13,
      },
      {
        id: "gallery-14",
        title: "Toronto Pet Lifestyle",
        alt: "Dog handler walking a happy dog through a leafy neighbourhood",
        caption: "Serving across the Greater Toronto Area",
        url: "/images/about/about-3.png",
        width: 819,
        height: 1024,
        tags: ["Toronto", "Dog Walking"],
        status: "published",
        order: 14,
      },
      {
        id: "gallery-15",
        title: "Structured Care Routines",
        alt: "Calm dog receiving gentle structured care",
        caption: "Predictable routines pets recognize",
        url: "/images/about/Structured-Routines-Card.jpg",
        width: 1400,
        height: 1050,
        tags: ["Care", "Trust"],
        status: "published",
        order: 15,
      },
      {
        id: "gallery-16",
        title: "Honest Communication",
        alt: "Happy dog near care notes and updates",
        caption: "Clear updates for peace of mind",
        url: "/images/about/Honest-Communication-Card.jpg",
        width: 1400,
        height: 1050,
        tags: ["Team", "Care"],
        status: "published",
        order: 16,
      },
      {
        id: "gallery-17",
        title: "Clean Environments",
        alt: "Clean modern pet-care environment",
        caption: "Hygiene and comfort as core standards",
        url: "/images/about/Clean-Environments-Card.jpg",
        width: 1400,
        height: 1050,
        tags: ["Facility", "Care"],
        status: "published",
        order: 17,
      },
      {
        id: "gallery-18",
        title: "Founder with Dog",
        alt: "Pet-care professional connecting with a calm dog",
        caption: "Meet our team of #petpeople",
        url: "/images/about/about-founder.webp",
        width: 1400,
        height: 1600,
        tags: ["Team", "Portrait"],
        status: "published",
        order: 18,
      },
    ];

    await Gallery.insertMany(galleryImages);
    console.log(`✅ Added ${galleryImages.length} gallery images`);

    console.log("\n🎉 Gallery seeded successfully!");
    
    // Show summary
    const tags = [...new Set(galleryImages.flatMap(img => img.tags))];
    console.log(`\n📊 Total images: ${galleryImages.length}`);
    console.log(`📋 Categories: ${tags.join(", ")}`);

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
  }
}

seedGallery();

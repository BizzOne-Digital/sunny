const mongoose = require("mongoose");

const gallerySlotMeta = [
  { title: "Morning courtyard stroll", alt: "Happy dog enjoying a calm morning courtyard walk", caption: "Soft light and steady leash manners.", tags: ["Dog Walking", "Toronto Adventures"] },
  { title: "Cozy boarding nap", alt: "Dog resting comfortably during overnight boarding", caption: "Home-style rest between play windows.", tags: ["Boarding", "Seasonal"] },
  { title: "Daycare socialization circle", alt: "Dogs gathering calmly during supervised daycare play", caption: "Structured social time with attentive supervision.", tags: ["Daycare", "Happy Clients"] },
  { title: "In-home visit check-in", alt: "Caregiver greeting a dog during an in-home pet visit", caption: "Familiar space, gentle attention.", tags: ["Pet Visits", "Care"] },
  { title: "House sitting comfort", alt: "Dog relaxing at home during house sitting care", caption: "Routine kept while you are away.", tags: ["House Sitting", "Trust"] },
  { title: "Secure chauffeur ride", alt: "Dog settled safely for a pet chauffeur trip", caption: "Calm transport across the GTA.", tags: ["Chauffeur", "Toronto Adventures"] },
  { title: "Fresh grooming finish", alt: "Well-groomed dog after a tidy grooming session", caption: "Clean coat, calm handling.", tags: ["Grooming", "Care"] },
  { title: "Gentle nail trim", alt: "Dog receiving a careful nail trim", caption: "Steady paws and patient care.", tags: ["Nail Trimming", "Grooming"] },
  { title: "Focused training moment", alt: "Dog practicing a calm cue during training", caption: "Clear cues, positive reinforcement.", tags: ["Training", "Team"] },
  { title: "Park excursion adventure", alt: "Dog on a guided outdoor excursion through a leafy park", caption: "Enrichment beyond the neighbourhood block.", tags: ["Excursions", "Toronto Adventures"] },
  { title: "Team with #petparents", alt: "Care team member connecting with a happy dog", caption: "We are a team of #petpeople and #petparents.", tags: ["Team", "Behind The Scenes"] },
  { title: "Bright facility lounge", alt: "Dogs resting in a clean bright care lounge", caption: "Clean spaces prepared for comfort.", tags: ["Facility", "Care"] },
  { title: "Downtown Toronto walk", alt: "Dog walking through a Downtown Toronto neighbourhood", caption: "Serving across GTA, every season.", tags: ["Toronto", "Dog Walking"] },
  { title: "Trusted calm routine", alt: "Dog settling into a familiar daily care routine", caption: "Predictable care that pets recognize.", tags: ["Trust", "Care"] },
  { title: "Happy client portrait", alt: "Relaxed client dog smiling after a care visit", caption: "Moments our pet parents love to see.", tags: ["Happy Clients", "Portrait"] },
  { title: "Booking day readiness", alt: "Dog waiting calmly before a booked care appointment", caption: "Meet & Greet through confirmed care days.", tags: ["Booking", "Care"] },
  { title: "Contact desk welcome", alt: "Friendly dog near the studio entrance ready to greet visitors", caption: "Say hello — we are here to help.", tags: ["Contact", "Team"] },
  { title: "Journal cover quiet hour", alt: "Dog resting beside a notebook during a quiet care hour", caption: "Stories from calm stays and walks.", tags: ["Journal", "Portrait"] },
];

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/dtdogs", {
    dbName: "dtdogs",
    serverSelectionTimeoutMS: 8000,
  });

  const collection = mongoose.connection.db.collection("galleries");
  await collection.deleteMany({});

  const docs = gallerySlotMeta.map((meta, index) => {
    const n = String(index + 1).padStart(2, "0");
    return {
      id: `gallery-slot-${n}`,
      title: meta.title,
      alt: meta.alt,
      caption: meta.caption,
      url: `/images/gallery/gallery-slot-${n}.webp`,
      width: 1400,
      height: 1000,
      page: "gallery",
      tags: meta.tags,
      order: index + 1,
      status: "published",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  await collection.insertMany(docs);
  console.log(`Seeded ${docs.length} gallery images`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

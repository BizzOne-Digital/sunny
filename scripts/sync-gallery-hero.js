const mongoose = require("mongoose");

const images = [
  {
    id: "gallery-generated-hero",
    title: "Gallery hero background",
    alt: "Well-groomed dog enjoying a golden-hour Toronto courtyard walk",
    url: "/images/gallery/gallery-hero.png",
    width: 1800,
    height: 1200,
    page: "gallery",
    status: "published",
  },
  {
    id: "gallery-hero-1",
    title: "Courtyard dog walk",
    alt: "Small happy dog walking calmly through a clean modern outdoor courtyard",
    url: "/images/gallery/gallery-1.png",
    width: 1400,
    height: 1000,
    page: "gallery",
    status: "published",
  },
  {
    id: "gallery-hero-2",
    title: "Autumn leash walk",
    alt: "Dog walking safely on leash through a warm autumn park trail",
    url: "/images/gallery/gallery-2.png",
    width: 1400,
    height: 1000,
    page: "gallery",
    status: "published",
  },
  {
    id: "gallery-hero-3",
    title: "Indoor care moment",
    alt: "Dogs calmly gathered in a cozy modern indoor care lounge",
    url: "/images/gallery/gallery-3.png",
    width: 1400,
    height: 1000,
    page: "gallery",
    status: "published",
  },
];

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/dtdogs", { dbName: "dtdogs" });
  const result = await mongoose.connection.db.collection("pages").updateOne(
    { slug: "gallery" },
    { $set: { "hero.images": images } },
    { upsert: true },
  );
  console.log("matched", result.matchedCount, "modified", result.modifiedCount, "upserted", result.upsertedCount);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
